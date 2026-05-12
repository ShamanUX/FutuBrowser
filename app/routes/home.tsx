import { Plus, ViewGrid } from 'iconoir-react'

import { ThumbnailGridContainer } from '../components/thumbnail-grid/ThumbnailGridContainer'

export function meta() {
  return [
    { title: 'FutuBrowser' },
    { name: 'description', content: 'Welcome to FutuBrowser!' },
  ]
}

export default function Home() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-4 py-6 text-slate-950 sm:px-6 sm:py-10 dark:text-slate-50">
      <Header />
      <ThumbnailGridContainer />
    </main>
  )
}

function Header() {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          FutuBrowser
        </p>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Browse beautiful Futus!
        </p>
      </div>
      <div
        aria-label="Features"
        className="flex items-center gap-2"
        role="toolbar"
      >
        <button
          aria-current="page"
          aria-label="Thumbnail grid"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-950 bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
          type="button"
        >
          <ViewGrid aria-hidden="true" height={22} width={22} />
          Grid
        </button>
        <div className="group relative">
          <button
            aria-label="Upcoming feature"
            className="inline-flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 opacity-70 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-600"
            disabled
            title="Upcoming feature"
            type="button"
          >
            <Plus aria-hidden="true" height={22} width={22} />
          </button>
          <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-slate-100 dark:text-slate-950">
            Upcoming feature
          </span>
        </div>
      </div>
    </header>
  )
}
