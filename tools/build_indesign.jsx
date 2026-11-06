// SD Projects social templates: InDesign build script (ExtendScript).
// Driven by tools/figma_layouts.json and brand/color-palette-strom-refined.json.
// Run one stage at a time through the InDesign MCP:
//   $.evalFile(File("/.../tools/build_indesign.jsx")); S.src1();
// Stages are idempotent where practical (source stages wipe and rebuild).
// See GLOSSARY.md for vocabulary (Programme, Format, Treatment, Layout, Role swatch ...).

// ROOT is the repo folder, found from this script's own location so renaming or moving the repo is safe.
var ROOT = File($.fileName).parent.parent.fsName + "/";
var IND = ROOT + "indesign/";
var LINKS = IND + "links/";
var FONT = "Archivo";

function readText(p) { var f = File(p); f.encoding = "UTF-8"; f.open("r"); var t = f.read(); f.close(); return t; }
function parseJSON(t) { return eval("(" + t + ")"); }
var DATA = parseJSON(readText(ROOT + "tools/figma_layouts.json").split("{BR}").join("\\n"));
var PAL = parseJSON(readText(ROOT + "brand/color-palette-strom-refined.json")).colors;

var STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
var ROLE_DEFAULTS = "events"; // source file holds Events values as neutral placeholders

// Type scale (Figma % x 10 = InDesign tracking). [name, style, size, leading, tracking, centred?, spaceAfter]
var TYPE = [
  ["Display", "Bold", 252, 200, -60, false, 0],
  ["Display centred", "Bold", 252, 200, -60, true, 0],
  ["Headline", "Bold", 96, 88, -50, false, 96],
  ["Headline centred", "Bold", 96, 88, -50, true, 96],
  ["Cover question", "Bold", 128, 116, -50, false, 0],
  ["Statement", "Regular", 60, 60, -30, false, 0],
  ["Statement Bold", "Bold", 60, 60, -50, false, 0],
  ["Body", "Regular", 36, 36, -30, false, 0],
  ["Body Bold", "Bold", 36, 36, -30, false, 0],
  ["Micro", "Regular", 28, 28, -30, false, 0]
];
// Paragraph style groups: group name -> role swatch used for text colour. Hero is the root; the others are based on it.
var GROUPS = [["On Hero", "Hero ink"], ["On Light", "Light ink"], ["On Overlay", "Overlay ink"], ["On Accent", "Light accent"], ["On Artwork", "Hero"]];
var TREAT_GROUP = { "Hero": "On Hero", "Light": "On Light", "Overlay": "On Overlay" };

