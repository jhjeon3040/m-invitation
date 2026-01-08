import { ImageResponse } from "@vercel/og";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      gallery: {
        where: { isCover: true },
        take: 1,
      },
    },
  });

  if (!invitation) {
    return new Response("Not found", { status: 404 });
  }

  const coverImage = invitation.gallery[0]?.url;
  const weddingDate = invitation.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "800px",
          height: "400px",
          display: "flex",
          background: "linear-gradient(135deg, #FFF0F3 0%, #FFFFFF 50%, #E8F4EF 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "300px",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt=""
              style={{
                width: "236px",
                height: "336px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "236px",
                height: "336px",
                background: "linear-gradient(180deg, #FFF0F3 0%, #E8F4EF 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
              }}
            >
              💍
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 40px 40px 0",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "#3D3632",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {invitation.groomName}
            <span
              style={{
                color: "#FF8E76",
                margin: "0 16px",
                fontSize: "36px",
              }}
            >
              ♥
            </span>
            {invitation.brideName}
          </div>

          {weddingDate && (
            <div
              style={{
                fontSize: "20px",
                color: "#6B5E5E",
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "8px" }}>📅</span>
              {weddingDate}
              {invitation.weddingTime && ` ${invitation.weddingTime}`}
            </div>
          )}

          {invitation.venueName && (
            <div
              style={{
                fontSize: "18px",
                color: "#8B7E7E",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "8px" }}>📍</span>
              {invitation.venueName}
            </div>
          )}

          <div
            style={{
              marginTop: "auto",
              paddingTop: "32px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "#FF8E76",
                fontWeight: "600",
              }}
            >
              연정
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#A69999",
                marginLeft: "8px",
              }}
            >
              사랑의 시작을 담다
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
