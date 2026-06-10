import React from "react";

const countryOptions = [
  "Worldwide",
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "South Africa",
];

const CurrentEventsPanel = ({
  isOpen,
  onOpen,
  onClose,
  country,
  onCountryChange,
  onRefresh,
  loading,
  error,
  data,
}) => {
  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="fixed right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-2xl border border-cyan-400/40 bg-cyan-500 px-4 py-5 text-sm font-semibold text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-400"
        >
          Current Events
        </button>
      )}

      <aside
        className={`fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-cyan-500/20 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">AI Feed</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Current Events</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Country</label>
              <select
                value={country}
                onChange={(event) => onCountryChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                {countryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Fetching events..." : "Refresh current events"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                JSON Response
              </p>
              <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">
                {data ? JSON.stringify(data, null, 2) : "Choose a country and load the latest current events."}
              </pre>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close current events panel"
          onClick={onClose}
          className="fixed inset-0 z-30 cursor-default bg-black/35 backdrop-blur-[1px]"
        />
      )}
    </>
  );
};

export default CurrentEventsPanel;
