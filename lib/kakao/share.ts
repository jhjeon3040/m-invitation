interface KakaoShareParams {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName?: string;
  slug: string;
}

interface KakaoSDK {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: {
      objectType: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: { mobileWebUrl: string; webUrl: string };
      };
      buttons: Array<{
        title: string;
        link: { mobileWebUrl: string; webUrl: string };
      }>;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

export function initKakao(): boolean {
  if (typeof window === "undefined") return false;

  if (!KAKAO_JS_KEY) {
    console.error("NEXT_PUBLIC_KAKAO_JS_KEY is not set");
    return false;
  }

  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY);
  }

  return window.Kakao?.isInitialized() ?? false;
}

export function shareToKakao(params: KakaoShareParams): boolean {
  if (typeof window === "undefined" || !window.Kakao?.Share) {
    return false;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yeonjeong.kr";
  const invitationUrl = `${baseUrl}/i/${params.slug}`;
  const ogImageUrl = `${baseUrl}/api/og/${params.slug}`;

  const weddingDateStr = new Date(params.weddingDate).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const descriptionParts = [weddingDateStr];
  if (params.weddingTime) descriptionParts.push(params.weddingTime);
  if (params.venueName) descriptionParts.push(params.venueName);

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: `${params.groomName} ♥ ${params.brideName} 결혼합니다`,
      description: descriptionParts.join(" | "),
      imageUrl: ogImageUrl,
      link: {
        mobileWebUrl: invitationUrl,
        webUrl: invitationUrl,
      },
    },
    buttons: [
      {
        title: "청첩장 보기",
        link: {
          mobileWebUrl: invitationUrl,
          webUrl: invitationUrl,
        },
      },
    ],
  });

  return true;
}