// ---------- helpers ----------
function hexRgb(h) { h = h.replace("#", ""); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
function palHex(ref) { var p = ref.split("."); var step = String(parseInt(p[1], 10)); return PAL[p[0]][step].hex; }
function stepLabel(s) { return s.length < 3 ? "0" + s : s; }
function ensure(coll, name, props) { var o = coll.itemByName(name); if (!o.isValid) { props = props || {}; props.name = name; o = coll.add(props); } return o; }
function setColor(doc, name, hex) {
  var c = ensure(doc.colors, name);
  c.model = ColorModel.PROCESS; c.space = ColorSpace.RGB; c.colorValue = hexRgb(hex);
  return c;
}
function sw(doc, name) { return doc.swatches.itemByName(name); }
function openDoc(path) {
  for (var i = 0; i < app.documents.length; i++) { if (app.documents[i].fullName.fsName == File(path).fsName) { return app.documents[i]; } }
  return app.open(File(path));
}
function closeAll() { while (app.documents.length) { app.documents[0].close(SaveOptions.NO); } }
function layerOf(doc, n) { return doc.layers.itemByName(n); }
function fmtOf(k) { return DATA.formats[k]; }
function psOf(doc, group, name) { return doc.paragraphStyleGroups.itemByName(group).paragraphStyles.itemByName(name); }
function osOf(doc, name) { return doc.objectStyles.itemByName(name); }
function gb(x, y, w, h) { return [y, x, y + h, x + w]; }

function setupDoc(doc) {
  doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.PIXELS;
  doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;
  doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
  doc.documentPreferences.facingPages = false;
  doc.pasteboardPreferences.pasteboardMargins = [600, 600];
  doc.documentPreferences.documentBleedUniformSize = true;
  doc.documentPreferences.documentBleedTopOffset = 0;
  var g = doc.gridPreferences;
  g.baselineStart = 32; g.baselineDivision = 4;
  g.baselineGridRelativeOption = BaselineGridRelativeOption.TOP_OF_PAGE_OF_BASELINE_GRID_RELATIVE_OPTION;
  g.baselineViewThreshold = 25;
}

// ---------- source: stage 1 (wipe, layers, swatches, type styles) ----------
var S = {};
S.src1 = function () {
  closeAll();
  var doc = app.open(File(IND + "SD-Social-Source.indd"));
  setupDoc(doc);
  // wipe pages and parents
  while (doc.pages.length > 1) { doc.pages[doc.pages.length - 1].remove(); }
  var p = doc.pages[0];
  p.appliedMaster = NothingEnum.NOTHING;
  var its = p.allPageItems; for (var i = its.length - 1; i >= 0; i--) { try { its[i].remove(); } catch (e) { } }
  for (var i = doc.masterSpreads.length - 1; i >= 0; i--) { try { doc.masterSpreads[i].remove(); } catch (e) { } }
  // layers: create ours (bottom-to-top), then drop stock layers
  var want = ["Background", "Images", "Graphics", "Text", "Guides", "Preview"];
  for (var i = 0; i < want.length; i++) { ensure(doc.layers, want[i]); }
  for (var i = doc.layers.length - 1; i >= 0; i--) { var nm = doc.layers[i].name; var keep = false; for (var j = 0; j < want.length; j++) { if (want[j] == nm) keep = true; } if (!keep && doc.layers.length > 1) { doc.layers[i].remove(); } }
  // order top->bottom: Guides, Text, Graphics, Images, Background, Preview
  var order = ["Guides", "Text", "Graphics", "Images", "Background", "Preview"];
  for (var i = order.length - 1; i >= 0; i--) { layerOf(doc, order[i]).move(LocationOptions.AT_BEGINNING); }
  // (loop above moves each to the front in reverse so final order = order[])
  var L = layerOf(doc, "Guides"); L.visible = false; L.printable = false;
  L = layerOf(doc, "Preview"); L.printable = false;
  // styles: remove stock
  for (var i = doc.paragraphStyles.length - 1; i >= 0; i--) { var s = doc.paragraphStyles[i]; if (s.name.indexOf("[") != 0) { try { s.remove(); } catch (e) { } } }
  for (var i = doc.paragraphStyleGroups.length - 1; i >= 0; i--) { try { doc.paragraphStyleGroups[i].remove(); } catch (e) { } }
  for (var i = doc.characterStyles.length - 1; i >= 0; i--) { var s = doc.characterStyles[i]; if (s.name.indexOf("[") != 0) { try { s.remove(); } catch (e) { } } }
  for (var i = doc.objectStyles.length - 1; i >= 0; i--) { var s = doc.objectStyles[i]; if (s.name.indexOf("[") != 0) { try { s.remove(); } catch (e) { } } }
  for (var i = doc.objectStyleGroups.length - 1; i >= 0; i--) { try { doc.objectStyleGroups[i].remove(); } catch (e) { } }
  // swatches
  for (var i = doc.swatches.length - 1; i >= 0; i--) { var s = doc.swatches[i]; var n = s.name; if (n != "None" && n != "Paper" && n != "Black" && n != "Registration") { try { s.remove(); } catch (e) { } } }
  S.roles(doc, "events");
  setColor(doc, "Image placeholder", "#D9D9D6");
  setColor(doc, "Guide zone", "#FF0080");
  S.type(doc);
  doc.save(File(IND + "SD-Social-Source.indd"));
  return "src1 ok layers=" + doc.layers.length + " ps=" + doc.paragraphStyles.length + " sw=" + doc.swatches.length;
};

// set the seven role swatches from a programme definition
S.roles = function (doc, progKey) {
  var prog = null;
  for (var k in DATA.programmes) { if (DATA.programmes[k].family == progKey) prog = DATA.programmes[k]; }
  for (var i = 0; i < DATA.roleOrder.length; i++) {
    var r = DATA.roleOrder[i];
    setColor(doc, r, palHex(prog.roles[r]));
  }
};

S.type = function (doc) {
  var cs = ensure(doc.characterStyles, "Bold"); cs.fontStyle = "Bold";
  cs = ensure(doc.characterStyles, "Italic"); cs.fontStyle = "Italic";
  for (var g = 0; g < GROUPS.length; g++) {
    var grp = ensure(doc.paragraphStyleGroups, GROUPS[g][0]);
    for (var t = 0; t < TYPE.length; t++) {
      var T = TYPE[t];
      var ps = grp.paragraphStyles.add({ name: T[0] });
      if (g == 0) {
        ps.appliedFont = FONT; ps.fontStyle = T[1];
        ps.pointSize = T[2]; ps.leading = T[3]; ps.tracking = T[4];
        ps.kerningMethod = "$ID/Metrics";
        ps.alignToBaseline = true;
        ps.justification = T[5] ? Justification.CENTER_ALIGN : Justification.LEFT_ALIGN;
        ps.hyphenation = false;
        ps.balanceRaggedLines = BalanceLinesStyle.FULLY_BALANCED;
        ps.spaceBefore = T[6]; ps.spaceAfter = 0;
        ps.firstLineIndent = 0; ps.leftIndent = 0; ps.rightIndent = 0;
        ps.fillColor = sw(doc, GROUPS[g][1]);
      } else {
        ps.basedOn = psOf(doc, "On Hero", T[0]);
        ps.fillColor = sw(doc, GROUPS[g][1]);
      }
    }
  }
};

// ---------- source: stage 2 (object styles) ----------
S.src2 = function () {
  var doc = openDoc(IND + "SD-Social-Source.indd");
  var none = sw(doc, "None");
  function mk(name, base) {
    var o = ensure(doc.objectStyles, name);
    if (base) o.basedOn = osOf(doc, base);
    return o;
  }
  function fill(o, swName) { o.enableFill = true; o.fillColor = swName ? sw(doc, swName) : none; o.enableStroke = true; o.strokeColor = none; o.strokeWeight = 0; }
  // Image frame
  var im = mk("Image frame");
  fill(im, "Image placeholder");
  im.enableFrameFittingOptions = true;
  im.frameFittingOptions.autoFit = true;
  im.frameFittingOptions.fittingOnEmptyFrame = EmptyFrameFittingOptions.FILL_PROPORTIONALLY;
  im.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;
  var sf = mk("Silhouette frame");
  fill(sf, null);
  // Text frames
  function txt(name, vj, blend) {
    var t = mk(name);
    fill(t, null);
    t.enableTextFrameGeneralOptions = true;
    t.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT;
    t.textFramePreferences.minimumFirstBaselineOffset = 0;
    t.textFramePreferences.verticalJustification = vj;
    t.textFramePreferences.insetSpacing = [0, 0, 0, 0];
    t.textFramePreferences.autoSizingType = AutoSizingTypeEnum.OFF;
    if (blend) { t.transparencySettings.blendingSettings.blendMode = BlendMode.DIFFERENCE; }
    return t;
  }
  txt("Text frame", VerticalJustification.TOP_ALIGN, false);
  txt("Text frame bottom", VerticalJustification.BOTTOM_ALIGN, false);
  txt("Text frame centre", VerticalJustification.CENTER_ALIGN, false);
  txt("Text difference", VerticalJustification.TOP_ALIGN, true);
  txt("Text difference bottom", VerticalJustification.BOTTOM_ALIGN, true);
  // Panels, bars, backgrounds
  fill(mk("Panel Hero"), "Hero");
  fill(mk("Panel Light"), "Light");
  fill(mk("Panel Overlay"), "Overlay panel");
  fill(mk("Edge bar"), "Hero ink");
  fill(mk("Motif"), "Hero ink");
  fill(mk("Divider"), "Light ink");
  fill(mk("Divider ink"), "Hero ink");
  fill(mk("Background Hero"), "Hero");
  fill(mk("Background Light"), "Light");
  fill(mk("Guide zone"), "Guide zone");
  var gz = osOf(doc, "Guide zone"); gz.transparencySettings.blendingSettings.opacity = 25;
  var bb = mk("Border box");
  fill(bb, null); bb.strokeColor = sw(doc, "Hero ink"); bb.strokeWeight = 4; bb.strokeAlignment = StrokeAlignment.INSIDE_ALIGNMENT;
  var ob = mk("Overlay border");
  fill(ob, null); ob.strokeColor = sw(doc, "Hero"); ob.strokeWeight = 32; ob.strokeAlignment = StrokeAlignment.INSIDE_ALIGNMENT;
  doc.save();
  return "src2 ok ostyles=" + doc.objectStyles.length;
};

// ---------- parents ----------
function setGeometry(page, fmtKey) {
  var f = fmtOf(fmtKey);
  page.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.TOP_LEFT_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [f.w, f.h]);
  var m = page.marginPreferences;
  m.top = 32; m.left = 32; m.right = 32; m.bottom = f.bottom;
  m.columnCount = f.cols; m.columnGutter = 16;
}
function rowGuides(page, fmtKey) {
  var f = fmtOf(fmtKey);
  for (var r = 0; r < f.rows; r++) {
    var top = 32 + r * (f.rowH + 16);
    page.guides.add(undefined, { orientation: HorizontalOrVertical.HORIZONTAL, location: top });
    page.guides.add(undefined, { orientation: HorizontalOrVertical.HORIZONTAL, location: top + f.rowH });
  }
}
function newParent(doc, prefix, baseName, basedOn, fmtKey) {
  var m = doc.masterSpreads.add(1, { namePrefix: prefix, baseName: baseName });
  if (basedOn) { m.appliedMaster = basedOn; }
  setGeometry(m.pages[0], fmtKey);
  return m;
}
function findParentBase(doc, base) {
  for (var i = 0; i < doc.masterSpreads.length; i++) { if (doc.masterSpreads[i].baseName == base) return doc.masterSpreads[i]; }
  return null;
}
function groupFor(el, treatment, prog) {
  if (el.diff && prog && prog.diffText) return "On Artwork";
  return el.g ? el.g : TREAT_GROUP[treatment];
}
function findParent(doc, fullName) {
  for (var i = 0; i < doc.masterSpreads.length; i++) { if (doc.masterSpreads[i].name == fullName) return doc.masterSpreads[i]; }
  return null;
}
var PCOUNT = 0;
function nextPrefix(letter, doc) {
  // choose first unused prefix letter+NN in this document
  for (var n = 1; n < 100; n++) {
    var pre = letter + (n < 10 ? "0" + n : "" + n);
    var used = false;
    for (var i = 0; i < doc.masterSpreads.length; i++) { if (doc.masterSpreads[i].namePrefix == pre) used = true; }
    if (!used) return pre;
  }
  return letter + "99";
}

