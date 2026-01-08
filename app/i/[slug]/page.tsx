import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { InvitationView } from "./InvitationView";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yeonjeong.kr";

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      groomName: true,
      brideName: true,
      weddingDate: true,
      weddingTime: true,
      venueName: true,
    },
  });

  if (!invitation) {
    return { title: "청첩장을 찾을 수 없습니다" };
  }

  const title = `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`;
  const weddingDateStr = invitation.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const description = [weddingDateStr, invitation.weddingTime, invitation.venueName]
    .filter(Boolean)
    .join(" | ");

  const ogImageUrl = `${baseUrl}/api/og/${slug}`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/i/${slug}`,
      siteName: "연정",
      locale: "ko_KR",
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 400,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

async function getInvitation(slug: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      gallery: {
        orderBy: { order: "asc" },
      },
      rsvpResponses: {
        orderBy: { createdAt: "desc" },
      },
      guestbookEntries: {
        where: { isHidden: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!invitation) return null;

  const coverImage = invitation.gallery.find((img) => img.isCover)?.url;

  return {
    id: invitation.id,
    slug: invitation.slug || "",
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    groomFather: invitation.groomFather ?? undefined,
    groomMother: invitation.groomMother ?? undefined,
    brideFather: invitation.brideFather ?? undefined,
    brideMother: invitation.brideMother ?? undefined,
    weddingDate: invitation.weddingDate
      ? invitation.weddingDate.toISOString().split("T")[0]
      : "",
    weddingTime: invitation.weddingTime || "",
    venueName: invitation.venueName || "",
    venueAddress: invitation.venueAddress || "",
    venueFloor: invitation.venueFloor ?? undefined,
    venueLat: invitation.venueLat ?? undefined,
    venueLng: invitation.venueLng ?? undefined,
    message: invitation.invitationMsg || "",
    theme: invitation.theme,
    rsvpEnabled: (invitation.settings as { rsvp?: { enabled?: boolean } })?.rsvp?.enabled ?? true,
    guestbookEnabled: (invitation.settings as { guestbook?: { enabled?: boolean } })?.guestbook?.enabled ?? true,
    coverImage: coverImage || "",
    gallery: invitation.gallery.map((img) => img.url),
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);

  if (!invitation) {
    notFound();
  }

  return <InvitationView invitation={invitation} />;
}
