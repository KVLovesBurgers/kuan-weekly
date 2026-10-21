import { SAMPLE } from "@/lib/config";

type Props = {
  kind: "student" | "parent";
  alt: string;
  sizes?: string;
  eager?: boolean;
  pack?: "jh" | "gsat";
};

/** 試閱頁縮圖：優先 AVIF（比 webp 小約 30%），不支援時用 webp；依螢幕寬度挑 480／640／900 寬，手機不用下載整張大圖。 */
export function SampleImg({ kind, alt, sizes = "(max-width: 860px) calc(100vw - 64px), 520px", eager = false, pack = "jh" }: Props) {
  const base =
    pack === "gsat"
      ? `/samples/gsat-${kind}-preview.webp`
      : kind === "student"
        ? SAMPLE.studentPreview
        : SAMPLE.parentPreview;
  const stem = base.replace(/\.webp$/, "");
  return (
    <picture>
      <source type="image/avif" srcSet={`${stem}-480.avif 480w, ${stem}-640.avif 640w, ${stem}.avif 900w`} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
      src={base}
      srcSet={`${stem}-480.webp 480w, ${stem}-640.webp 640w, ${base} 900w`}
      sizes={sizes}
      alt={alt}
      width={900}
      height={1273}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
    />
    </picture>
  );
}
