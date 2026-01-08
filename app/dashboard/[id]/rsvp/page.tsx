"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface RsvpResponse {
  id: string;
  name: string;
  phone: string | null;
  attending: boolean;
  mealCount: number;
  side: "GROOM" | "BRIDE";
  createdAt: string;
}

interface Summary {
  total: number;
  attending: number;
  notAttending: number;
  mealCount: number;
  groomSide: number;
  brideSide: number;
}

export default function RsvpManagementPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const [responses, setResponses] = useState<RsvpResponse[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "attending" | "notAttending">("all");
  const [sideFilter, setSideFilter] = useState<"all" | "GROOM" | "BRIDE">("all");

  useEffect(() => {
    loadRsvpData();
  }, [invitationId]);

  async function loadRsvpData() {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/rsvp`);
      if (response.ok) {
        const { data } = await response.json();
        setResponses(data.responses);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to load RSVP data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredResponses = responses.filter((r) => {
    if (filter === "attending" && !r.attending) return false;
    if (filter === "notAttending" && r.attending) return false;
    if (sideFilter !== "all" && r.side !== sideFilter) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleExportCSV = () => {
    const headers = ["이름", "참석", "식사인원", "측", "연락처", "응답일시"];
    const rows = filteredResponses.map((r) => [
      r.name,
      r.attending ? "참석" : "불참",
      r.mealCount,
      r.side === "GROOM" ? "신랑측" : "신부측",
      r.phone || "-",
      new Date(r.createdAt).toLocaleString("ko-KR"),
    ]);
    
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-coral-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-bg">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-brown-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">대시보드</span>
          </Link>
          <h1 className="font-display text-brown-900">RSVP 관리</h1>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            CSV 다운로드
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-brown-900">{summary.total}</p>
              <p className="text-sm text-gray-500">전체 응답</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{summary.attending}</p>
              <p className="text-sm text-gray-500">참석</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{summary.notAttending}</p>
              <p className="text-sm text-gray-500">불참</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-coral-500">{summary.mealCount}</p>
              <p className="text-sm text-gray-500">식사 인원</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">전체</option>
            <option value="attending">참석</option>
            <option value="notAttending">불참</option>
          </select>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value as typeof sideFilter)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">전체 측</option>
            <option value="GROOM">신랑측</option>
            <option value="BRIDE">신부측</option>
          </select>
          <span className="ml-auto text-sm text-gray-500 self-center">
            {filteredResponses.length}명
          </span>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            아직 응답이 없습니다
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">이름</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">참석</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">식사</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">측</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">연락처</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">응답일</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 font-medium text-brown-900">{r.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          r.attending
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {r.attending ? "참석" : "불참"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {r.attending ? `${r.mealCount}명` : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs ${
                          r.side === "GROOM" ? "text-blue-600" : "text-pink-600"
                        }`}>
                          {r.side === "GROOM" ? "신랑" : "신부"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.phone || "-"}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {summary && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-blue-700">{summary.groomSide}</p>
              <p className="text-sm text-blue-600">신랑측</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-pink-700">{summary.brideSide}</p>
              <p className="text-sm text-pink-600">신부측</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
