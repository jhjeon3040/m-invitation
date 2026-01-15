import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI 서비스가 설정되지 않았습니다" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { groomName, brideName, weddingDate, venueName, tone = "정중한" } = body as {
      groomName?: string;
      brideName?: string;
      weddingDate?: string;
      venueName?: string;
      tone?: "정중한" | "따뜻한" | "캐주얼" | "시적인";
    };

    if (!groomName || !brideName) {
      return NextResponse.json(
        { error: "신랑, 신부 이름이 필요합니다" },
        { status: 400 }
      );
    }

    const formattedDate = weddingDate
      ? new Date(weddingDate).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
      : "";

    const toneGuides: Record<string, string> = {
      정중한: "격식 있고 정중한 어조로, 전통적인 청첩장 문구처럼",
      따뜻한: "따뜻하고 감성적인 어조로, 친근하면서도 품격 있게",
      캐주얼: "친근하고 편안한 어조로, 젊은 감성으로",
      시적인: "시적이고 아름다운 표현으로, 문학적인 느낌으로",
    };
    const toneGuide = toneGuides[tone] || "정중하면서도 따뜻한 어조로";

    const prompt = `당신은 한국 결혼식 청첩장 문구 전문가입니다.
아래 정보를 바탕으로 ${toneGuide} 청첩장 초대글을 작성해주세요.

정보:
- 신랑: ${groomName}
- 신부: ${brideName}
${formattedDate ? `- 날짜: ${formattedDate}` : ""}
${venueName ? `- 장소: ${venueName}` : ""}

요구사항:
1. 150~250자 내외로 작성
2. 두 사람의 결혼을 알리고 축복을 부탁하는 내용
3. 한국어로 자연스럽게 작성
4. 이모지나 특수문자 사용하지 않기
5. 시작과 끝에 인사말 포함

초대글만 작성하고 다른 설명은 하지 마세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      throw new Error("AI 응답이 비어있습니다");
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("AI message generation failed:", error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "AI API 인증 오류" },
          { status: 503 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "초대글 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}
