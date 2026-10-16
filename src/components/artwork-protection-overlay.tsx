import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";

function isPageActive(pointerInside: boolean) {
  return document.visibilityState === "visible" && document.hasFocus() && pointerInside;
}

export default function ArtworkProtectionOverlay() {
  const [covered, setCovered] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let pointerInside = true;

    const cover = () => setCovered(true);
    const revealWhenActive = () => setCovered(!isPageActive(pointerInside));
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerInside = false;
      cover();
    };
    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerInside = true;
      revealWhenActive();
    };

    window.addEventListener("blur", cover);
    window.addEventListener("focus", revealWhenActive);
    document.addEventListener("visibilitychange", revealWhenActive);
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      window.removeEventListener("blur", cover);
      window.removeEventListener("focus", revealWhenActive);
      document.removeEventListener("visibilitychange", revealWhenActive);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, []);

  return (
    <div
      className={`artwork-protection-overlay${covered ? " artwork-protection-overlay--active" : ""}`}
      data-testid="artwork-protection-overlay"
      aria-hidden="true"
    >
      <span>{t.protectionOverlay}</span>
    </div>
  );
}
