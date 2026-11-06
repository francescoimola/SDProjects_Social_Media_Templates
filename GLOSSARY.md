# SD Projects social templates

The InDesign template system the SD Projects marketing team uses to make social posts, rebuilt from the Figma designs.

## Content

**Programme**:
One strand of SD Projects (Kelpcrete, Reading Room, Building or Events). Each has its own colour family and its own template file.
_Avoid_: Brand, category, strand, set, theme

**Format**:
A canvas aspect ratio with its fixed pixel size: 4:5 (1080×1350), 9:16 (1080×1920) or 16:9 (1920×1080).
_Avoid_: Size, artboard, ratio

**Treatment**:
The colour mode a layout is rendered in: Hero (programme colour background), Light (programme tint background) or Video Overlay (panels over video, no background).
_Avoid_: Mode, variant, style

**Layout**:
One named arrangement of text and image frames, using Figma's archetype names (e.g. "Split editorial", "Oversized word + edge bar").
_Avoid_: Template, archetype, design

**Stories**:
Layouts in the 9:16 format, in the Hero or Light treatment. A Format × Treatment combination, not a treatment of its own.
_Avoid_: Story treatment

## Files and parents

**Source file**:
The InDesign document holding everything the four programmes share: styles, object styles, role swatches and shared parents. It is the Book's style source and is not used to make posts.
_Avoid_: Master file, template file

**Programme file**:
One programme's InDesign document, where posts are made.
_Avoid_: Template, working file

**Structural parent**:
A parent page holding only one format's grid: margins, columns, rows and baseline.
_Avoid_: Layer 1, grid master, base parent

**Treatment parent**:
A parent page, based on a structural parent, that adds a treatment's background.
_Avoid_: Background master

**Layout parent**:
A parent page, based on a treatment parent, that holds one layout's empty, named frames.
_Avoid_: Layer 2, template parent, content master

**Start here page**:
A page in a programme file with a layout parent applied and sample image and copy filled in. Marketing duplicates it to start a post.
_Avoid_: Sample page, example

## Colour

**Role swatch**:
A swatch named by its job (e.g. Hero, Hero ink, Light, Light ink). Each programme file gives it that programme's colour, so shared styles and parents pick up the right programme colours.
_Avoid_: Theme colour, token

**Family swatch**:
A fixed brand colour named by programme and step, e.g. Kelpcrete 400, as in the Figma variables.
_Avoid_: Shade, tint (as names)
