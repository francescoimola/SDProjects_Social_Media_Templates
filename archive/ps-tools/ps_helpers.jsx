// Shared helpers for building SD-social-template.psd (Photoshop ExtendScript).
// Load with: $.evalFile(File("<repo>/tools/ps_helpers.jsx"));
// System: 6px baseline · 36px margin · 24px gutter · 6 columns of 148px.

var s = stringIDToTypeID, c = charIDToTypeID;
var D = app.activeDocument;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var SD = {
  black: "101113", off: "F5F3EB", white: "FFFFFF",
  orange: "FF5F00", teal: "00A99D", tealText: "00988C",
  blue: "2F4D86", blueOnDark: "7A9DE4", rule: "BFBBA8"
};
var GRID = { m: 36, g: 24, cols: 6, cw: 148, rows: { "1350": 7, "1920": 12, "566": 2 } };

var TYPE = {
  display:    { ps: "SourceSansRoman-Semibold", size: 120, lead: 120, track: -20, name: "Display 120/120" },
  heading:    { ps: "SourceSansRoman-Semibold", size: 72,  lead: 78,  track: -10, name: "Heading 72/78" },
  subheading: { ps: "SourceSansRoman-Semibold", size: 48,  lead: 54,  track: -5,  name: "Subheading 48/54" },
  body:       { ps: "SourceSansRoman-Regular",  size: 30,  lead: 36,  track: 0,   name: "Body 30/36" },
  label:      { ps: "SourceSansRoman-Semibold", size: 18,  lead: 24,  track: 10,  name: "Label 18/24" },
  caption:    { ps: "SourceSansRoman-Regular",  size: 18,  lead: 24,  track: 10,  name: "Caption 18/24" }
};

function col(h) { var x = new SolidColor(); x.rgb.hexValue = h.replace("#", ""); return x; }
function AB(name) { return D.layerSets.getByName(name); }

function abRect(name) {
  var r = new ActionReference(); r.putName(c("Lyr "), name);
  var d = executeActionGet(r).getObjectValue(s("artboard")).getObjectValue(s("artboardRect"));
  return { l: d.getDouble(c("Left")), t: d.getDouble(c("Top ")), r: d.getDouble(c("Rght")), b: d.getDouble(c("Btom")),
           w: d.getDouble(c("Rght")) - d.getDouble(c("Left")), h: d.getDouble(c("Btom")) - d.getDouble(c("Top ")) };
}

function rowsFor(h) { return GRID.rows[String(h)]; }
function rowH(h) { var n = rowsFor(h); return (h - 2 * GRID.m - (n - 1) * GRID.g) / n; }
function colX(i) { return GRID.m + i * (GRID.cw + GRID.g); }
function rowY(j, h) { return GRID.m + j * (rowH(h) + GRID.g); }
function spanW(n) { return n * GRID.cw + (n - 1) * GRID.g; }

function modules(w, h) {
  var out = [], n = rowsFor(h), rh = rowH(h);
  for (var i = 0; i < GRID.cols; i++) for (var j = 0; j < n; j++) out.push([colX(i), rowY(j, h), GRID.cw, rh]);
  return out;
}

function selRects(R, rects) {
  for (var i = 0; i < rects.length; i++) {
    var q = rects[i], x = R.l + q[0], y = R.t + q[1];
    D.selection.select([[x, y], [x + q[2], y], [x + q[2], y + q[3]], [x, y + q[3]]],
                       i ? SelectionType.EXTEND : SelectionType.REPLACE);
  }
}

// Pixel layer filled with one colour across one or more rects (artboard-local coords).
function fillLayer(parent, R, rects, hex, name, opacity) {
  var L = parent.artLayers.add(); L.name = name; D.activeLayer = L;
  selRects(R, rects); D.selection.fill(col(hex)); D.selection.deselect();
  if (opacity != null) L.opacity = opacity;
  return L;
}

// Point text. `base` is the first baseline, artboard-local. Lines split on \r.
function txt(parent, R, str, st, x, base, hex, name) {
  var L = parent.artLayers.add(); L.kind = LayerKind.TEXT;
  var t = L.textItem;
  t.contents = str; t.font = st.ps; t.size = new UnitValue(st.size, "px");
  t.useAutoLeading = false; t.leading = new UnitValue(st.lead, "px");
  t.tracking = st.track; t.color = col(hex); t.justification = Justification.LEFT;
  t.hyphenation = false; t.antiAliasMethod = AntiAlias.SHARP;
  t.position = [R.l + x, R.t + base];
  L.name = name || str.split("\r")[0].substr(0, 40);
  // Photoshop drops new text layers just above a group instead of inside it: move them in.
  if (parent.typename == "LayerSet" && L.parent != parent) L.move(parent, ElementPlacement.PLACEATBEGINNING);
  return L;
}

