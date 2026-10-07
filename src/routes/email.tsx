import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Chips, Panel, PrimaryButton, Shell, ToolPage, fieldCls } from "@/components/nova";
import { ResultBox } from "@/components/ResultBox";
import { runEmail, type EmailResult } from "@/lib/nova.functions";
import { LENGTHS, TONES, useSettings, type Length, type Tone } from "@/lib/settings";
import { useTool } from "@/lib/use-tool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — NOVA AI" },
      { name: "description", content: "Write or improve professional emails in six tones." },
      { property: "og:title", content: "Smart Email Generator — NOVA AI" },
      { property: "og:description", content: "Write or improve professional emails in six tones." },
    ],
  }),
  component: Page,
});

type In = { recipient: string; purpose: string; message: string; tone: Tone; length: Length; mode: "new" | "improve" };
const fmt = (r: EmailResult) => `Subject: ${r.subject}\n\n${r.body}`;

function Page() {
  const fn = useServerFn(runEmail);
  const tool = useTool((d: In) => fn({ data: d }), fmt);
  const { settings } = useSettings();
  const [f, setF] = useState<In>({ recipient: "", purpose: "", message: "", tone: "Professional", length: "standard", mode: "new" });
  const [err, setErr] = useState("");
  useEffect(() => setF((p) => ({ ...p, tone: settings.emailTone })), [settings.emailTone]);
  const set = <K extends keyof In>(k: K, v: In[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (f.message.trim().length < 3) return setErr(f.mode === "improve" ? "Please paste the draft to improve." : "Please describe the main message.");
    setErr("");
    tool.run({ ...f, message: settings.signature ? `${f.message}\n\nSign as: ${settings.signature}` : f.message });
  };
  const r = tool.data;
  return (
    <Shell>
      <ToolPage eyebrow="Smart Email Generator" title="Emails that sound like you" intro="Describe what you want to say, or paste a draft to improve. NOVA won't add facts you didn't provide.">
        <Panel label="Email details">
          <Chips label="Mode" value={f.mode} options={["new", "improve"] as const} onChange={(v) => set("mode", v)} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-muted-foreground">Recipient / audience
              <input className={`${fieldCls} mt-1`} value={f.recipient} onChange={(e) => set("recipient", e.target.value)} placeholder="e.g. Hiring manager" />
            </label>
            <label className="text-xs font-semibold text-muted-foreground">Purpose
              <input className={`${fieldCls} mt-1`} value={f.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="e.g. Follow up after interview" />
            </label>
          </div>
          <label className="mt-3 block text-xs font-semibold text-muted-foreground">{f.mode === "improve" ? "Your draft" : "Main message & important details"}
            <textarea className={`${fieldCls} mt-1 min-h-[160px]`} value={f.message} onChange={(e) => set("message", e.target.value)} />
          </label>
          {err && <p role="alert" className="mt-2 text-xs text-destructive">{err}</p>}
          <div className="mt-4 space-y-4">
            <Chips label="Tone" value={f.tone} options={TONES} onChange={(v) => set("tone", v)} />
            <Chips label="Length" value={f.length} options={LENGTHS} onChange={(v) => set("length", v)} />
          </div>
          <PrimaryButton loading={tool.loading} onClick={submit}>{f.mode === "improve" ? "Improve email" : "Generate email"}</PrimaryButton>
        </Panel>
        <ResultBox label="Your email" tool={tool}>
          {r && (
            <div>
              <p className="text-sm"><span className="text-muted-foreground">Subject:</span> <span className="font-semibold">{r.subject}</span></p>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{r.body}</div>
            </div>
          )}
        </ResultBox>
      </ToolPage>
    </Shell>
  );
}
