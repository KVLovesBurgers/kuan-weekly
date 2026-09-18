import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1419",
          borderRadius: 14,
        }}
      >
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="22" stroke="#c8d0da" strokeWidth="1.5" />
          <path d="M8 32h48M32 8v48" stroke="#c8d0da" strokeWidth="0.9" opacity="0.45" />
          <path d="M32 32 L50.5 32 A18.5 18.5 0 0 0 32 13.5" stroke="#8a9bb0" strokeWidth="1.8" />
          <circle cx="50.5" cy="32" r="2.2" fill="#e8eef4" />
          <circle cx="32" cy="32" r="1.8" fill="#e8eef4" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
