import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_KR, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  weight: ["400", "700", "800"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "연정 - 사랑의 시작을 담다",
  description: "당신의 사랑 이야기를 가장 아름답게 전하는 프리미엄 모바일 청첩장. AI 초대글 작성, 시네마틱 경험, 하객 인사이트까지.",
  keywords: ["모바일 청첩장", "디지털 청첩장", "웨딩 초대장", "연정", "프리미엄 청첩장"],
  openGraph: {
    title: "연정 - 사랑의 시작을 담다",
    description: "당신의 사랑 이야기를 가장 아름답게 전하는 프리미엄 모바일 청첩장",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${playfair.variable} ${nanumMyeongjo.variable} ${notoSansKr.variable} font-sans antialiased bg-white text-brown-900`}
      >
        {children}
      </body>
    </html>
  );
}
