import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { appUrl, SITE } from "./config";

export function ecpayConfig() {
  const merchantId = (process.env.ECPAY_MERCHANT_ID || "3002607").trim();
  const isStage = merchantId === "3002607" || process.env.ECPAY_STAGE === "1";
  return {
    merchantId,
    hashKey: (process.env.ECPAY_HASH_KEY || "pwFHCqoQZGmho4w6").trim(),
    hashIV: (process.env.ECPAY_HASH_IV || "EkRm7iFT261dpevs").trim(),
    checkoutUrl: isStage
      ? "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
      : "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5",
    isStage,
  };
}

export function merchantTradeNo() {
  const t = Date.now().toString(36).toUpperCase();
  const r = randomBytes(4).toString("hex").toUpperCase();
  return `K${t}${r}`.slice(0, 20);
}

function ecpayUrlEncode(raw: string) {
  return encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%2d/g, "-")
    .replace(/%5f/g, "_")
    .replace(/%2e/g, ".")
    .replace(/%21/g, "!")
    .replace(/%2a/g, "*")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%20/g, "+");
}

export function checkMacValue(params: Record<string, string>) {
  const { hashKey, hashIV } = ecpayConfig();
  const entries = Object.entries(params)
    .filter(([k, v]) => k !== "CheckMacValue" && v !== undefined && v !== "")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const raw = `HashKey=${hashKey}&${entries.map(([k, v]) => `${k}=${v}`).join("&")}&HashIV=${hashIV}`;
  return createHash("sha256").update(ecpayUrlEncode(raw)).digest("hex").toUpperCase();
}

export function macOk(params: Record<string, string>) {
  const got = (params.CheckMacValue || "").toUpperCase();
  const expect = checkMacValue(params);
  const a = Buffer.from(got);
  const b = Buffer.from(expect);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function taipeiTradeDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}/${g("month")}/${g("day")} ${g("hour")}:${g("minute")}:${g("second")}`;
}

export function checkoutFields(opts: {
  tradeNo: string;
  amount: number;
  plan: "monthly" | "yearly";
  childId: string;
}) {
  const { merchantId } = ecpayConfig();
  const base = appUrl();
  const item = opts.plan === "yearly" ? `${SITE.name} 年繳` : `${SITE.name} 月繳`;
  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: opts.tradeNo,
    MerchantTradeDate: taipeiTradeDate(),
    PaymentType: "aio",
    TotalAmount: String(opts.amount),
    TradeDesc: SITE.name,
    ItemName: item,
    ReturnURL: `${base}/api/ecpay/notify`,
    OrderResultURL: `${base}/api/ecpay/result`,
    ClientBackURL: `${base}/dashboard`,
    ChoosePayment: "ALL",
    EncryptType: "1",
    CustomField1: opts.childId,
  };
  params.CheckMacValue = checkMacValue(params);
  return params;
}
