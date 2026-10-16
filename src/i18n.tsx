import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "pt-BR" | "en";

const translations = {
  "pt-BR": {
    languageLabel: "Idioma da página",
    languageOptions: ["Português (Brasil)", "Inglês"],
    brandTagline: "Arte para sua tela",
    brandHome: "ARTORA — Arte para sua tela. Início",
    pageTitle: "ARTORA — Arte para sua tela",
    description: "ARTORA: uma coleção de wallpapers em pintura a óleo para transformar suas telas em pequenas galerias.",
    protectionOverlay: "Prévia protegida",
    navLabel: "Navegação principal",
    nav: ["A coleção", "O que você leva", "Oferta"],
    navCta: "Acesso imediato",
    eyebrow: "A GALERIA QUE CABE NO SEU BOLSO",
    heroTitle: <>Pare de olhar para<br className="desktop-break" /> uma <em>tela vazia.</em></>,
    heroDescription: "300+ papéis de parede em pintura a óleo impasto, com texturas espessas, cores profundas e qualidade de galeria.",
    getCollection: "Obter a Coleção",
    seeArt: "Ver as artes",
    heroNote: "Pagamento único",
    devices: "Mac, Windows, iPhone, Android e iPad",
    scrollCue: "ROLE PARA EXPLORAR",
    artLabel: "ARTE",
    introKicker: "NA TELA, DE VERDADE",
    introTitle: <>Não é só wallpaper.<br /><em>É textura de verdade.</em></>,
    introText: "Relevo, luz e cor de pintura a óleo na tela do seu notebook, sem perder a presença da obra original.",
    knowCollection: "Conheça a coleção",
    marqueeLabel: (index: number) => `Pinturas da coleção, fileira ${index} de 3. Use as setas esquerda e direita para navegar.`,
    sampleKicker: "A COLEÇÃO POR DENTRO",
    sampleTitle: <>Um pouco de arte<br /><em>para cada tela.</em></>,
    sampleText: "Textura de impasto, cor profunda e composições escolhidas para transformar a sua tela em uma pequena galeria.",
    sampleNote: "Prévia em tamanho reduzido · as artes originais permanecem em alta resolução.",
    benefitsKicker: "O QUE VOCÊ LEVA",
    benefitsTitle: <>Pagou, baixou,<br /><em>transformou.</em></>,
    benefitsIntro: "Uma coleção pronta para deixar cada aparelho com a sua personalidade — sem mensalidade e sem complicação.",
    benefits: [
      ["Arte com presença", "Pinturas em óleo impasto escolhidas pela textura, cor e impacto visual."],
      ["Feita para suas telas", "Formatos para notebook, monitor, iPhone, Android e iPad."],
      ["Chega na hora", "Link para baixar assim que o pagamento for aprovado."],
      ["Compra sem surpresa", "Pagamento único e acesso à coleção em todos os seus dispositivos."],
    ],
    benefitFooter: ["ARTE EM ALTA RESOLUÇÃO", "DESKTOP + MOBILE", "PAGAMENTO ÚNICO"],
    pricingKicker: "ESCOLHA SEU PLANO",
    pricingTitle: <>A galeria inteira<br /><em>em um clique.</em></>,
    pricingIntro: "Pagamento único. Uma tela nova todo dia.",
    planName: "A COLEÇÃO ARTORA",
    planDescription: "Toda a coleção ARTORA para suas telas.",
    planItems: ["Artes exclusivas para PC e celular", "Wallpapers para PC em 4K", "Telas de bloqueio para celular"],
    oneTime: "pagamento único",
    getInstantAccess: "Acesso Imediato",
    stripePreparing: "Checkout Stripe em preparação",
    paymentPreviewLabel: "Prévia visual · confirme os meios disponíveis no checkout",
    paymentMethodNames: ["Apple Pay", "Google Pay", "Visa", "Mastercard"],
    faqKicker: "DÚVIDAS",
    faqTitle: <>Antes de<br /><em>você perguntar.</em></>,
    faqIntro: "Tudo simples, do pagamento ao primeiro wallpaper na sua tela.",
    faqs: [
      ["Como recebo as artes?", "Depois da confirmação do pagamento, você recebe por e-mail um link para baixar as pastas da coleção."],
      ["Funciona no meu aparelho?", "Sim. A coleção inclui formatos para computador e celular."],
      ["O que está incluído na coleção?", "São 300 artes exclusivas: 186 wallpapers para PC em 4K e 114 telas de bloqueio para celular."],
      ["É uma assinatura?", "Não. O pagamento é único, sem mensalidade ou renovação automática."],
    ],
    closingKicker: "UM NOVO OLHAR COMEÇA AQUI",
    closingTitle: <>Troque a tela.<br /><em>Fique pela arte.</em></>,
    closingText: "Escolha sua coleção favorita e transforme a tela que você vê todos os dias.",
    choosePlan: "Acesso imediato",
    copyright: "Todos os direitos reservados",
    backToTop: "Voltar ao topo ↑",
    imageFlipLabel: (flipped: boolean) => flipped
      ? "Pintura alternativa. Ative para voltar à pintura original."
      : "Pintura original. Ative para ver a alternativa.",
    currency: "BRL" as const,
    price: "12.99",
    referencePrice: "39.90",
  },
  en: {
    languageLabel: "Page language",
    languageOptions: ["Brazilian Portuguese", "English"],
    brandTagline: "Art for your screen",
    brandHome: "ARTORA — Art for your screen. Home",
    pageTitle: "ARTORA — Art for your screen",
    description: "ARTORA: a collection of oil-painting wallpapers that turn your screens into little galleries.",
    protectionOverlay: "Protected preview",
    navLabel: "Main navigation",
    nav: ["The collection", "What you get", "Plans"],
    navCta: "Get the collection",
    eyebrow: "THE POCKET-SIZED GALLERY",
    heroTitle: <>Stop staring at<br className="desktop-break" /> an <em>empty screen.</em></>,
    heroDescription: "300+ impasto oil painting wallpapers, with thick textures, deep colours and gallery quality.",
    getCollection: "Get the Collection",
    seeArt: "Explore the artwork",
    heroNote: "One-time payment",
    devices: "Mac, Windows, iPhone, Android and iPad",
    scrollCue: "SCROLL TO EXPLORE",
    artLabel: "ART",
    introKicker: "ART, RIGHT ON YOUR SCREEN",
    introTitle: <>It’s not just a wallpaper.<br /><em>It’s real texture.</em></>,
    introText: "The depth, light and colour of oil painting on your laptop screen, with all the presence of the original artwork.",
    knowCollection: "Discover the collection",
    marqueeLabel: (index: number) => `Collection artwork, row ${index} of 3. Use the left and right arrow keys to navigate.`,
    sampleKicker: "INSIDE THE COLLECTION",
    sampleTitle: <>A little art<br /><em>for every screen.</em></>,
    sampleText: "Impasto texture, deep colour and carefully chosen compositions that turn your screen into a little gallery.",
    sampleNote: "Reduced-size preview · original artwork remains in high resolution.",
    benefitsKicker: "WHAT YOU GET",
    benefitsTitle: <>Pay once, download,<br /><em>transform.</em></>,
    benefitsIntro: "A ready-to-use collection that gives every device its own character — no subscriptions, no hassle.",
    benefits: [
      ["Art with presence", "Impasto oil paintings selected for their texture, colour and impact."],
      ["Made for your screens", "Formats for laptop, desktop, iPhone, Android and iPad."],
      ["Instant access", "Download link as soon as your payment is confirmed."],
      ["A worry-free purchase", "One-time payment and access to the collection across your devices."],
    ],
    benefitFooter: ["HIGH-RESOLUTION ART", "DESKTOP + MOBILE", "ONE-TIME PAYMENT"],
    pricingKicker: "CHOOSE YOUR PLAN",
    pricingTitle: <>The entire gallery<br /><em>in one click.</em></>,
    pricingIntro: "One payment. A fresh screen every day.",
    planName: "THE ARTORA COLLECTION",
    planDescription: "The entire ARTORA collection for your screens.",
    planItems: ["Exclusive artwork for desktop and mobile", "4K desktop wallpapers", "Mobile lock screens"],
    oneTime: "one-time payment",
    getInstantAccess: "Get Instant Access",
    stripePreparing: "Stripe checkout is being prepared",
    paymentPreviewLabel: "Visual preview · confirm availability at checkout",
    paymentMethodNames: ["Apple Pay", "Google Pay", "Visa", "Mastercard"],
    faqKicker: "FAQ",
    faqTitle: <>Before<br /><em>you ask.</em></>,
    faqIntro: "Everything made simple, from payment to your first wallpaper.",
    faqs: [
      ["How do I receive the artwork?", "Once your payment is confirmed, you’ll receive an email with a link to download the collection folders."],
      ["Will it work on my device?", "Yes. The collection includes formats for desktop and mobile."],
      ["What’s included in the collection?", "There are 300 exclusive artworks: 186 4K desktop wallpapers and 114 mobile lock screens."],
      ["Is this a subscription?", "No. It’s a one-time payment, with no monthly fees or automatic renewals."],
    ],
    closingKicker: "A FRESH PERSPECTIVE STARTS HERE",
    closingTitle: <>Change your screen.<br /><em>Stay for the art.</em></>,
    closingText: "Choose your favourite collection and transform the screen you see every day.",
    choosePlan: "Get Instant Access",
    copyright: "All rights reserved",
    backToTop: "Back to top ↑",
    imageFlipLabel: (flipped: boolean) => flipped
      ? "Alternate artwork. Activate to return to the original artwork."
      : "Original artwork. Activate to see the alternate version.",
    currency: "EUR" as const,
    price: "9.99",
    referencePrice: "29.99",
  },
} as const;

type Translation = typeof translations[Language];
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: Translation };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "artora-language";

function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pt-BR") return saved;
  } catch {
    // Storage may be unavailable in private browsing; browser language detection still works.
  }
  const preferredLocale = navigator.languages?.find((locale) => {
    const normalized = locale.toLowerCase();
    return normalized.startsWith("pt") || normalized.startsWith("en");
  }) ?? navigator.language;
  return preferredLocale.toLowerCase().startsWith("pt") ? "pt-BR" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(detectLanguage);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.description);
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The selected language remains active for this session if storage is unavailable.
    }
  }, [language, t.description, t.pageTitle]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