// create an item on a parent page from a layout element
function addElement(doc, page, el, ctx) {
  var k = el.k, item = null, os = null, ly = null;
  var b = gb(el.x, el.y, el.w, el.h);
  var prog = ctx.prog;
  if (k == "text") {
    ly = layerOf(doc, "Text");
    item = page.textFrames.add({ itemLayer: ly, geometricBounds: b });
    var osn = "Text frame";
    if (el.va == "bottom") osn = "Text frame bottom"; else if (el.va == "center") osn = "Text frame centre";
    if (el.diff && prog && prog.diffText) osn = (el.va == "bottom") ? "Text difference bottom" : "Text difference";
    item.applyObjectStyle(osOf(doc, osn), true);
    var grp = groupFor(el, ctx.treatment, prog);
    try { item.insertionPoints[0].appliedParagraphStyle = psOf(doc, grp, el.ps); } catch (e) { }
  } else if (k == "image") {
    ly = layerOf(doc, "Images");
    item = page.rectangles.add({ itemLayer: ly, geometricBounds: b });
    item.applyObjectStyle(osOf(doc, "Image frame"), true);
  } else if (k == "rect") {
    ly = layerOf(doc, "Graphics");
    item = page.rectangles.add({ itemLayer: ly, geometricBounds: b });
    item.applyObjectStyle(osOf(doc, el.os), true);
  } else if (k == "motif") {
    ly = layerOf(doc, "Graphics");
    for (var i = 0; i < prog.motif.length; i++) {
      var mx = prog.motif[i];
      var e = page.ovals.add({ itemLayer: ly, geometricBounds: gb(el.x + mx[0], el.y, mx[1], el.h) });
      e.applyObjectStyle(osOf(doc, "Motif"), true);
      e.name = el.n + " " + (i + 1);
    }
    return null;
  } else if (k == "sil") {
    ly = layerOf(doc, "Graphics");
    var r = prog.sil.rect;
    var cx1 = Math.max(r[0], 0), cy1 = Math.max(r[1], 0), cx2 = Math.min(r[0] + r[2], fmtOf(ctx.format).w), cy2 = Math.min(r[1] + r[3], fmtOf(ctx.format).h);
    item = page.rectangles.add({ itemLayer: ly, geometricBounds: [cy1, cx1, cy2, cx2] });
    item.applyObjectStyle(osOf(doc, "Silhouette frame"), true);
  } else if (k == "art") {
    if (prog.artKind == "sil") {
      ly = layerOf(doc, "Graphics");
      item = page.rectangles.add({ itemLayer: ly, geometricBounds: b });
      item.applyObjectStyle(osOf(doc, "Silhouette frame"), true);
    } else {
      ly = layerOf(doc, "Images");
      item = page.rectangles.add({ itemLayer: ly, geometricBounds: b });
      item.applyObjectStyle(osOf(doc, "Image frame"), true);
    }
  }
  if (item) { item.name = el.n; }
  return item;
}

