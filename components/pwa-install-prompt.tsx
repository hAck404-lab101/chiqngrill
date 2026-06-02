"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = window.localStorage.getItem("chiqngrill-install-dismissed") === "true";
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone;
    const iOSDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    setIsIOS(iOSDevice);

    if (standalone || dismissed) return;

    const timer = window.setTimeout(() => setIsVisible(true), 2400);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsVisible(false);
  }

  function dismiss() {
    window.localStorage.setItem("chiqngrill-install-dismissed", "true");
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-[90] mx-auto max-w-md rounded-[26px] border-2 border-[#17110d] bg-[#fffaf1] p-4 text-[#17110d] shadow-[6px_6px_0_#17110d] md:bottom-6">
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-[#17110d] bg-[#d86b2b] font-black text-white">
          CNG
        </div>
        <div>
          <h2 className="text-lg font-black leading-tight">Save Chiq-N-Grill as an app</h2>
          <p className="mt-1 text-sm leading-5 text-[#4c3b31]">
            Add it to your home screen for quick ordering, reservations, and order tracking.
          </p>
          {isIOS && !deferredPrompt ? (
            <p className="mt-2 text-xs font-bold text-[#9d3f1d]">On iPhone: tap Share, then Add to Home Screen.</p>
          ) : null}
          <div className="mt-4 flex gap-2">
            {deferredPrompt ? (
              <button type="button" onClick={handleInstall} className="rounded-full border-2 border-[#17110d] bg-[#d86b2b] px-4 py-2 text-sm font-black text-white">
                Install App
              </button>
            ) : null}
            <button type="button" onClick={dismiss} className="rounded-full border-2 border-[#17110d] px-4 py-2 text-sm font-black">
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
