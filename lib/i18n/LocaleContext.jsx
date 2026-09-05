"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate } from "./translations";

const STORAGE_KEY = "algogarden.locale";
const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  // Starts as 'en' on both server and client - the same on the very first
  // render everywhere - then swaps to whatever's saved in localStorage
  // *after* mount. Reading localStorage during the initial render would
  // make the server's render and the client's first render disagree,
  // which is exactly the hydration mismatch bug fixed elsewhere in this
  // app; this effect-based approach sidesteps it the same way.
  const [locale, setLocaleState] = useState("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "uk") setLocaleState(saved);
    } catch {
      // ignore - localStorage can be unavailable (private mode, etc.)
    }
  }, []);

  // Keep the document's declared language in sync - a11y/SEO nicety that
  // has to happen client-side since the locale itself is client state.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

// The workhorse hook most components reach for: `const { t } = useTranslation();`
export function useTranslation() {
  const { locale, setLocale } = useLocale();
  const t = (key, vars) => translate(locale, key, vars);
  return { t, locale, setLocale };
}
