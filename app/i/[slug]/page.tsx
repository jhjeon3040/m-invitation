import { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationView } from "./InvitationView";

const MOCK_INVITATION = {
  id: "1",
  slug: "minyoung-jihoon",
  groomName: "지훈",
  brideName: "민영",
  groomFather: "김철수",
  groomMother: "이영희",
  brideFather: "박준혁",
  brideMother: "최수정",
  weddingDate: "2025-05-16",
  weddingTime: "14:00",
  venueName: "더채플앳청담",
  venueAddress: "서울 강남구 선릉로 158길 11",
  venueFloor: "3층 그랜드홀",
  venueLat: 37.524,
  venueLng: 127.049,
  message: `서로에게 스며든 두 사람이
사랑으로 하나 되려 합니다.

바쁘시더라도 귀한 걸음 하시어
축복해 주시면 감사하겠습니다.`,
  theme: "romantic-pink",
  rsvpEnabled: true,
  guestbookEnabled: true,
  coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=600",
  ],
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = slug === "minyoung-jihoon" ? MOCK_INVITATION : null;

  if (!invitation) {
    return { title: "청첩장을 찾을 수 없습니다" };
  }

  const title = `${invitation.brideName} ♥ ${invitation.groomName} 결혼합니다`;
  const description = `${invitation.weddingDate} ${invitation.weddingTime} ${invitation.venueName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [invitation.coverImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [invitation.coverImage],
    },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const invitation = slug === "minyoung-jihoon" ? MOCK_INVITATION : null;

  if (!invitation) {
    notFound();
  }

  return <InvitationView invitation={invitation} />;
}
