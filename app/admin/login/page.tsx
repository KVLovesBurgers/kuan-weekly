import { adminLogin } from "@/app/actions/admin";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="section" style={{ background: "var(--ink)", color: "var(--paper)", minHeight: "100vh" }}>
      <div className="wrap" style={{ maxWidth: 420 }}>
        <p className="kicker">老師後台</p>
        <h1 className="display">寬數週練</h1>
        {error ? <p className="banner warn">{error}</p> : null}
        <form action={adminLogin} className="form card" style={{ marginTop: 20 }}>
          <label>ADMIN_EMAIL</label>
          <input name="email" type="email" required defaultValue="admin@kuan.tw" />
          <label>密碼（.env ADMIN_PASSWORD）</label>
          <input name="password" type="password" required />
          <button className="btn btn-ink" type="submit">
            登入
          </button>
        </form>
      </div>
    </main>
  );
}
