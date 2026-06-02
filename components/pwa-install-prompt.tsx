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
    <div className="fixed inset-x-4 bottom-24 z-[90] mx-auto max-w-md rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 text-[var(--ink)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--line)] md:bottom-6">
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--brand)] text-sm font-black text-white">
          CNG
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-black leading-tight">Save Chiq-N-Grill</h2>
          <p className="mt-1 text-sm font-medium leading-5 text-[var(--muted)]">
            Add it to your home screen for faster ordering and tracking.
          </p>
          {isIOS && !deferredPrompt ? (
            <p className="mt-2 text-xs font-bold text-[var(--brand-dark)]">On iPhone: tap Share, then Add to Home Screen.</p>
          ) : null}
          <div className="mt-4 flex gap-2">
            {deferredPrompt ? (
              <button type="button" onClick={handleInstall} className="btn-primary px-4 py-2 text-sm">
                Install
              </button>
            ) : null}
            <button type="button" onClick={dismiss} className="btn-outline px-4 py-2 text-sm">
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