function parentNameFor(L) { return L.treatment + " / " + L.name + " " + L.format; }

// structural + treatment parents for a format
function buildStructure(doc, fmtKey) {
  var st = findParent(doc, "S" + fmtKey.replace(":", "") + "-Structure " + fmtKey);
  return st;
}
S.src3 = function () {
  var doc = openDoc(IND + "SD-Social-Source.indd");
  var log = "";
  var pg = doc.pages[0]; pg.appliedMaster = NothingEnum.NOTHING;
  for (var q = doc.masterSpreads.length - 1; q >= 0; q--) { try { doc.masterSpreads[q].remove(); } catch (e) { } }
  for (var pass = 0; pass < 3; pass++) { for (var q = doc.masterSpreads.length - 1; q >= 0; q--) { try { doc.masterSpreads[q].remove(); } catch (e) { } } }
  var fmts = ["4:5", "9:16", "16:9"];
  var sp = {}, tp = {};
  // structural
  for (var i = 0; i < fmts.length; i++) {
    var fk = fmts[i];
    var pre = "S" + (i + 1);
    var m = newParent(doc, pre, "Structure " + fk, null, fk);
    rowGuides(m.pages[0], fk);
    if (fk == "9:16") {
      // Reel UI zones on the hidden Guides layer
      var gl = layerOf(doc, "Guides");
      var r1 = m.pages[0].rectangles.add({ itemLayer: gl, geometricBounds: gb(0, 0, 1080, 250), name: "Reel UI zone top" });
      r1.applyObjectStyle(osOf(doc, "Guide zone"), true);
      var r2 = m.pages[0].rectangles.add({ itemLayer: gl, geometricBounds: gb(0, 1580, 1080, 340), name: "Reel UI zone bottom" });
      r2.applyObjectStyle(osOf(doc, "Guide zone"), true);
    }
    sp[fk] = m;
  }
  // treatment
  var tr = ["Hero", "Light"];
  var ti = 0;
  for (var i = 0; i < fmts.length; i++) {
    for (var j = 0; j < tr.length; j++) {
      ti++;
      var fk = fmts[i];
      var m = newParent(doc, "T" + ti, tr[j] + " " + fk, sp[fk], fk);
      var f = fmtOf(fk);
      var bg = m.pages[0].rectangles.add({ itemLayer: layerOf(doc, "Background"), geometricBounds: gb(0, 0, f.w, f.h), name: tr[j] + " background" });
      bg.applyObjectStyle(osOf(doc, "Background " + tr[j]), true);
      tp[tr[j] + fk] = m;
    }
  }
  // shared layout parents
  var n = 0;
  for (var i = 0; i < DATA.layouts.length; i++) {
    var L = DATA.layouts[i];
    if (L.scope != "shared") continue;
    n++;
    var base = (L.treatment == "Overlay") ? sp[L.format] : tp[L.treatment + L.format];
    var m = newParent(doc, "L" + (n < 10 ? "0" + n : n), L.treatment + " / " + L.name + " " + L.format, base, L.format);
    for (var e = 0; e < L.el.length; e++) {
      addElement(doc, m.pages[0], L.el[e], { treatment: L.treatment, prog: null });
    }
  }
  doc.save();
  return "src3 ok parents=" + doc.masterSpreads.length;
};