// Baseline that makes text "hang" from a module top (Source Sans cap height = 0.66 em), snapped to 6px.
function hang(top, st) { return Math.round((top + st.size * 0.66) / 6) * 6; }

function selectLayer(name) {
  var r = new ActionReference(); r.putName(c("Lyr "), name);
  var d = new ActionDescriptor(); d.putReference(c("null"), r); d.putBoolean(c("MkVs"), false);
  executeAction(c("slct"), d, DialogModes.NO);
}

function guideLayout(abName, rows) {
  selectLayer(abName);
  var P = c("#Pxl"), desc = new ActionDescriptor(), gl = new ActionDescriptor();
  desc.putEnumerated(s("presetKind"), s("presetKindType"), s("presetKindCustom"));
  gl.putInteger(s("colCount"), GRID.cols); gl.putUnitDouble(s("colGutter"), P, GRID.g);
  gl.putInteger(s("rowCount"), rows); gl.putUnitDouble(s("rowGutter"), P, GRID.g);
  var k = ["marginTop", "marginLeft", "marginBottom", "marginRight"];
  for (var i = 0; i < 4; i++) gl.putUnitDouble(s(k[i]), P, GRID.m);
  desc.putObject(s("guideLayout"), s("guideLayout"), gl);
  desc.putEnumerated(s("guideTarget"), s("guideTarget"), s("guideTargetSelectedArtboards"));
  executeAction(s("newGuideLayout"), desc, DialogModes.NO);
}

// Hidden, locked module shading for toggling on while designing.
function gridOverlay(abName) {
  var ab = AB(abName), R = abRect(abName);
  var L = fillLayer(ab, R, modules(R.w, R.h), SD.teal, "Grid overlay (toggle on while designing)", 15);
  L.visible = false; L.allLocked = true;
  return L;
}

var SAFE = {
  profile45: { rects: [[0, 0, 34, 1350], [1046, 0, 34, 1350]], label: "Profile grid crops about 34px off each side (shows 3:4)", x: 40, base: 1338 },
  profile916: { rects: [[0, 0, 1080, 240], [0, 1680, 1080, 240]], label: "Profile grid shows only the centre 1080 × 1440 (3:4)", x: 36, base: 60 },
  reelUI: { rects: [[0, 0, 1080, 220], [0, 1500, 1080, 420], [960, 220, 120, 1280]], label: "Instagram Reel UI covers these areas (approx.). Keep text and faces out.", x: 36, base: 60 }
};

function safeZone(abName, key, groupName) {
  var ab = AB(abName), R = abRect(abName), z = SAFE[key];
  var g = ab.layerSets.add(); g.name = groupName || "Safe zones (never export)";
  fillLayer(g, R, z.rects, SD.orange, "Zone", 35);
  txt(g, R, z.label, TYPE.caption, z.x, z.base, SD.black, "Zone note");
  hideLayer(g); g.allLocked = true;
  return g;
}

// Export one artboard as a half-size JPEG for review (works on a throwaway duplicate).
function previewAB(abName, path) {
  var R = abRect(abName), orig = D, dup = orig.duplicate("prev", true);
  app.activeDocument = dup;
  dup.crop([UnitValue(R.l, "px"), UnitValue(R.t, "px"), UnitValue(R.r, "px"), UnitValue(R.b, "px")]);
  dup.resizeImage(UnitValue(R.w / 2, "px"), null, null, ResampleMethod.BICUBIC);
  var o = new JPEGSaveOptions(); o.quality = 9; dup.saveAs(new File(path), o, true);
  dup.close(SaveOptions.DONOTSAVECHANGES); app.activeDocument = orig;
  return path;
}

// layer.visible = false does not stick on groups inside artboards; use the Hide action.
function hideLayer(L) {
  var list = new ActionList(), r = new ActionReference(); r.putIdentifier(c("Lyr "), L.id); list.putReference(r);
  var d = new ActionDescriptor(); d.putList(c("null"), list); executeAction(c("Hd  "), d, DialogModes.NO);
}

function background(abName, hex) {
  var ab = AB(abName), R = abRect(abName);
  var L = fillLayer(ab, R, [[0, 0, R.w, R.h]], hex, "Background");
  L.move(ab, ElementPlacement.PLACEATEND);
  return L;
}
