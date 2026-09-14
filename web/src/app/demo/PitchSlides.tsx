"use client";

// #KS-TRACE: SESSION-4.30-PITCH-SLIDES | requirement: "a wise, elegant,
// structural, simple presentation Yehor can open and click through live at
// the Aarhus Claude Code Meetup (2026-09-17), editable by him afterward" |
// assumption: reuses this app's existing design tokens only (--bg, --fg,
// --muted, --accent, --danger, --card, --border from globals.css) and the
// same eyebrow/h1/subhead rhythm already used on this page -- no new fonts,
// no new color tokens, no external deps. Content mirrors the two real
// examples already live on this page (Python requests.get_json /
// TypeScript axios.getJson) rather than inventing new claims -- nothing
// here says anything the rest of fixprove.dev doesn't already say. Slide
// text is intentionally short (a presenter reads it aloud and elaborates;
// see the separate 5-minute speaker script) -- this is the audience-facing
// screen, not the script. | test: manual click-through in a browser (7
// slides, first/last boundary, Escape closes, arrow keys advance) once a
// real Next.js render is possible in this environment; no new selector
// left unmatched in globals.css (checked against every className below).
//
// Editing note for Yehor: every slide is one object in the SLIDES array
// below (title / eyebrow / body / optional code). Add, remove, or reorder
// slides by editing that array -- nothing else needs to change.

import { useCallback, useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  body?: string;
  code?: { lang: string; line: string }[];
};

const SLIDES: Slide[] = [
  {
    eyebrow: "FixProve",
    title: "AI writes fast code. It doesn't always write real code.",
  },
  {
    eyebrow: "The problem",
    title: "One hallucinated call ruins the whole pipeline.",
    body: "66% of developers say AI-generated code errors slow them down — 2025 Stack Overflow Developer Survey.",
  },
  {
    eyebrow: "Why it's dangerous",
    title: "It compiles. It ships. It breaks in production.",
    body: "Not a syntax error — a plausible-looking function call that simply doesn't exist.",
  },
  {
    eyebrow: "What FixProve does",
    title: "Checks your code against what's actually installed.",
    body: "Not another LLM guessing — a deterministic match against your real dependency tree.",
  },
  {
    eyebrow: "See it catch one",
    title: "Same bug, two ecosystems.",
    code: [
      { lang: "python", line: "requests.get_json(url)  →  no such function" },
      { lang: "typescript", line: "axios.getJson(url)  →  no such function" },
    ],
  },
  {
    eyebrow: "Proof, not promises",
    title: "Open source. On PyPI and npm. Install it now.",
    code: [
      { lang: "", line: "pip install fixprove" },
      { lang: "", line: "npm install -g fixprove" },
    ],
  },
  {
    eyebrow: "Honest about limits",
    title: "What it doesn't catch yet is public, on GitHub.",
    body: "Candour, not marketing.",
  },
  {
    eyebrow: "Try it",
    title: "Run it on your repo this week.",
    body: "You can try to break it if you want. github.com/FixProve/fixprove",
  },
];

export default function PitchSlides() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, SLIDES.length - 1)),
    []
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  if (!open) {
    return (
      <button
        type="button"
        className="pitch-launcher"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
      >
        Open presentation ({SLIDES.length} slides)
      </button>
    );
  }

  const slide = SLIDES[index];

  return (
    <div className="pitch-overlay" role="dialog" aria-label="FixProve presentation">
      <button
        type="button"
        className="pitch-close"
        onClick={() => setOpen(false)}
        aria-label="Close presentation"
      >
        ×
      </button>

      <div className="pitch-slide">
        <div className="pitch-eyebrow">{slide.eyebrow}</div>
        <h2 className="pitch-title">{slide.title}</h2>
        {slide.body && <p className="pitch-body">{slide.body}</p>}
        {slide.code && (
          <div className="pitch-code">
            {slide.code.map((c, i) => (
              <div key={i}>{c.line}</div>
            ))}
          </div>
        )}
      </div>

      <div className="pitch-controls">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="pitch-dots">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={i === index ? "pitch-dot active" : "pitch-dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={index === SLIDES.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
      <div className="pitch-counter">
        {index + 1} / {SLIDES.length}
      </div>
    </div>
  );
}
