import Link from "next/link";

/**
 * 免費段考弱點檢測（/diag）入口。文案沿用 /diag 頁；不放價格，導流路徑：檢測 → 免費一週週練 → 寬數週練。
 * variant="banner"：首頁 hero 下方整條；"inline"：國中 /learn、/units 頁底部。
 */
export function DiagCta({ src, variant = "inline" }: { src: string; variant?: "banner" | "inline" }) {
  const href = `/diag?src=${src}`;
  return (
    <aside className={`diag-cta diag-cta--${variant}`} aria-label="免費段考弱點檢測">
      <div className="diag-cta-text">
        <p className="eyebrow">免費段考弱點檢測｜第二次段考 11/25-26</p>
        <h2 className="diag-cta-h">先找出弱點單元，再決定怎麼補</h2>
        <p className="diag-cta-p">
          國一、國二、國三、高三各一份，8 到 10 題單選，大約 10 分鐘。交卷馬上看分數和弱點單元；留下 Email 可看每題詳解，並領對應範圍的免費一週週練。
        </p>
      </div>
      <Link href={href} className="btn btn-ink diag-cta-btn" data-track={`diag_cta_${src}`}>
        開始免費檢測
      </Link>
    </aside>
  );
}
