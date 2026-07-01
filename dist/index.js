import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import CrazyGLWrapper, { loadGoogleFont, useHeroAnimationFrame, useHeroReady, } from '@crazygl/core';
import metadata from './metadata.json';
import './style.css';
const WEIGHT_NAMES = {
    '100': '100', '200': '200', '300': '300', '400': '400', '500': '500',
    '600': '600', '700': '700', '800': '800', '900': '900',
};
function CursorRevealTextHero(props) {
    const { size, input, rootRef, reducedMotion, primaryText = '', revealText = '', defaultSize = 40, hoverSize = 400, cursorFollowSpeed = 0.5, transitionDuration = 0.5, bgColor = '#0f0f0f', textColor = '#c299d0', revealBgColor = '#5e057e', revealTextColor = '#0f0f0f', fontSize = 36, lineHeight = 1.3, maxWidth = 1000, headingFontFamily = 'Inter', headingFontWeight = '500', } = props;
    const weight = WEIGHT_NAMES[String(headingFontWeight)] ?? '500';
    useHeroReady(props);
    React.useEffect(() => {
        if (!headingFontFamily || headingFontFamily === 'Inherit')
            return;
        try {
            loadGoogleFont(headingFontFamily, { weights: ['400', '500', '600', '700', '800', '900'] });
        }
        catch { /* */ }
    }, [headingFontFamily]);
    const w = Math.max(1, Math.floor(size?.width ?? 1440));
    const h = Math.max(1, Math.floor(size?.height ?? 720));
    const lensRef = React.useRef(null);
    const primaryInnerRef = React.useRef(null);
    const cursorRef = React.useRef({ x: w / 2, y: h / 2 });
    const sizeStateRef = React.useRef(Math.max(10, Number(defaultSize) || 40));
    const idleRef = React.useRef(0);
    useHeroAnimationFrame(rootRef, ({ delta, elapsed }) => {
        const lens = lensRef.current;
        if (!lens)
            return;
        const cursorActive = !!(input && input.active);
        let tx, ty;
        if (cursorActive) {
            tx = (input.x ?? 0.5) * w;
            ty = (input.y ?? 0.5) * h;
            idleRef.current = 0;
        }
        else {
            idleRef.current += delta;
            if (reducedMotion || idleRef.current < 0.4) {
                tx = w * 0.5;
                ty = h * 0.5;
            }
            else {
                tx = w * 0.5 + Math.cos(elapsed * 0.7) * w * 0.28;
                ty = h * 0.5 + Math.sin(elapsed * 0.55) * h * 0.18;
            }
        }
        // Frame-rate-independent exponential smoothing on the cursor
        // position. `cursorFollowSpeed = 1` → response time 0 → snap to
        // pointer; lower values lengthen the time constant so the cursor
        // trails. This replaces the per-frame % lerp (which felt easier as
        // the distance shrank) and is paired with NO `transition` on the
        // lens — the CSS transition was eating every update and made the
        // motion read as "starts slow then accelerates".
        const speed = Math.max(0.05, Math.min(1, Number(cursorFollowSpeed) || 0.5));
        const posTau = (1 - speed) * 0.25; // 0s at speed=1, 0.25s at speed=0
        const c = cursorRef.current;
        if (posTau <= 1e-4) {
            c.x = tx;
            c.y = ty;
        }
        else {
            const k = 1 - Math.exp(-delta / posTau);
            c.x += (tx - c.x) * k;
            c.y += (ty - c.y) * k;
        }
        // Determine target size based on whether the pointer is over the
        // primary text's bounding box. Pointer is small everywhere by
        // default and grows when it enters the text area. We translate the
        // hero-relative pointer pixels into viewport coords so we can use
        // the text element's getBoundingClientRect.
        let overText = false;
        const root = rootRef.current;
        const inner = primaryInnerRef.current;
        if (cursorActive && root && inner) {
            const heroRect = root.getBoundingClientRect();
            const tr = inner.getBoundingClientRect();
            const px = heroRect.left + c.x;
            const py = heroRect.top + c.y;
            overText = px >= tr.left && px <= tr.right && py >= tr.top && py <= tr.bottom;
        }
        else if (!cursorActive && !reducedMotion && idleRef.current > 0.4 && root && inner) {
            // Auto-orbit: same hover check so the lens still pulses when it
            // drifts across the text.
            const heroRect = root.getBoundingClientRect();
            const tr = inner.getBoundingClientRect();
            const px = heroRect.left + c.x;
            const py = heroRect.top + c.y;
            overText = px >= tr.left && px <= tr.right && py >= tr.top && py <= tr.bottom;
        }
        const targetSize = overText
            ? Math.max(20, Number(hoverSize) || 400)
            : Math.max(10, Number(defaultSize) || 40);
        // Smooth size with its own time constant so the grow/shrink reads
        // as a single ease rather than a step.
        const sizeTau = Math.max(0.05, Number(transitionDuration) || 0.5) * 0.35;
        const sk = 1 - Math.exp(-delta / sizeTau);
        sizeStateRef.current += (targetSize - sizeStateRef.current) * sk;
        const r = sizeStateRef.current / 2;
        const clip = `circle(${r.toFixed(1)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px)`;
        lens.style.clipPath = clip;
        lens.style.webkitClipPath = clip;
    });
    const fallbackFontStack = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    const resolvedFontStack = headingFontFamily && headingFontFamily !== 'Inherit'
        ? `"${headingFontFamily}", ${fallbackFontStack}`
        : `var(--crazygl-font-heading, inherit), ${fallbackFontStack}`;
    // Inner-only — the layer is just a centring flex container, so the
    // max-width/font/etc. live on the inner block. Putting them on the
    // `inset: 0` layer pinned it to the left edge instead of centring it.
    const innerStyle = {
        fontFamily: resolvedFontStack,
        fontSize: `${Math.max(14, Number(fontSize) || 36)}px`,
        fontWeight: weight,
        lineHeight: Number(lineHeight) || 1.3,
        margin: 0,
        maxWidth: `${Math.max(280, Number(maxWidth) || 1000)}px`,
        width: '100%',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
    };
    return (_jsxs(_Fragment, { children: [_jsxs("crazygl-stage", { style: { background: bgColor }, children: [_jsx("div", { className: "crazygl-crt-layer", children: _jsx("div", { ref: primaryInnerRef, className: "crazygl-crt-inner", style: { ...innerStyle, color: textColor }, children: primaryText }) }), _jsx("div", { ref: lensRef, className: "crazygl-crt-revealed-layer", "aria-hidden": "true", style: { background: revealBgColor }, children: _jsx("div", { className: "crazygl-crt-layer", children: _jsx("div", { className: "crazygl-crt-inner", style: { ...innerStyle, color: revealTextColor }, children: revealText }) }) })] }), _jsx("crazygl-content", {})] }));
}
export default function CursorRevealText(props) {
    return _jsx(CrazyGLWrapper, { hero: CursorRevealTextHero, metadata: metadata, ...props });
}
export { metadata };
