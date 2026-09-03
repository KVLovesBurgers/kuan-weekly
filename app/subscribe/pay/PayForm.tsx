"use client";

import { useEffect, useRef } from "react";

export function PayForm({
  action,
  fields,
}: {
  action: string;
  fields: Record<string, string>;
}) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    ref.current?.submit();
  }, []);
  return (
    <form ref={ref} action={action} method="post" className="form card" style={{ marginTop: 16 }}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button className="btn btn-ink" type="submit">
        前往付款
      </button>
    </form>
  );
}
