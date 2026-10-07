import { useState } from "react";

type R<T> = { ok: true; data: T } | { ok: false; error: string };

/** Shared state for an AI tool: loading, error, result, editable text. */
export function useTool<I, T>(call: (input: I) => Promise<R<T>>, format: (t: T) => string) {
  const [data, setData] = useState<T | null>(null);
  const [text, setText] = useState("");
  const [edited, setEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<I | null>(null);

  const run = async (input: I) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setLast(input);
    try {
      const r = await call(input);
      if (r.ok) {
        setData(r.data);
        setText(format(r.data));
        setEdited(false);
        setEditing(false);
      } else setError(r.error);
    } catch {
      setError("Something went wrong while processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return {
    data, text, edited, editing, loading, error,
    run,
    regenerate: () => last && run(last),
    toggleEdit: () => setEditing((e) => !e),
    setText: (t: string) => { setText(t); setEdited(true); },
    clear: () => { setData(null); setText(""); setError(null); setEditing(false); setEdited(false); },
  };
}
