import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLANC. - 당신의 러브 스토리, 아름다운 디지털 페이지로",
  description: "프리미엄 모바일 청첩장 서비스 블랑입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${playfair.variable} ${notoSansKr.variable} font-sans antialiased bg-[#FDF8F3] text-[#2C2520]`}
      >
        {children}
      </body>
    </html>
  );
}
