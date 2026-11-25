/**
 * Presentational switch. It renders as a span because it always sits inside the
 * clickable feature card button, and nested buttons are invalid markup.
 * The knob travels the other way under RTL.
 */
export default function ToggleSwitch({ checked }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all duration-200 ease-in-out ${
        checked
          ? 'border-indigo-400 bg-indigo-600 shadow-lg shadow-indigo-500/30'
          : 'border-slate-700 bg-slate-800'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out ${
          checked
            ? 'translate-x-6 rtl:-translate-x-6'
            : 'translate-x-1 rtl:-translate-x-1'
        }`}
      />
    </span>
  )
}
