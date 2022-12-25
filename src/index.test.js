import React from "react";
import $ from "react-test";
import useKeys from "./";

const Demo = ({ short, shortcuts, children }) => {
  useKeys(short || shortcuts);
  return children ? children : <div>Hello</div>;
};

describe("useKeys()", () => {
  it("can detect pressing a single key on the window", async () => {
    const fn = jest.fn();
    const demo = $(<Demo shortcuts={{ k: fn }} />);
    await demo.trigger("keydown", { key: "k", target: window });
    expect(fn).toBeCalled();
  });

  it("can detect pressing a single key on the body", async () => {
    const fn = jest.fn();
    const demo = $(<Demo shortcuts={{ k: fn }} />);
    await demo.trigger("keydown", { key: "k", target: window.document.body });
    expect(fn).toBeCalled();
  });

  it("ignores pressing a key while in an input", async () => {
    const fn = jest.fn();
    const demo = $(
      <Demo shortcuts={{ k: fn }}>
        <input />
      </Demo>
    );
    await demo.trigger("keydown", { key: "k" });
    expect(fn).not.toBeCalled();
  });

  it("can be forced to use the input as a listener", async () => {
    const fn = jest.fn();
    const demo = $(
      <Demo shortcuts={{ "input:k": fn }}>
        <input />
      </Demo>
    );
    await demo.trigger("keydown", { key: "k" });
    expect(fn).toBeCalled();
  });

  it("forced elements only trigger while in that element", async () => {
    const fn = jest.fn();
    const demo = $(
      <Demo shortcuts={{ "input:k": fn }}>
        <input />
      </Demo>
    );
    await demo.trigger("keydown", { key: "k", target: window });
    expect(fn).not.toBeCalled();
  });

  it("forced anything trigger on window events", async () => {
    const fn = jest.fn();
    const demo = $(<Demo shortcuts={{ "*:k": fn }} />);
    await demo.trigger("keydown", { key: "k", target: window });
    expect(fn).toBeCalled();
  });

  it("forced anything trigger on body events", async () => {
    const fn = jest.fn();
    const demo = $(<Demo shortcuts={{ "*:k": fn }} />);
    await demo.trigger("keydown", { key: "k", target: window });
    expect(fn).toBeCalled();
  });

  it("forced anything trigger on input events", async () => {
    const fn = jest.fn();
    const demo = $(
      <Demo shortcuts={{ "*:k": fn }}>
        <input />
      </Demo>
    );
    await demo.trigger("keydown", { key: "k" });
    expect(fn).toBeCalled();
  });

  it("works with nicknames", async () => {
    const testShortcut = async (key, extraKey) => {
      const fn = jest.fn();
      const demo = await $(<Demo short={{ [key]: fn }} />);
      await demo.trigger("keydown", { key: extraKey, target: window });
      return fn;
    };

    expect(await testShortcut(" ", " ")).toHaveBeenCalled();
    expect(await testShortcut("Esp", " ")).toHaveBeenCalled();
    expect(await testShortcut("Espace", " ")).toHaveBeenCalled();
    expect(await testShortcut("Up", "ArrowUp")).toHaveBeenCalled();
    expect(await testShortcut("up", "ArrowUp")).toHaveBeenCalled();
    expect(await testShortcut("arrowup", "ArrowUp")).toHaveBeenCalled();
  });
});
