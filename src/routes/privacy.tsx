import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/nova";
import { CONTACT_EMAIL } from "@/lib/settings";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — NOVA AI" },
      { name: "description", content: "How NOVA AI handles your documents, notes and emails." },
      { property: "og:title", content: "Privacy — NOVA AI" },
      { property: "og:description", content: "How NOVA AI handles your documents, notes and emails." },
    ],
  }),
  component: Page,
});

const items = [
  ["What we process", "Only the text you submit to a tool, for the purpose of generating that result."],
  ["What we store", "Nothing on our servers. Your content is processed temporarily and discarded after the response. Preferences are stored only in your browser."],
  ["AI provider", "Your text is sent securely to an AI service solely to produce your result. No account details or extra personal data are included."],
  ["Training", "Your content is not used to train models or for any unrelated purpose."],
  ["Sensitive data", "Please don't submit passwords, banking credentials, authentication codes or API keys."],
  ["Deleting data", "Clear any result with the Clear button, and delete preferences from Settings at any time."],
];

function Page() {
  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
        <div className="glass rounded-3xl p-7 md:p-10">
          <h1 className="text-3xl font-semibold">Privacy</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your data stays yours. Always.</p>
          <dl className="mt-8 space-y-4">
            {items.map(([t, d]) => (
              <div key={t} className="well rounded-xl px-4 py-3">
                <dt className="text-sm font-semibold">{t}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">Questions? <a className="font-semibold text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        </div>
      </section>
    </Shell>
  );
}
