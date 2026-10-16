import { useLayoutEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { showcaseArtworks } from "@/data/showcase-artworks";
import BrandMark from "@/components/brand-mark";
import { useLanguage } from "@/i18n";

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const artSources = showcaseArtworks;
const MOBILE_ART_COUNT = 6;
type StageSize = { width: number; height: number };
const artTones = ["ochre", "clay", "moss", "rose", "ink", "golden", "sage", "umber"];

function ArtCard({ src, index, label }: { src: string; index: number; label: string }) {
  const [loaded, setLoaded] = useState(true);
  const tone = artTones[index % artTones.length];

  return (
    <div className={`art-card art-card--${tone}`} data-protected-artwork="true">
      {loaded ? (
        <img
          src={src}
          className="protected-artwork"
          alt=""
          loading={index < 6 ? "eager" : "lazy"}
          fetchPriority={index < 2 ? "high" : "auto"}
          onError={() => setLoaded(false)}
        />
      ) : (
        <span className="art-placeholder" aria-hidden="true">
          <span className="art-placeholder__sun" />
          <span className="art-placeholder__horizon" />
          <span className="art-placeholder__note">{label} {String(index + 1).padStart(2, "0")}</span>
        </span>
      )}
    </div>
  );
}

export default function ScrollMorphHero() {
  const { language, setLanguage, t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const stageSize = useMotionValue<StageSize>({ width: 0, height: 0 });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const updateSize = () => stageSize.set({ width: stage.clientWidth, height: stage.clientHeight });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stageSize]);

  return (
    <div ref={trackRef} id="top" className={`hero-track${reduceMotion ? " hero-track--static" : ""}`}>
      <section ref={stageRef} className="hero-stage" aria-labelledby="hero-title">
        <header className="site-nav">
          <BrandMark />
          <nav className="nav-links" aria-label={t.navLabel}>
            <a href="#colecao">{t.nav[0]}</a>
            <a href="#beneficios">{t.nav[1]}</a>
            <a href="#planos">{t.nav[2]}</a>
          </nav>
          <div className="nav-actions">
            <div className="language-switch" role="group" aria-label={t.languageLabel}>
              <Languages size={14} strokeWidth={1.8} aria-hidden="true" />
              <button
                className={`language-switch__option${language === "pt-BR" ? " is-active" : ""}`}
                type="button"
                aria-label={t.languageOptions[0]}
                aria-pressed={language === "pt-BR"}
                onClick={() => setLanguage("pt-BR")}
              >PT</button>
              <button
                className={`language-switch__option${language === "en" ? " is-active" : ""}`}
                type="button"
                aria-label={t.languageOptions[1]}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >EN</button>
            </div>
            <a className="nav-cta" href="#planos">{t.navCta} <span aria-hidden="true">↗</span></a>
          </div>
        </header>

        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</p>
          <h1 id="hero-title">{t.heroTitle}</h1>
          <p className="hero-description">{t.heroDescription}</p>
          <div className="hero-actions">
            <a className="button button--gold" href="#planos">{t.getCollection} <span>↗</span></a>
            <a className="button button--light" href="#colecao">{t.seeArt}</a>
          </div>
          <p className="hero-note">{t.heroNote} <span>·</span> {t.devices}</p>
        </div>

        <div className="hero-art" aria-hidden="true">
          {artSources.map((artwork, index) => (
            <MorphingCard key={artwork.src} src={artwork.src} aspectRatio={artwork.aspectRatio} index={index} progress={scrollYProgress} stageSize={stageSize} staticMode={Boolean(reduceMotion)} label={t.artLabel} />
          ))}
        </div>
        {!reduceMotion && <div className="scroll-cue"><span className="scroll-cue__line" /> {t.scrollCue}</div>}
        <div className="hero-orbit" aria-hidden="true" />
      </section>
    </div>
  );
}

function MorphingCard({
  src,
  aspectRatio,
  index,
  progress,
  stageSize,
  staticMode,
  label,
}: {
  src: string;
  aspectRatio: number;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  stageSize: MotionValue<StageSize>;
  staticMode: boolean;
  label: string;
}) {
  const transform = useTransform(() => {
    const { width, height } = stageSize.get();
    const mobile = width <= 520;
    const compact = width <= 800;
    if (mobile) {
      const progressValue = staticMode ? 0 : Math.max(0, Math.min(1, progress.get()));
      const initialCenters = [0.18, 0.5, 0.82, 0.18, 0.5, 0.82];
      const initialHeights = [0.86, 0.82, 0.86, 1.28, 1.28, 1.28];
      const initialRotations = [-9, 2, 9, -7, 3, 8];
      const center = initialCenters[index];
      const initialX = (center - 0.5) * width;
      const initialY = initialHeights[index] * height;
      const column = index % 3;
      const row = Math.floor(index / 3);
      const finalX = (column - 1) * width * 0.32;
      const finalY = height * (row === 0 ? 0.78 : height <= 640 ? 0.96 : 0.92);
      const x = lerp(initialX, finalX, progressValue);
      const y = lerp(initialY, finalY, progressValue);
      const rotation = lerp(initialRotations[index], (1 - column) * 3, progressValue);
      const scale = lerp(index > 2 ? 0.82 : 1, 0.78, progressValue);
      return `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) scale(${scale})`;
    }
    const t = staticMode ? 0 : Math.max(0, Math.min(1, progress.get()));
    const arcProgress = index / ((compact ? MOBILE_ART_COUNT : artSources.length) - 1);
    // Leave the top of the arc open so the larger paintings frame the copy.
    const angle = (-0.2 + arcProgress * 1.4) * Math.PI;
    const radiusX = Math.min(width * (compact ? 0.42 : 0.455), 650);
    const radiusY = Math.min(height * (compact ? 0.115 : 0.30), 300);
    const startX = Math.cos(angle) * radiusX;
    const startY = Math.sin(angle) * radiusY + height * (compact ? 0.78 : 0.55);
    const endX = (0.5 - arcProgress) * Math.min(width * 1.05, 1360);
    const endY = height * (compact ? 0.88 : 0.91) - Math.sin(arcProgress * Math.PI) * height * (compact ? 0.08 : 0.13);
    const x = lerp(startX, endX, t);
    const y = lerp(startY, endY, t);
    const rotation = lerp(index % 2 ? 9 : -9, (0.5 - arcProgress) * 20, t);
    const scale = lerp(1, 0.9, t);
    return `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) scale(${scale})`;
  });

  return (
    <motion.div className="hero-art__item" style={{ transform }}>
      <div className="hero-art__frame" style={{ aspectRatio }}><ArtCard src={src} index={index} label={label} /></div>
    </motion.div>
  );
}
