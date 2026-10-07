import { Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/research", label: "Research Assistant", icon: "🔎" },
  { to: "/meetings", label: "Meeting Summarizer", icon: "📝" },
  { to: "/email", label: "Email Generator", icon: "✉️" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
  { to: "/privacy", label: "Privacy", icon: "🔒" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV.map((n) => (
        <li key={n.to}>
          <Link
            to={n.to}
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "bg-secondary !text-primary shadow-sm" }}
          >
            <span aria-hidden className="w-5 shrink-0 text-center">{n.icon}</span>
            <span className="truncate">{n.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const Brand = () => (
  <Link to="/" className="flex min-w-0 items-center gap-2">
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary font-semibold text-primary-foreground shadow-brand">N</span>
    <span className="font-display text-lg font-bold tracking-tight">NOVA AI</span>
  </Link>
);

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 glow-bg" />
      <div aria-hidden className="floaty pointer-events-none fixed -top-24 left-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="floaty pointer-events-none fixed bottom-10 right-16 h-80 w-80 rounded-full bg-glow-2 blur-3xl [animation-delay:-6s]" />

      {/* Desktop sidebar */}
      <aside className="glass-strong fixed inset-y-4 left-4 z-30 hidden w-64 flex-col rounded-3xl p-5 lg:flex">
        <Brand />
        <nav aria-label="Main" className="mt-8 flex-1"><NavLinks /></nav>
        <p className="text-xs leading-relaxed text-muted-foreground">AI can make mistakes. Always review results before using them.</p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-3 z-30 mx-3 lg:hidden">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-3">
          <Brand />
          <button aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="rounded-lg bg-brand-soft px-3 py-1.5 text-sm font-semibold text-primary">Menu</button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button aria-label="Close menu" className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <aside className="glass-strong absolute inset-y-3 left-3 flex w-72 flex-col rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={() => setOpen(false)} className="text-sm font-semibold text-muted-foreground">Close</button>
            </div>
            <nav aria-label="Main" className="mt-8"><NavLinks onNavigate={() => setOpen(false)} /></nav>
          </aside>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col lg:pl-72">
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">NOVA AI — clarity, quietly automated.</footer>
      </div>
    </div>
  );
}

export const Disclaimer = () => (
  <aside role="note" className="mt-6 rounded-2xl border bg-brand-soft p-4 text-xs leading-relaxed text-muted-foreground">
    <span className="font-semibold text-foreground">Responsible AI: </span>
    Results are AI-generated and may be incomplete or inaccurate. NOVA is instructed not to invent facts, but please verify important information, names and dates before relying on or sending anything. Don't share passwords, banking details or other highly sensitive data.
  </aside>
);

export function ToolPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-10">
      <div className="glass-strong rounded-3xl p-5 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>
        <div className="mt-6 grid gap-6 xl:grid-cols-2">{children}</div>
        <Disclaimer />
      </div>
    </section>
  );
}

export const Panel = ({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) => (
  <div className="well flex flex-col rounded-2xl border p-5">
    <div className="mb-3 flex items-center justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {action}
    </div>
    {children}
  </div>
);

export const fieldCls = "w-full rounded-xl border border-input bg-popover px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${value === o ? "bg-primary text-primary-foreground" : "bg-brand-soft text-primary hover:bg-accent"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function PrimaryButton({ loading, children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button {...p} disabled={loading || p.disabled} className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition hover:opacity-90 disabled:opacity-60">
      {loading ? "Working…" : children}
    </button>
  );
}

const ALLOWED = [".txt", ".csv", ".md"];
export function FileLoader({ onText }: { onText: (t: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={ALLOWED.join(",")}
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          if (!ALLOWED.some((x) => f.name.toLowerCase().endsWith(x))) return toast.error("Unsupported file type. Please upload a TXT, CSV or MD file.");
          if (f.size > 1024 * 1024) return toast.error("File is too large. Maximum size is 1 MB.");
          onText(await f.text());
          return undefined;
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} className="text-xs font-semibold text-primary hover:underline">
        Upload file
      </button>
    </>
  );
}

export function OutputActions({ text, onEdit, editing, onRegenerate, onClear, loading }: { text: string; onEdit: () => void; editing: boolean; onRegenerate: () => void; onClear: () => void; loading: boolean }) {
  const b = "rounded-lg bg-brand-soft px-3 py-1 text-xs font-semibold text-primary hover:bg-accent disabled:opacity-50";
  return (
    <div className="flex flex-wrap gap-2">
      <button className={b} onClick={() => navigator.clipboard.writeText(text).then(() => toast.success("Copied"))}>Copy</button>
      <button className={b} onClick={onEdit}>{editing ? "Done" : "Edit"}</button>
      <button className={b} disabled={loading} onClick={onRegenerate}>Regenerate</button>
      <button className={b} onClick={onClear}>Clear</button>
    </div>
  );
}

export const Empty = ({ loading, error }: { loading: boolean; error: string | null }) =>
  error ? (
    <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
  ) : loading ? (
    <div aria-live="polite" className="space-y-2">
      <p className="text-sm text-muted-foreground">NOVA is thinking…</p>
      {[80, 95, 60].map((w) => <div key={w} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />)}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">Your result will appear here.</p>
  );

export const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-4">
    <h3 className="text-sm font-semibold font-sans">{title}</h3>
    {items.length ? (
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{items.map((i, k) => <li key={k}>{i}</li>)}</ul>
    ) : (
      <p className="mt-1 text-sm text-muted-foreground">Not specified</p>
    )}
  </div>
);
