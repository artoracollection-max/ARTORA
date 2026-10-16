import { ArrowDown, ArrowRight, Check, Download, Laptop, MonitorSmartphone, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import ArtworkProtectionOverlay from "@/components/artwork-protection-overlay";
import { galleryArtworks, marqueeArtworkRows } from "@/data/showcase-artworks";
import BrandMark from "@/components/brand-mark";
import { useLanguage } from "@/i18n";

function ArtworkPreview({ artwork }: { artwork: (typeof galleryArtworks)[number] }) {
  const [flipped, setFlipped] = useState(false);
  const pointerType = useRef("");
  const { t } = useLanguage();

  return (
    <button
      className={`gallery-art${flipped ? " gallery-art--flipped" : ""}`}
      data-protected-artwork="true"
      type="button"
      aria-pressed={flipped}
      aria-label={t.imageFlipLabel(flipped)}
      onPointerDown={(event) => { pointerType.current = event.pointerType; }}
      onClick={(event) => {
        // Hover handles a mouse; tap, keyboard and assistive activation toggle the card.
        if (event.detail === 0 || pointerType.current !== "mouse") setFlipped((current) => !current);
      }}
    >
      <span className="gallery-art__rotator" aria-hidden="true">
        <span className="gallery-art__face gallery-art__face--front">
          <img className="protected-artwork" src={artwork.front.src} alt="" loading="lazy" draggable="false" />
        </span>
        <span className="gallery-art__face gallery-art__face--back">
          <img className="protected-artwork" src={artwork.back.src} alt="" loading="lazy" draggable="false" />
        </span>
      </span>
    </button>
  );
}

function ArtworkMarquee() {
  const { t } = useLanguage();
  return (
    <div className="art-marquee">
      {marqueeArtworkRows.map((artworks, rowIndex) => (
      <div
        key={rowIndex}
        className="art-marquee__viewport"
        role="region"
        aria-label={t.marqueeLabel(rowIndex + 1)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const viewport = event.currentTarget;
            const track = viewport.querySelector<HTMLElement>(".art-marquee__track");
            const animation = track?.getAnimations()[0];
            const duration = animation?.effect?.getComputedTiming().duration;
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const distance = direction * viewport.clientWidth * 0.8;

            if (track && animation && typeof duration === "number" && duration > 0) {
              // Seek the paused loop so both directions work without exposing empty space.
              const delta = distance / (track.offsetWidth / 2) * duration * (rowIndex % 2 ? -1 : 1);
              const time = Number(animation.currentTime ?? 0) + delta;
              animation.currentTime = ((time % duration) + duration) % duration;
            } else {
              // Reduced motion uses ordinary horizontal scrolling, without animation.
              viewport.scrollBy({ left: distance, behavior: "instant" });
            }
          }
        }}
      >
        <div className={`art-marquee__track${rowIndex % 2 ? " art-marquee__track--reverse" : ""}`} aria-hidden="true">
          {[false, true].map((duplicate) => (
            <div className={`art-marquee__group${duplicate ? " art-marquee__group--duplicate" : ""}`} key={String(duplicate)}>
              {artworks.map((artwork) => (
                <div className="art-marquee__item" data-protected-artwork="true" style={{ aspectRatio: artwork.aspectRatio }} key={`${duplicate}-${artwork.src}`}>
                  <img className="protected-artwork" src={artwork.src} alt="" loading="lazy" draggable="false" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      ))}
    </div>
  );
}

function App() {
  const { language, t } = useLanguage();
  const locale = language === "en" ? "en-IE" : "pt-BR";
  const formatPrice = (amount: string) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: t.currency,
  }).format(Number(amount));
  const configuredPaymentUrl = language === "en"
    ? import.meta.env.VITE_STRIPE_PAYMENT_LINK_EN
    : import.meta.env.VITE_STRIPE_PAYMENT_LINK_PT_BR;
  let paymentUrl: string | undefined;
  try {
    const parsedUrl = new URL(configuredPaymentUrl ?? "");
    if (parsedUrl.protocol === "https:" && parsedUrl.hostname === "buy.stripe.com") paymentUrl = parsedUrl.href;
  } catch {
    // Keep the purchase action disabled until a valid Stripe Payment Link is configured.
  }

  return (
    <>
    <ArtworkProtectionOverlay />
    <main
      onContextMenu={(event) => {
        if (event.target instanceof Element && event.target.closest("[data-protected-artwork]")) event.preventDefault();
      }}
      onDragStart={(event) => {
        if (event.target instanceof Element && event.target.closest("[data-protected-artwork]")) event.preventDefault();
      }}
    >
      <ScrollMorphHero />

      <section className="intro-section" id="colecao">
        <div className="section-wrap">
          <div className="section-kicker">{t.introKicker}</div>
          <div className="intro-section__grid">
            <h2>{t.introTitle}</h2>
            <div className="intro-section__aside">
              <p>{t.introText}</p>
              <a className="text-link" href="#amostra">{t.knowCollection} <ArrowDown size={15} /></a>
            </div>
          </div>
        </div>
        <ArtworkMarquee />
      </section>

      <section className="sample-section section-wrap" id="amostra">
        <div className="section-heading">
          <div><div className="section-kicker">{t.sampleKicker}</div><h2>{t.sampleTitle}</h2></div>
          <p>{t.sampleText}</p>
        </div>
        <div className="sample-grid">
          {galleryArtworks.map((artwork) => <ArtworkPreview key={artwork.front.src} artwork={artwork} />)}
        </div>
        <p className="sample-note"><Sparkles size={15} /> {t.sampleNote}</p>
      </section>

      <section className="benefits-section" id="beneficios">
        <div className="section-wrap">
          <div className="section-heading section-heading--light">
            <div><div className="section-kicker">{t.benefitsKicker}</div><h2>{t.benefitsTitle}</h2></div>
            <p>{t.benefitsIntro}</p>
          </div>
          <div className="benefit-grid">
            {t.benefits.map(([title, description], index) => {
              const icons = [<Sparkles />, <MonitorSmartphone />, <Download />, <ShieldCheck />];
              return <article className="benefit-card" key={title}><span className="benefit-icon">{icons[index]}</span><span className="benefit-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>;
            })}
          </div>
          <div className="benefit-footer"><span><Zap size={16} /> {t.benefitFooter[0]}</span><span><Laptop size={16} /> {t.benefitFooter[1]}</span><span><ShieldCheck size={16} /> {t.benefitFooter[2]}</span></div>
        </div>
      </section>

      <section className="pricing-section section-wrap" id="planos">
        <div className="pricing-heading"><div className="section-kicker">{t.pricingKicker}</div><h2>{t.pricingTitle}</h2><p>{t.pricingIntro}</p></div>
        <article className="plan-card plan-card--featured" id="oferta" data-testid="single-offer">
          <div className="plan-card__top"><div><span className="plan-label">ARTORA COLLECTION</span><h3>{t.planName}</h3></div><span className="plan-spark" aria-hidden="true">✳</span></div>
          <p className="plan-description">{t.planDescription}</p>
          <div className="plan-prices">
            <del className="plan-reference-price">{formatPrice(t.referencePrice)}</del>
            <div className="plan-price">{formatPrice(t.price)}<small>{t.oneTime}</small></div>
          </div>
          <div className="plan-divider" />
          <ul>{t.planItems.map((item) => <li key={item}><Check size={16} strokeWidth={2.5} />{item}</li>)}</ul>
          {paymentUrl ? (
            <a className="button plan-button button--gold" href={paymentUrl} target="_blank" rel="noreferrer">{t.getInstantAccess} <ArrowRight size={16} /></a>
          ) : (
            <button className="button plan-button button--gold" type="button" disabled aria-describedby="stripe-checkout-status">{t.getInstantAccess} <ArrowRight size={16} /></button>
          )}
          {!paymentUrl && <p className="plan-safe" id="stripe-checkout-status"><ShieldCheck size={14} /> {t.stripePreparing}</p>}
          <div className="payment-preview" role="group" aria-label={`${t.paymentPreviewLabel}: ${t.paymentMethodNames.join(", ")}`}>
            <span className="payment-preview__label">{t.paymentPreviewLabel}</span>
            <div className="payment-preview__marks" aria-hidden="true">
              {t.paymentMethodNames.map((name) => <span className={`payment-mark payment-mark--${name.toLowerCase().replace(" ", "-")}`} key={name}>{name}</span>)}
            </div>
          </div>
        </article>
      </section>

      <section className="faq-section section-wrap" id="duvidas">
        <div className="faq-heading"><div className="section-kicker">{t.faqKicker}</div><h2>{t.faqTitle}</h2><p>{t.faqIntro}</p></div>
        <div className="faq-list">
          {t.faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="closing-cta">
        <div className="closing-cta__ornament" aria-hidden="true">✳</div>
        <div className="section-kicker">{t.closingKicker}</div>
        <h2>{t.closingTitle}</h2>
        <p>{t.closingText}</p>
        <a className="button button--gold" href="#planos">{t.choosePlan} <ArrowRight size={16} /></a>
      </section>

      <footer className="site-footer"><BrandMark /><span>© 2026 ARTORA · {t.copyright}</span><a href="#top">{t.backToTop}</a></footer>
    </main>
    </>
  );
}

export default App;