// ---------- programme files ----------
function progByName(n) { return DATA.programmes[n]; }
function allLayoutsFor(progName) {
  var out = [];
  var fo = ["4:5", "9:16", "16:9"];
  for (var f = 0; f < fo.length; f++) {
    for (var i = 0; i < DATA.layouts.length; i++) {
      var L = DATA.layouts[i];
      if (L.format != fo[f]) continue;
      if (L.scope == "events" && progName != "Events") continue;
      out.push(L);
    }
  }
  return out;
}
function elByName(L, n) { for (var i = 0; i < L.el.length; i++) { if (L.el[i].n == n) return L.el[i]; } return null; }

function fillPage(doc, page, master, L, prog) {
  var items = master.pages[0].pageItems;
  var map = {};
  var list = [];
  for (var i = 0; i < items.length; i++) { list.push(items[i]); }
  var warn = "";
  for (var i = 0; i < list.length; i++) {
    var src = list[i];
    var o = src.override(page);
    o.geometricBounds = src.geometricBounds; // new pages start at the default size; re-assert parent geometry after resize
    var el = elByName(L, src.name);
    if (!el) { var nm = src.name.replace(/ \d+$/, ""); el = elByName(L, nm); }
    if (!el) continue;
    if (el.k == "text") {
      var txt = prog.copy[el.sl];
      if (txt === undefined) { warn += " nocopy:" + el.sl; continue; }
      o.contents = txt;
      var grp = groupFor(el, L.treatment, prog);
      o.parentStory.paragraphs.everyItem().appliedParagraphStyle = psOf(doc, grp, el.ps);
      if (o.overflows) { warn += " OVERSET:" + el.n; }
    } else if (el.k == "image") {
      try { o.place(File(LINKS + prog.images[el.im])); } catch (e) { warn += " PLACEFAIL:" + L.id + "/" + el.n + ":" + e; }
    } else if (el.k == "sil") {
      o.place(File(LINKS + prog.sil.mask));
      o.graphics[0].fillColor = sw(doc, "Hero ink");
      var rr = prog.sil.rect;
      o.graphics[0].geometricBounds = gb(rr[0], rr[1], rr[2], rr[3]);
    } else if (el.k == "art") {
      if (prog.artKind == "sil") {
        o.place(File(LINKS + prog.silCap));
        o.graphics[0].fillColor = sw(doc, "Hero ink");
        o.fit(FitOptions.FILL_PROPORTIONALLY);
      } else {
        o.place(File(LINKS + prog.images.art));
      }
    }
  }
  if (L.treatment == "Overlay") {
    var f = fmtOf(L.format);
    var pv = page.rectangles.add({ itemLayer: layerOf(doc, "Preview"), geometricBounds: gb(0, 0, f.w, f.h), name: "Sample video still" });
    pv.applyObjectStyle(osOf(doc, "Image frame"), true);
    pv.place(File(LINKS + prog.images.i1));
    pv.sendToBack();
  }
  return warn;
}


