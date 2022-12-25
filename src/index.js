import { useEffect } from "react";

const toShortNames = (name) => {
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

/**
 * A React Hook to create readable shortcuts. Accepts an object witih
 * the keys being the shortcuts and the values the callbacks:
 *
 * ```js
 * useShortcuts({
 *   "escape": (event) => {...},
 *   "cmd+k": (event) => {...},
 * });
 * ```
 */
export default function useShortcuts(keys) {
  useEffect(() => {
    const cbs = Object.entries(keys).map(([key, cb]) => {
      const targets = key.toLowerCase().split(":");
      const keys = targets.pop().split("+").map(toShortNames);
      let target = (targets[0] || "BODY").toUpperCase();
      if (target === "WINDOW") {
        target = "BODY";
      }
      return { target, keys, cb };
    });
    const onKey = (e) => {
      const eTarget = e.target === window ? window.document.body : e.target;
      const key = toShortNames(e.key);
      const short = cbs.find(({ target, keys }) => {
        // If there's no target, it means we are listening on Window, so make
        // it behave the same

        // If the eventTarget is not a good match for the expected one, e.g.
        // if we expect to trigger inside an INPUT but it triggers in BODY
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
          // Literal key matches, "a", "/", "up", etc.
          if (k === key) continue;
          // metaKey, altKey, etc.
          if (e[k + "Key"] === !negate) continue;
          return false;
        }
        return true;
      });
      // console.log(key, keys, cbs, short);
      if (!short) return;

      // Execute it, finally!
      e.preventDefault();
      short.cb(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keys]);
}
