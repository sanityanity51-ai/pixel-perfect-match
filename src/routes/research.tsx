import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Chips, FileLoader, List, Panel, PrimaryButton, Shell, ToolPage, fieldCls } from "@/components/nova";
import { ResultBox } from "@/components/ResultBox";
import { runResearch, type ResearchResult } from "@/lib/nova.functions";
import { LENGTHS, useSettings, type Length } from "@/lib/settings";
import { useTool } from "@/lib/use-tool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — NOVA AI" },
      { name: "description", content: "Summarize topics and documents into facts, insights and recommendations." },
      { property: "og:title", content: "Research Assistant — NOVA AI" },
      { property: "og:description", content: "Summarize topics and documents into facts, insights and recommendations." },
    ],
  }),
  component: Page,
});

const fmt = (r: ResearchResult) =>
  `Topic: ${r.topic}\n\nSummary\n${r.summary}\n\nKey Points\n${r.facts.map((x) => `• ${x}`).join("\n")}\n\nInsights\n${r.insights.map((x) => `• ${x}`).join("\n")}\n\nRecommendations\n${r.recommendations.map((x) => `• ${x}`).join("\n")}`;

function Page() {
  const fn = useServerFn(runResearch);
  const tool = useTool((d: { input: string; length: Length }) => fn({ data: d }), fmt);
  const { settings } = useSettings();
  const [input, setInput] = useState("");
  const [length, setLength] = useState<Length>("standard");
  const [err, setErr] = useState("");
  useEffect(() => setLength(settings.summaryLength), [settings.summaryLength]);

  const submit = () => {
    if (input.trim().length < 3) return setErr("Please enter a topic, question or text.");
    setErr("");
    tool.run({ input, length });
  };
  const r = tool.data;
  return (
    <Shell>
      <ToolPage eyebrow="Research Assistant" title="Research, summarize, analyze" intro="Paste an article, report or text, or enter a topic or question. NOVA separates facts from its own insights and recommendations.">
        <Panel label="Your research material" action={<FileLoader onText={setInput} />}>
          <label htmlFor="r-in" className="sr-only">Research input</label>
          <textarea id="r-in" className={`${fieldCls} min-h-[240px]`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. What are the main drivers of renewable energy adoption? Or paste an article…" />
          {err && <p role="alert" className="mt-2 text-xs text-destructive">{err}</p>}
          <div className="mt-4"><Chips label="Summary length" value={length} options={LENGTHS} onChange={setLength} /></div>
          <PrimaryButton loading={tool.loading} onClick={submit}>Generate brief</PrimaryButton>
        </Panel>
        <ResultBox label="NOVA's brief" tool={tool}>
          {r && (
            <div>
              <p className="text-xs font-semibold text-primary">Topic: {r.topic}</p>
              <p className="mt-2 text-sm leading-relaxed">{r.summary}</p>
              <List title="Key points (information)" items={r.facts} />
              <List title="AI insights" items={r.insights} />
              <List title="AI recommendations" items={r.recommendations} />
            </div>
          )}
        </ResultBox>
      </ToolPage>
    </Shell>
  );
}