// swatch reference page (one per programme file; not for export)
function textAt(doc, page, x, y, w, h, txt, group, psName) {
  var t = page.textFrames.add({ itemLayer: layerOf(doc, "Text"), geometricBounds: gb(x, y, w, h) });
  t.applyObjectStyle(osOf(doc, "Text frame"), true);
  t.contents = txt;
  t.parentStory.paragraphs.everyItem().appliedParagraphStyle = psOf(doc, group, psName);
  return t;
}
function chip(doc, page, x, y, w, h, swName) {
  var r = page.rectangles.add({ itemLayer: layerOf(doc, "Graphics"), geometricBounds: gb(x, y, w, h) });
  r.applyObjectStyle(osOf(doc, "Panel Light"), true);
  r.fillColor = sw(doc, swName);
  r.strokeColor = sw(doc, "Light ink"); r.strokeWeight = 1;
  r.name = swName;
  return r;
}
S.reference = function (doc, prog) {
  var page = doc.pages.add(LocationOptions.AT_END);
  page.appliedMaster = NothingEnum.NOTHING;
  page.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.TOP_LEFT_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [1920, 1080]);
  var bg = page.rectangles.add({ itemLayer: layerOf(doc, "Background"), geometricBounds: gb(0, 0, 1920, 1080), name: "Reference background" });
  bg.applyObjectStyle(osOf(doc, "Background Light"), true);
  textAt(doc, page, 32, 32, 1856, 100, prog.familyName + " swatches", "On Light", "Headline");
  textAt(doc, page, 32, 150, 800, 32, "Role swatches (names are fixed; values are set per programme)", "On Light", "Micro");
  for (var i = 0; i < DATA.roleOrder.length; i++) {
    var rn = DATA.roleOrder[i]; var x = 32 + i * 240;
    chip(doc, page, x, 200, 200, 120, rn);
    textAt(doc, page, x, 336, 220, 70, rn + "\r" + palHex(prog.roles[rn]).toUpperCase(), "On Light", "Micro");
  }
  textAt(doc, page, 32, 470, 800, 32, prog.familyName + " family", "On Light", "Micro");
  textAt(doc, page, 32, 780, 800, 32, "Neutral", "On Light", "Micro");
  for (var i = 0; i < STEPS.length; i++) {
    var x = 32 + i * 156;
    var fn = prog.familyName + " " + stepLabel(STEPS[i]);
    chip(doc, page, x, 516, 140, 100, fn);
    textAt(doc, page, x, 632, 150, 70, stepLabel(STEPS[i]) + "\r" + PAL[prog.family][STEPS[i]].hex, "On Light", "Micro");
    var nn = "Neutral " + stepLabel(STEPS[i]);
    chip(doc, page, x, 826, 140, 100, nn);
    textAt(doc, page, x, 942, 150, 70, stepLabel(STEPS[i]) + "\r" + PAL.neutral[STEPS[i]].hex, "On Light", "Micro");
  }
  return page;
};
S.sections = function (doc) {
  var last = "";
  for (var i = 0; i < doc.pages.length; i++) {
    var b = doc.pages[i].bounds; var w = b[3] - b[1], h = b[2] - b[0];
    var lab = (w == 1080 && h == 1350) ? "4:5" : (w == 1080 && h == 1920) ? "9:16" : "16:9";
    if (i == doc.pages.length - 1) { lab = "Reference"; }
    if (lab != last) {
      var secName = (lab == "Reference") ? "Ref" : lab;
      var mk = (lab == "Reference") ? "Reference (do not export)" : "Format " + lab;
      if (i == 0) { var s0 = doc.sections[0]; s0.name = secName; s0.marker = mk; s0.continueNumbering = false; s0.pageNumberStart = 1; }
      else { doc.sections.add(doc.pages[i], { name: secName, marker: mk, continueNumbering: false, pageNumberStart: 1 }); }
      last = lab;
    }
  }
};

