import { site } from "@/data/site";

export default function TopBar() {
  return (
    <div className="hidden bg-brand md:block">
      <div className="container-x flex h-9 items-center justify-between text-[13px] text-brand-deep/75">
        <p className="truncate">
          Welcome to the {site.legalName}&apos;s official website!
        </p>
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-1.5 transition-colors hover:text-brand-deep"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
            </svg>
            English
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div className="invisible absolute right-0 top-full z-50 w-36 translate-y-1 rounded-b-xl bg-white py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block bg-soft px-4 py-2 text-[13px] font-medium text-brand-ink">
              English
            </span>
            <span className="block cursor-not-allowed px-4 py-2 text-[13px] text-body">
              中文简体
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
