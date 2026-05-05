import { useEffect } from "react";

type ShortcutCallback = (event: KeyboardEvent) => void;
export type Shortcuts = Record<string, ShortcutCallback>;

interface ParsedShortcut {
  target: string;
  keys: string[];
  cb: ShortcutCallback;
}

const toShortNames = (name: string): string => {
  name = name.toLowerCase();
  if (name === "arrowleft") return "left";
  if (name === "arrowright") return "right";
  if (name === "arrowup") return "up";
  if (name === "arrowdown") return "down";
  if (name === "esc") return "escape";
  if (name === "esp") return "espace";
  if (name === " ") return "espace";
  return name;
};

export default function useShortcuts(keys: Shortcuts): void {
  useEffect(() => {
    const cbs: ParsedShortcut[] = Object.entries(keys).map(([key, cb]) => {
      const targets = key.toLowerCase().split(":");
      const keyList = targets.pop()!.split("+").map(toShortNames);
      let target = (targets[0] || "BODY").toUpperCase();
      if (target === "WINDOW") {
        target = "BODY";
      }
      return { target, keys: keyList, cb };
    });

    const onKey = (e: KeyboardEvent) => {
      const eTarget =
        e.target === window
          ? window.document.body
          : (e.target as Element | null);
      if (!eTarget) return;

      const key = toShortNames(e.key);
      const short = cbs.find(({ target, keys }) => {
        if (!eTarget.matches(target)) return false;

        for (let k of keys) {
          let negate = false;
          if (k.startsWith("!")) {
            negate = true;
            k = k.slice(1);
          }
          if (k.endsWith("!")) {
            negate = true;
            k = k.slice(0, -1);
          }
          if (k === key) continue;
          if ((e as unknown as Record<string, boolean>)[k + "Key"] === !negate)
            continue;
          return false;
        }
        return true;
      });

      if (!short) return;

      e.preventDefault();
      short.cb(e);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keys]);
}