S.prog = function (name) {
  closeAll();
  var prog = progByName(name);
  var doc = app.open(File(IND + "SD-Social-Source.indd"));
  doc.save(File(IND + prog.file));
  setupDoc(doc);
  S.roles(doc, prog.family);
  // 11-step family + Neutral
  for (var i = 0; i < STEPS.length; i++) {
    setColor(doc, prog.familyName + " " + stepLabel(STEPS[i]), PAL[prog.family][STEPS[i]].hex);
    setColor(doc, "Neutral " + stepLabel(STEPS[i]), PAL.neutral[STEPS[i]].hex);
  }
  // programme-only parents
  var layouts = allLayoutsFor(name);
  var made = 0;
  for (var i = 0; i < layouts.length; i++) {
    var L = layouts[i];
    if (L.scope == "shared") continue;
    var base = findParentBase(doc, L.treatment + " " + L.format);
    var m = newParent(doc, nextPrefix("Q", doc), L.treatment + " / " + L.name + " " + L.format, base, L.format);
    for (var e = 0; e < L.el.length; e++) { addElement(doc, m.pages[0], L.el[e], { treatment: L.treatment, prog: prog, format: L.format }); }
    made++;
  }
  // Start here pages
  var warn = "";
  var first = true;
  var starts = {};
  for (var i = 0; i < layouts.length; i++) {
    var L = layouts[i];
    var pn = parentNameFor(L);
    var master = null;
    for (var q = 0; q < doc.masterSpreads.length; q++) { if (doc.masterSpreads[q].baseName == pn) master = doc.masterSpreads[q]; }
    if (!master) { warn += " NOPARENT:" + pn; continue; }
    var page = first ? doc.pages[0] : doc.pages.add(LocationOptions.AT_END);
    first = false;
    page.appliedMaster = master;
    page.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.TOP_LEFT_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [fmtOf(L.format).w, fmtOf(L.format).h]);
    if (!starts[L.format]) { starts[L.format] = page; }
    warn += fillPage(doc, page, master, L, prog);
  }
  S.reference(doc, prog);
  S.sections(doc);
  for (var q = doc.masterSpreads.length - 1; q >= 0; q--) { if (doc.masterSpreads[q].namePrefix == "A") { try { doc.masterSpreads[q].remove(); } catch (e) { } } }
  doc.save();
  return name + " parents=" + doc.masterSpreads.length + " pages=" + doc.pages.length + " made=" + made + " warn=" + warn;
};

