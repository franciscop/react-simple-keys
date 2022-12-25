# react-simple-keys

A React Hook to easily create shortcuts with a hook:

```jsx
import useKeys from "react-simple-keys";

useKeys({
  "cmd+k": (event) => {
    console.log("Open search panel");
  },
  esc: (event) => {
    console.log("Close search panel");
  },
  down: (event) => {
    console.log("Highlight next item");
  },
  up: (event) => {
    console.log("Highlight prev item");
  },
  enter: (event) => {
    if (event.metaKey) {
      console.log("Special open highlighted item");
    } else {
      console.log("Normal open highlighted item");
    }
  },
});
```

> If the shortcut is matched, then the prevent default for that shortcut will be triggered.

```js
useKeys({
  "k",   // Listening for simple "k" presses (excludes inputs/textareas/etc)
  "cmd+k",     // Listening when the modifier "cmd" is pressed
  "!cmd+k",     // Listening when "k" is pressed AND the modifier "cmd" is NOT pressed
  "input:k" ,    // Listening for "k" pressed only while an input is focused
});
```

## Shortcuts examples

A shortcut is defined with the key, and then the action to be taken is defined with the value as as function. The key can have multiple parts:

- A plain key, like `a` for the keyboard key <kbd>a</kbd>, "t" for the keyboard key <kbd>t</kbd>, etc.
- A modifier `cmd+[...]`, `shift+[...]`, etc. They are normally special keys with a plain key: `cmd+a`, `shift+k`, etc.
- A negative modifier `!cmd+[...]`: to force an alternative case, you can do `k: e => e.metaKey ? X() : Y()`, or alternatively you can specify two different modifiers, one negated: `"cmd+k": X` + `"!cmd+k": Y`.
- A namespace `namespace:[...]`; this is so that global shortcuts do not activate while typing in an inbox, so we assume any shortcut without namespace is on `"window"` (nothing is focused) one (so that `window:cmd+a`, `body:cmd+a` or `cmd+a` are all equivalent). If you want to listen only in inputs then you should do `input:cmd+a`; this is a valid CSS selector, could alternatively use `textarea:cmd+a`, etc. For listening on both unfocused and focused elements, use the `"*"` namespace `*:cmd+a`.
