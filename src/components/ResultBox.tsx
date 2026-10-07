import type { ReactNode } from "react";
import { Empty, OutputActions, Panel, fieldCls } from "./nova";
import type { useTool } from "@/lib/use-tool";

export function ResultBox({ label, tool, children }: { label: string; tool: ReturnType<typeof useTool<any, any>>; children: ReactNode }) {
  const has = !!tool.data;
  return (
    <Panel
      label={label}
      action={has && <OutputActions text={tool.text} editing={tool.editing} onEdit={tool.toggleEdit} onRegenerate={tool.regenerate} onClear={tool.clear} loading={tool.loading} />}
    >
      {!has || tool.loading || tool.error ? (
        <Empty loading={tool.loading} error={tool.error} />
      ) : tool.editing ? (
        <textarea aria-label="Edit result" className={`${fieldCls} min-h-[360px]`} value={tool.text} onChange={(e) => tool.setText(e.target.value)} />
      ) : tool.edited ? (
        <div className="whitespace-pre-wrap text-sm">{tool.text}</div>
      ) : (
        children
      )}
    </Panel>
  );
}