// ---------- export Start-here pages as JPEG ----------
S.exportPages = function (docPath, outDir, ppi, only) {
  var doc = openDoc(docPath);
  Folder(outDir).create();
  var p = app.jpegExportPreferences;
  p.jpegColorSpace = JpegColorSpaceEnum.RGB;
  p.exportResolution = ppi;
  p.antiAlias = true;
  p.jpegQuality = JPEGOptionsQuality.HIGH;
  p.jpegRenderingStyle = JPEGOptionsFormat.BASELINE_ENCODING;
  p.exportingSpread = false;
  p.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
  var n = 0;
  for (var i = 0; i < doc.pages.length; i++) {
    if (only && only.length && ("," + only.join(",") + ",").indexOf("," + (i + 1) + ",") < 0) continue;
    p.pageString = "+" + (i + 1);
    var idn = (i + 1 < 10 ? "0" : "") + (i + 1);
    var mn = doc.pages[i].appliedMaster ? doc.pages[i].appliedMaster.baseName.replace(/[^A-Za-z0-9]+/g, "_") : "ref";
    doc.exportFile(ExportFormat.JPG, File(outDir + "/" + idn + "_" + mn + ".jpg"), false);
    n++;
  }
  return "exported " + n;
};

// After Book > Synchronize, role swatch values are overwritten by the source's placeholders (observed in InDesign 21.6
// even with Swatches unticked, because styles/parents reference them by name). Re-apply each programme's values:
S.fixRoles = function () {
  var out = "";
  for (var name in DATA.programmes) {
    var prog = DATA.programmes[name];
    var d = openDoc(IND + prog.file);
    S.roles(d, prog.family);
    d.save(); out += name + " ";
    d.close(SaveOptions.NO);
  }
  return "roles restored: " + out;
};
