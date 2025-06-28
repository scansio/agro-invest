import Reblend, { FC } from "reblendjs";

const Palette = ({ colorClass }: { colorClass: string }) => {
  return (
    <div class={`p-2 m-1 ${colorClass} flex items-center justify-center`}>
      {colorClass}
    </div>
  );
};

const colors = {
  brand: [
    "bg-brand",
    "bg-brand-200",
    "bg-brand-300",
    "bg-brand-400",
    "bg-brand-500",
    "bg-brand-600",
    "bg-brand-700",
    "bg-brand-800",
    "bg-brand-900",
  ],
  secondary: [
    "bg-secondary",
    "bg-secondary-200",
    "bg-secondary-300",
    "bg-secondary-400",
    "bg-secondary-500",
    "bg-secondary-600",
    "bg-secondary-700",
    "bg-secondary-800",
    "bg-secondary-900",
  ],
  support: [
    "bg-support",
    "bg-support-200",
    "bg-support-300",
    "bg-support-400",
    "bg-support-500",
    "bg-support-600",
    "bg-support-700",
    "bg-support-800",
    "bg-support-900",
  ],
  neutral: [
    "bg-neutral",
    "bg-neutral-200",
    "bg-neutral-300",
    "bg-neutral-400",
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
    "bg-neutral-800",
    "bg-neutral-900",
  ],
  info: [
    "bg-info",
    "bg-info-200",
    "bg-info-300",
    "bg-info-400",
    "bg-info-500",
    "bg-info-600",
    "bg-info-700",
    "bg-info-800",
    "bg-info-900",
  ],
  warning: [
    "bg-warning",
    "bg-warning-200",
    "bg-warning-300",
    "bg-warning-400",
    "bg-warning-500",
    "bg-warning-600",
    "bg-warning-700",
    "bg-warning-800",
    "bg-warning-900",
  ],
  danger: [
    "bg-danger",
    "bg-danger-200",
    "bg-danger-300",
    "bg-danger-400",
    "bg-danger-500",
    "bg-danger-600",
    "bg-danger-700",
    "bg-danger-800",
    "bg-danger-900",
  ],
  success: [
    "bg-success",
    "bg-success-200",
    "bg-success-300",
    "bg-success-400",
    "bg-success-500",
    "bg-success-600",
    "bg-success-700",
    "bg-success-800",
    "bg-success-900",
  ],
};

const alertColors = {
  info: [
    "bg-info-100 text-info-900 border-info-300",
    "bg-info-500 text-white border-info-700",
  ],
  warning: [
    "bg-warning-100 text-warning-900 border-warning-300",
    "bg-warning-500 text-white border-warning-700",
  ],
  danger: [
    "bg-danger-100 text-danger-900 border-danger-300",
    "bg-danger-500 text-white border-danger-700",
  ],
  success: [
    "bg-success-100 text-success-900 border-success-300",
    "bg-success-500 text-white border-success-700",
  ],
};

