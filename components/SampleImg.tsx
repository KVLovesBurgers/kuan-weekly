import { SAMPLE } from "@/lib/config";

type Props = {
  kind: "student" | "parent";
  alt: string;
  sizes?: string;
  eager?: boolean;
};

/** 試閱頁縮圖：依螢幕寬度挑 480／640／900 寬的 webp，手機不用下載整張大圖。 */
export function SampleImg({ kind, alt, sizes = "(max-width: 860px) calc(100vw - 64px), 520px", eager = false }: Props) {
  const base = kind === "student" ? SAMPLE.studentPreview : SAMPLE.parentPreview;
  const stem = base.replace(/\.webp$/, "");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={base}
      srcSet={`${stem}-480.webp 480w, ${stem}-640.webp 640w, ${base} 900w`}
      sizes={sizes}
      alt={alt}
      width={900}
      height={1273}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
