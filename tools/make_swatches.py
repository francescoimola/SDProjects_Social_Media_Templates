#!/usr/bin/env python3
"""Build SD swatch files (.ase with groups, .aco flat) from color-palette-strom-refined.json.

Usage: python3 tools/make_swatches.py brand/color-palette-strom-refined.json brand/swatches/
"""
import json, struct, sys, os

FAMILIES = [  # json key, plain name, programme
    ("kelpcrete",   "Orange",       "Kelpcrete"),
    ("readingRoom", "Teal",         "Reading Room"),
    ("building",    "Blue",         "Building"),
    ("events",      "Grey",         "Events"),
    ("neutral",     "Warm neutral", None),
]
CORE = [  # name, family, shade
    ("Orange · Kelpcrete",       "kelpcrete",   "400"),
    ("Teal · Reading Room",      "readingRoom", "400"),
    ("Teal text · Reading Room", "readingRoom", "500"),
    ("Blue · Building",          "building",    "700"),
    ("Black · Events",           "events",      "950"),
    ("Off-white",                "neutral",     "50"),
]

def groups(palette):
    c = palette["colors"]
    out = [("SD – Core", [(n, c[f][s]["hex"]) for n, f, s in CORE])]
    for key, name, prog in FAMILIES:
        label = f"SD – {name} shades" + (f" ({prog})" if prog else "")
        out.append((label, [(f"{name} {shade}", v["hex"]) for shade, v in c[key].items()]))
    return out

def ase_name(s):
    b = (s + "\0").encode("utf-16-be")
    return struct.pack(">H", len(b) // 2) + b

def write_ase(path, gs):
    blocks = []
    for gname, swatches in gs:
        body = ase_name(gname)
        blocks.append(struct.pack(">HI", 0xC001, len(body)) + body)
        for name, hx in swatches:
            r, g, b = (int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5))
            body = ase_name(name) + b"RGB " + struct.pack(">fffH", r, g, b, 2)
            blocks.append(struct.pack(">HI", 0x0001, len(body)) + body)
        blocks.append(struct.pack(">HI", 0xC002, 0))
    with open(path, "wb") as f:
        f.write(b"ASEF" + struct.pack(">HHI", 1, 0, len(blocks)) + b"".join(blocks))

def write_aco(path, gs):
    flat = [s for _, sw in gs for s in sw]
    def rec(hx):
        r, g, b = (int(hx[i:i + 2], 16) * 257 for i in (1, 3, 5))
        return struct.pack(">HHHHH", 0, r, g, b, 0)
    v1 = struct.pack(">HH", 1, len(flat)) + b"".join(rec(h) for _, h in flat)
    v2 = struct.pack(">HH", 2, len(flat))
    for name, h in flat:
        nb = (name + "\0").encode("utf-16-be")
        v2 += rec(h) + struct.pack(">I", len(nb) // 2) + nb
    with open(path, "wb") as f:
        f.write(v1 + v2)

if __name__ == "__main__":
    src, outdir = sys.argv[1], sys.argv[2]
    gs = groups(json.load(open(src)))
    write_ase(os.path.join(outdir, "SD-colours.ase"), gs)
    write_aco(os.path.join(outdir, "SD-colours.aco"), gs)
    json.dump(gs, open(os.path.join(outdir, "SD-colours.json"), "w"), indent=1, ensure_ascii=False)
    print(sum(len(s) for _, s in gs), "swatches in", len(gs), "groups")
