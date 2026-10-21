"use client";

/** 後台刪除鈕：送出前跳確認視窗。 */
export function ConfirmDelete({
  action,
  name,
  value,
  message,
  label = "刪除",
}: {
  action: (formData: FormData) => void | Promise<void>;
  name: string;
  value: string;
  message: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      style={{ display: "inline" }}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name={name} value={value} />
      <button type="submit" className="btn btn-paper" style={{ minHeight: 36, marginTop: 6 }}>
        {label}
      </button>
    </form>
  );
}
