import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n";

export default function BrandMark() {
  const { t } = useLanguage();
  return (
    <a className="brand-mark" href="#top" aria-label={t.brandHome}>
      <img className="brand-mark__symbol" src={brand.symbolSrc} width="40" height="40" alt="" aria-hidden="true" />
      <span className="brand-mark__type" aria-hidden="true">
        <span className="brand-mark__name">{brand.name}</span>
        <span className="brand-mark__sub">{t.brandTagline}</span>
      </span>
    </a>
  );
}
