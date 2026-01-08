import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "./DashboardHeader";
import { EmptyState } from "./EmptyState";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const userName =
    authUser.user_metadata?.name ||
    authUser.user_metadata?.full_name ||
    authUser.email?.split("@")[0] ||
    "사용자";

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  const invitations = user
    ? await prisma.invitation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { rsvpResponses: true, guestbookEntries: true } },
        },
      })
    : [];

  const hasInvitations = invitations.length > 0;

  return (
    <div className="min-h-screen bg-cream-bg">
      <DashboardHeader userName={userName} avatarUrl={authUser.user_metadata?.avatar_url} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display text-brown-900">내 청첩장</h1>
            <p className="text-gray-500 text-sm mt-1">
              {hasInvitations
                ? `${invitations.length}개의 청첩장이 있어요`
                : "아직 청첩장이 없어요. 지금 만들어보세요!"}
            </p>
          </div>
          <Link
            href="/editor/new"
            className="px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors shadow-md hover:shadow-lg"
          >
            + 새 청첩장 만들기
          </Link>
        </div>

        {hasInvitations ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      inv.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {inv.status === "PUBLISHED" ? "발행됨" : "초안"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(inv.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <h3 className="text-lg font-display text-brown-900 mb-1">
                  {inv.brideName} <span className="text-coral-400">♥</span> {inv.groomName}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {inv.weddingDate
                    ? new Date(inv.weddingDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "날짜 미정"}
                </p>

                <div className="flex gap-2 text-xs text-gray-500 mb-4">
                  <span>RSVP {inv._count.rsvpResponses}명</span>
                  <span>·</span>
                  <span>방명록 {inv._count.guestbookEntries}개</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/editor/${inv.id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-coral-600 bg-coral-50 rounded-lg hover:bg-coral-100 transition-colors"
                  >
                    편집
                  </Link>
                  <Link
                    href={`/i/${inv.slug}`}
                    target="_blank"
                    className="flex-1 py-2 text-center text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
