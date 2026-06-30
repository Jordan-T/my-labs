import { useState } from "preact/hooks";

const STEPS = 8;

/**
 * Placeholder island that proves the end-to-end islands chain: a small piece of
 * Preact state driving a CSS custom property. Replace it with a real experiment.
 */
export default function ExampleDemo() {
  const [count, setCount] = useState(0);
  const ratio = count / STEPS;

  return (
    <div class="example-demo">
      <div
        class="example-demo-track"
        role="progressbar"
        aria-label="Intensité de la démonstration"
        aria-valuemin={0}
        aria-valuemax={STEPS}
        aria-valuenow={count}
      >
        {/* Dynamic value from state — must be inline, not a static token. */}
        <div class="example-demo-fill" style={{ "--fill": String(ratio) }} />
      </div>
      <div class="example-demo-controls">
        <button
          type="button"
          onClick={() => setCount((value) => Math.max(0, value - 1))}
        >
          Diminuer
        </button>
        <output class="example-demo-value">{count}</output>
        <button
          type="button"
          onClick={() => setCount((value) => Math.min(STEPS, value + 1))}
        >
          Augmenter
        </button>
      </div>
    </div>
  );
}
