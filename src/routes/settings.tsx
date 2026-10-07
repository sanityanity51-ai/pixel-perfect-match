import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Chips, Shell, fieldCls } from "@/components/nova";
import { CONTACT_EMAIL, LENGTHS, TONES, useSettings } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NOVA AI" },
      { name: "description", content: "Set your default summary length, email tone and data preferences." },
      { property: "og:title", content: "Settings — NOVA AI" },
      { property: "og:description", content: "Set your default summary length, email tone and data preferences." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, update, reset } = useSettings();
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 pt-14 sm:px-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-7">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Shape how NOVA writes. Saved only in this browser.</p>
          <div className="mt-6 space-y-5">
            <Chips label="Default summary length" value={settings.summaryLength} options={LENGTHS} onChange={(v) => update({ summaryLength: v })} />
            <Chips label="Default email tone" value={settings.emailTone} options={TONES} onChange={(v) => update({ emailTone: v })} />
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email sign-off name
              <input className={`${fieldCls} mt-2 normal-case tracking-normal`} value={settings.signature} onChange={(e) => update({ signature: e.target.value })} placeholder="e.g. Sam Lee" />
            </label>
          </div>
        </div>
        <div className="glass rounded-3xl p-7">
          <h2 className="text-2xl font-semibold">Data & account</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="well flex items-center justify-between rounded-xl px-4 py-3"><span className="font-medium">Saved history</span><span className="rounded-lg bg-success-soft px-3 py-1 font-semibold text-success">None stored</span></div>
            <div className="well flex items-center justify-between rounded-xl px-4 py-3"><span className="font-medium">Contact</span><a className="font-semibold text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>
            <button onClick={() => { reset(); toast.success("All local preferences deleted"); }} className="w-full rounded-xl bg-destructive/10 py-2.5 font-semibold text-destructive hover:bg-destructive/15">
              Delete all saved preferences
            </button>
          </div>
        </div>
      </section>
    </Shell>
  );
}
