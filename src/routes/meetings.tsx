import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileLoader, List, Panel, PrimaryButton, Shell, ToolPage, fieldCls } from "@/components/nova";
import { ResultBox } from "@/components/ResultBox";
import { runMeeting, type MeetingResult } from "@/lib/nova.functions";
import { useTool } from "@/lib/use-tool";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — NOVA AI" },
      { name: "description", content: "Turn meeting notes into summaries, decisions, action items and dates." },
      { property: "og:title", content: "Meeting Summarizer — NOVA AI" },
      { property: "og:description", content: "Turn meeting notes into summaries, decisions, action items and dates." },
    ],
  }),
  component: Page,
});

const fmt = (r: MeetingResult) =>
  `Meeting Summary\n${r.summary}\n\nKey Discussion Points\n${r.key_points.map((x) => `• ${x}`).join("\n")}\n\nDecisions Made\n${r.decisions.map((x) => `• ${x}`).join("\n") || "Not specified"}\n\nAction Items\n${r.action_items.map((a) => `• ${a.task} — ${a.person} — ${a.deadline}`).join("\n") || "Not specified"}\n\nImportant Dates\n${r.important_dates.map((d) => `• ${d.date}: ${d.event}`).join("\n") || "Not specified"}`;

function Page() {
  const fn = useServerFn(runMeeting);
  const tool = useTool((d: { input: string }) => fn({ data: d }), fmt);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (input.trim().length < 10) return setErr("Please paste your meeting notes or transcript.");
    setErr("");
    tool.run({ input });
  };
  const r = tool.data;
  return (
    <Shell>
      <ToolPage eyebrow="Meeting Summarizer" title="From long notes to clear next steps" intro="Paste meeting notes or a transcript. NOVA only lists decisions, owners and deadlines that are actually mentioned.">
        <Panel label="Meeting notes" action={<FileLoader onText={setInput} />}>
          <label htmlFor="m-in" className="sr-only">Meeting notes</label>
          <textarea id="m-in" className={`${fieldCls} min-h-[300px]`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste notes or transcript here…" />
          {err && <p role="alert" className="mt-2 text-xs text-destructive">{err}</p>}
          <PrimaryButton loading={tool.loading} onClick={submit}>Summarize meeting</PrimaryButton>
        </Panel>
        <ResultBox label="Meeting summary" tool={tool}>
          {r && (
            <div>
              <p className="text-sm leading-relaxed">{r.summary}</p>
              <List title="Key discussion points" items={r.key_points} />
              <List title="Decisions made" items={r.decisions} />
              <div className="mt-4">
                <h3 className="font-sans text-sm font-semibold">Action items</h3>
                {r.action_items.length ? (
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs text-muted-foreground"><tr><th className="py-1 pr-2">Task</th><th className="pr-2">Person</th><th>Deadline</th></tr></thead>
                      <tbody>{r.action_items.map((a, i) => <tr key={i} className="border-t border-input"><td className="py-1.5 pr-2">{a.task}</td><td className="pr-2">{a.person}</td><td>{a.deadline}</td></tr>)}</tbody>
                    </table>
                  </div>
                ) : <p className="mt-1 text-sm text-muted-foreground">Not specified</p>}
              </div>
              <List title="Important dates" items={r.important_dates.map((d) => `${d.date}: ${d.event}`)} />
            </div>
          )}
        </ResultBox>
      </ToolPage>
    </Shell>
  );
}
