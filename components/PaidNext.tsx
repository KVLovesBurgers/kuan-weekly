import { SITE, SOCIAL } from "@/lib/config";
import { InstagramIcon } from "@/components/SocialDm";

/**
 * 免費檢測／模擬考結果頁的「下一步」元件（/diag 與 /mock 共用）。
 * 國中 → 寬數週練（站內）；高中學測 → 考前猜題卷，只導私訊／Email，不放外部賣場連結、不寫價格。
 */
export function PaidNext({ track, label, weak, src }: { track: "jh" | "gsat"; label: string; weak: string[]; src: string }) {
  const weakText = weak.length ? `「${weak.slice(0, 3).join("、")}」` : "";
  if (track === "gsat") {
    const subject = encodeURIComponent("學測考前猜題卷（完整三回）");
    const body = encodeURIComponent(`老師好，我剛做完${label}檢測${weak.length ? `，弱點是${weak.join("、")}` : ""}，想寫完整三回猜題卷。`);
    return (
      <div className="card paid-next" id="next">
        <p className="eyebrow">下一步</p>
        <h2 className="diag-h" style={{ margin: 0 }}>想寫完整三回學測考前猜題卷</h2>
        <p className="quiz-note" style={{ fontSize: 15 }}>
          {weakText ? <>這次{weakText}失分，</> : null}照學測題型與配分出的完整三回，有詳解，適合考前計時練。想寫完整三回可以私訊我。
        </p>
        <div className="paid-next-btns">
          <a className="btn btn-ink" href={SOCIAL.instagramUrl} target="_blank" rel="noopener noreferrer" data-track={`paid_ig_${src}`}>
            <InstagramIcon /> IG 私訊 {SOCIAL.handle}
          </a>
          <a className="btn btn-paper" href={`mailto:${SITE.contactEmail}?subject=${subject}&body=${body}`} data-track={`paid_mail_${src}`}>
            Email 問老師
          </a>
        </div>
        <p className="quiz-note">吳寬老師｜交大應數畢業｜現任國中數學教師</p>
        <p className="quiz-note">需要一對一家教？<a className="u" href={`/tutor?src=${src}`}>加入家教候補名單</a></p>
      </div>
    );
  }
  return (
    <div className="card paid-next" id="next">
      <p className="eyebrow">下一步</p>
      <h2 className="diag-h" style={{ margin: 0 }}>每週一份，照段考進度補弱點</h2>
      <p className="quiz-note" style={{ fontSize: 15 }}>
        {weakText ? <>這次{weakText}需要加強。</> : null}寬數週練每週寄一份{label}練習題本與家長解答，跟著學校進度，段考前把錯過的題型再練一輪。
      </p>
      <div className="paid-next-btns">
        <a className="btn btn-ink" href={`/?src=${src}#how`} data-track={`paid_weekly_${src}`}>看寬數週練</a>
        <a className="btn btn-paper" href={`/sample?src=${src}`} data-track={`paid_sample_${src}`}>先看試閱</a>
      </div>
      <p className="quiz-note">吳寬老師｜交大應數畢業｜現任國中數學教師</p>
      <p className="quiz-note">需要一對一家教？<a className="u" href={`/tutor?src=${src}`}>加入家教候補名單</a></p>
    </div>
  );
}
