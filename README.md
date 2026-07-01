<sub>*Hero made by [@ybouane](https://x.com/ybouane).*</sub>
<p align="center">
  <img src="https://crazygl.com/heroes/hero-cursor-reveal-text/banner-full.png" alt="Cursor Reveal Text" width="640">
</p>

# @crazygl/hero-cursor-reveal-text

Two stacked paragraphs — a primary line shown in the surface colour, and a secret reveal line shown only inside a cursor-following spotlight that grows on hover.

## Demo
[Cursor Reveal Text](https://crazygl.com/hero/cursor-reveal-text)

## Install

```bash
npm install @crazygl/hero-cursor-reveal-text
```

## Usage

```tsx
import CursorRevealText from '@crazygl/hero-cursor-reveal-text';

export default function Page() {
  return (
    <CursorRevealText
      primaryText="I'm a selectively skilled product designer..."
      revealText="Crafting elegant solutions through code..."
      hoverSize={400}
    />
  );
}
```

## Customise

- **Content** — `primaryText`, `revealText`.
- **Spotlight** — `defaultSize` (resting diameter), `hoverSize` (diameter over text), `cursorFollowSpeed` (0.05 liquid → 1 snaps), `transitionDuration` (grow/shrink ease).
- **Colours** — `bgColor`, `textColor`, `revealBgColor`, `revealTextColor`; pair contrasting hues for the strongest effect.
- **Typography** — `fontSize`, `lineHeight`, `maxWidth`, `headingFontFamily`, `headingFontWeight`.

## Best for

- Portfolio bio and "about" sections with a hidden punchline
- Agency / studio personality blocks and case-study intros
- Interactive landing pages that reward cursor exploration



This hero is part of [CrazyGL](https://crazygl.com), a collection of production-ready WebGL, canvas, 3D, and typography effects. Every CrazyGL hero ships with an agent-ready `SKILL.md` file that helps developers and coding agents adapt the effect into custom landing pages and interactive experiences.
