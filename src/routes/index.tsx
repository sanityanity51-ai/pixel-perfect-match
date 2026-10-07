import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/nova";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOVA AI — Research, meetings & email assistant" },
      { name: "description", content: "Your intelligent assistant for research, meetings, and professional communication." },
      { property: "og:title", content: "NOVA AI — Research, meetings & email assistant" },
      { property: "og:description", content: "Your intelligent assistant for research, meetings, and professional communication." },
    ],
  }),
  component: Index,
});

const cards = [
  { to: "/research", icon: "🔎", tint: "bg-primary/10", title: "Research Assistant", text: "Research, summarize, analyze, and receive recommendations.", sample: <><span className="text-muted-foreground">Q:</span> What moved EV battery costs in 2024?</> },
  { to: "/meetings", icon: "📝", tint: "bg-glow-2", title: "Meeting Summarizer", text: "Turn long meeting notes into clear summaries, decisions, and action items.", sample: <>✓ Ship pricing page — Dana — Friday</> },
  { to: "/email", icon: "✉️", tint: "bg-glow-3", title: "Smart Email Generator", text: "Create professional emails in different tones.", sample: <><span className="text-muted-foreground">Subject:</span> Quick update on the Q3 launch</> },
] as const;

function Index() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-20 text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Your AI workspace
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Welcome to <span className="text-primary">NOVA AI</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">Your intelligent assistant for research, meetings, and professional communication.</p>
        <div className="mt-8 flex items-center justify-center">
          <Link to="/research" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-brand">Start researching</Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="glass rounded-3xl p-7 transition hover:-translate-y-1">
            <div className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${c.tint}`} aria-hidden>{c.icon}</div>
            <h2 className="mt-5 text-xl font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            <div className="well mt-5 rounded-xl p-4 text-sm">{c.sample}</div>
          </Link>
        ))}
      </section>
    </Shell>
  );
}
