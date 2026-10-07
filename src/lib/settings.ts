import { useEffect, useState } from "react";

export type Length = "short" | "standard" | "detailed";
export type Tone = "Formal" | "Professional" | "Friendly" | "Persuasive" | "Polite" | "Casual";
export const TONES: Tone[] = ["Formal", "Professional", "Friendly", "Persuasive", "Polite", "Casual"];
export const LENGTHS: Length[] = ["short", "standard", "detailed"];
export const CONTACT_EMAIL = "sanityanity51@gmail.com";

export type Settings = { summaryLength: Length; emailTone: Tone; signature: string };
const KEY = "nova-settings";
const DEFAULTS: Settings = { summaryLength: "standard", emailTone: "Professional", signature: "" };

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const update = (s: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...s };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };
  const reset = () => {
    localStorage.removeItem(KEY);
    setSettings(DEFAULTS);
  };
  return { settings, update, reset };
}
