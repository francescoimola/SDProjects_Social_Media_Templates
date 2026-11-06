#!/usr/bin/env python3
"""Report the paragraph/character styles stored in a PSD (reads the global Txt2 text-engine block).

Photoshop's scripting APIs can't read type styles, so this parses the saved file instead.
Usage: python3 -I tools/check_styles.py path/to/file.psd
"""
import re, sys, struct

def main(path):
    data = open(path, 'rb').read()
    i = data.find(b'8BIMTxt2')
    ln = struct.unpack('>I', data[i + 8:i + 12])[0]
    blk = data[i + 12:i + 12 + ln]
    strs = []
    for m in re.finditer(rb'\(\xfe\xff((?:[^\\)]|\\.)*?)\)', blk):
        try: strs.append((m.start(), re.sub(rb'\\(.)', rb'\1', m.group(1)).decode('utf-16-be')))
        except UnicodeDecodeError: pass
    fonts = []
    for _, s in strs:
        if s == 'Basic Paragraph' or s == 'Bold': break
        if re.fullmatch(r'[A-Za-z]+(-[A-Za-z]+)?', s) and ('-' in s or s in ('AdobeInvisFont', 'TimesNewRomanPSMT')):
            fonts.append(s)
    pos = [p for p, _ in strs]
    def nxt(p):
        later = [q for q in pos if q > p]
        return later[0] if later else len(blk)
    def describe(p, s, key):
        seg = blk[p:nxt(p)].decode('latin1')
        m = re.search(r'/%s << /0 (\d+) /1 ([\d.]+) .*?/5 ([\d.]+) .*?/8 (-?\d+)' % key, seg)
        col = re.search(r'/SimplePaint /0 << /0 1 /1 \[ 1\.0 ([\d.]+) ([\d.]+) ([\d.]+) \]', seg)
        hexc = '#%02X%02X%02X' % tuple(round(float(x) * 255) for x in col.groups()) if col else ''
        if not m and not col: return f'{s:30} (no attributes: does nothing)'
        if not m: return f'{s:30} Photoshop defaults (Myriad Pro 12, black): formatting was not captured'
        f = int(m.group(1))
        return f'{s:30} {fonts[f] if f < len(fonts) else f:26} {m.group(2):>6}/{m.group(3):<6} track {m.group(4):>4}  {hexc}'
    soft = max(p for p, s in strs if s == 'Soft_v2')
    lst = next(p for p, s in strs if s.startswith('kPredefinedNumeric'))
    cut = next(p for p, s in strs if s == 'Basic Paragraph')
    print('CHARACTER STYLES')
    for p, s in strs:
        if soft < p < lst and len(s) > 1 and s not in ('None', 'Normal RGB') and re.fullmatch(r'[\w ·/–+-]+', s):
            print(' ', describe(p, s, '6'))
    para_end = next((p for p, s in strs if p > cut and len(s) <= 1), len(blk))
    print('PARAGRAPH STYLES')
    for p, s in strs:
        if p > cut and re.search(r'\d+/\d+', s) and len(s) < 60 and p < para_end:
            print(' ', describe(p, s, '32'))

if __name__ == '__main__':
    main(sys.argv[1])
