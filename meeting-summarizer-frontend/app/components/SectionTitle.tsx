import { ReactNode } from "react";

export function SectionTitle({ icon, title, meta }: { icon: ReactNode; title: string; meta?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-gray-100 text-gray-700">{icon}</div>
        <h2 className="text-sm font-semibold tracking-tight text-gray-900">{title}</h2>
      </div>
      {meta && <span className="text-xs text-gray-400">{meta}</span>}
    </div>
  );
}