export const ThemeDefinitionSample: FC = () => {

  return (
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-4">Theme Definition Sample</h1>
      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Color Palette</h2>
        <div className="flex flex-row gap-2 items-center">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
              <label className="text-lg font-bold mb-2 block">
                {key.charAt(0).toUpperCase() + key.slice(1)} Colors
              </label>
              <div className="flex flex-col gap-0.5">
                {value.map((colorClass, index) => (
                  <div key={colorClass}>
                    <Palette key={colorClass} colorClass={colorClass} />
                    {!index ? <hr class="pb-2 mb-2 mt-2" /> : ""}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <hr class="py-10 " />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Button Color States</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 rounded text-white bg-brand-500 hover:bg-brand-600 focus:ring-2 focus:ring-brand-300">
            Primary
          </button>
          <button className="px-4 py-2 rounded text-secondary-50 bg-secondary-500 hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-200">
            Secondary
          </button>
          <button className="px-4 py-2 rounded text-support-900 bg-support-500 hover:bg-support-600 border border-support-400">
            Support
          </button>
          <button className="px-4 py-2 rounded text-neutral-900 bg-neutral-100 border border-gray-300">
            Neutral
          </button>
          <button
            className="px-4 py-2 rounded text-white bg-brand-300 cursor-not-allowed"
            disabled
          >
            Disabled
          </button>
        </div>
      </section>
      <hr class="py-10 " />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sample Usage</h2>
        <div className="space-y-2">
          <div className="p-4 bg-brand-100 text-brand-900 rounded">
            Brand background, brand text
          </div>
          <div className="p-4 bg-secondary-100 text-secondary-900 rounded">
            Secondary background, secondary text
          </div>
          <div className="p-4 bg-support-100 text-support-900 rounded">
            Support background, support text
          </div>
          <div className="p-4 bg-white text-brand-700 border border-brand-200 rounded">
            Neutral background, brand border
          </div>
        </div>
      </section>
      <hr class="py-10 " />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Accessibility Contrast</h2>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>
            Brand and secondary colors have sufficient contrast for text and UI
            elements.
          </li>
          <li>
            Use <span className="font-mono">text-white</span> on dark
            backgrounds and <span className="font-mono">text-brand-900</span> or{" "}
            <span className="font-mono">text-secondary-900</span> on light
            backgrounds.
          </li>
          <li>
            Disabled states use opacity and{" "}
            <span className="font-mono">cursor-not-allowed</span> for clarity.
          </li>
        </ul>
      </section>
      <hr class="py-10 " />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Alert Visuals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(alertColors).map(([type, variants]) => (
            <div key={type}>
              <div className="text-lg font-bold mb-1 capitalize">
                {type} alert
              </div>
              {variants.map((cls, i) => (
                <div
                  key={cls}
                  className={`border-l-4 rounded p-4 mb-2 flex items-center gap-2 ${cls}`}
                >
                  <span className="text-xl">
                    {type === "info"
                      ? "ℹ️"
                      : type === "warning"
                      ? "⚠️"
                      : type === "danger"
                      ? "⛔"
                      : type === "success"
                      ? "✅"
                      : ""}
                  </span>
                  <span>
                    {type.charAt(0).toUpperCase() + type.slice(1)} alert example
                    ({i === 0 ? "light" : "bold"})
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <hr class="py-10 " />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Spacing & Font Family Visuals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spacing scale */}
          <div>
            <div className="text-lg font-bold mb-2">Spacing Scale</div>
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 4, 8, 12, 16, 24, 32, 40, 64].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`bg-brand-400 h-4`}
                    style={{ width: `${s * 0.25}rem`, minWidth: "1rem" }}
                  />
                  <span className="text-xs text-neutral-700">{`space-${s} (${
                    s * 0.25
                  }rem)`}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Font family samples */}
          <div>
            <div className="text-lg font-bold mb-2">Font Family</div>
            <div className="flex flex-col gap-2">
              <div className="font-sans text-lg">
                This is <span className="font-bold">font-sans</span> (Inter,
                system-ui, etc.)
              </div>
              <div className="font-serif text-lg">
                This is <span className="font-bold">font-serif</span> (Georgia,
                Times, etc.)
              </div>
              <div className="font-mono text-lg">
                This is <span className="font-bold">font-mono</span> (Menlo,
                Monaco, etc.)
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr class="py-10 " />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Tailwind Plugin Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Typography plugin (prose) */}
          <div>
            <div className="text-lg font-bold mb-2">Typography (prose)</div>
            <article className="prose max-w-none">
              <h1>Prose Heading</h1>
              <p>
                This is a sample paragraph using{" "}
                <code>@tailwindcss/typography</code>. It automatically styles
                headings, paragraphs, lists, code, and more for beautiful,
                readable content.
              </p>
              <ul>
                <li>Easy to read</li>
                <li>Great for docs, blogs, markdown</li>
              </ul>
              <pre>
                <code>{`<div className="prose">...</div>`}</code>
              </pre>
            </article>
          </div>
          {/* Forms plugin */}
          <div>
            <div className="text-lg font-bold mb-2">Forms</div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Text input"
                className="form-input w-full"
              />
              <input className="form-input rounded shadow w-full" />
              <select className="form-select w-full">
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <input type="checkbox" className="form-checkbox" id="check1" />{" "}
              <label htmlFor="check1">Checkbox</label>
              <button
                type="submit"
                className="form-button bg-brand-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
          {/* Aspect Ratio plugin */}
          <div>
            <div className="text-lg font-bold mb-2">Aspect Ratio</div>
            <div className="aspect-w-16 aspect-h-9 bg-brand-200 rounded overflow-hidden flex items-center justify-center">
              <span className="text-brand-900">16:9 Aspect Ratio</span>
            </div>
            <pre>
              <code>{`<div className="aspect-w-16 aspect-h-9">...</div>`}</code>
            </pre>
          </div>
          {/* Line Clamp plugin */}
          <div>
            <div className="text-lg font-bold mb-2">Line Clamp</div>
            <p className="line-clamp-2 bg-neutral-50 p-2 rounded">
              This is a long paragraph that will be truncated after two lines
              using the <code>line-clamp-2</code> utility from{" "}
              <code>@tailwindcss/line-clamp</code>. Add{" "}
              <code>line-clamp-N</code> to clamp to N lines.
            </p>
            <pre>
              <code>{`<p className="line-clamp-2">...</p>`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
