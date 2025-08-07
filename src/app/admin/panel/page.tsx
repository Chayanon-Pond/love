"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface ProposalData {
  id: number;
  question: string;
  answer: string | null;
  answered_at: string | null;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, logout } = useAdminAuth();
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<'reset' | 'delete' | null>(null);

  // ถ้ายังไม่ login ให้ redirect ไป login page
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    if (isAuthenticated) {
      loadProposals();
    }
  }, [isAuthenticated]);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading proposals:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        return;
      }

      setProposals(data || []);
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  // รีเซ็ตการตอบ (เปลี่ยน answer กลับเป็น null)
  const resetAnswer = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("proposals")
        .update({
          answer: null,
          answered_at: null,
        })
        .eq("id", id);

      if (error) {
        console.error("Error resetting answer:", error);
        alert("เกิดข้อผิดพลาดในการรีเซ็ต");
        return;
      }

      alert("รีเซ็ตสำเร็จ!");
      loadProposals(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(null);
    }
  };

  // ลบข้อมูล
  const deleteProposal = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting proposal:", error);
        alert("เกิดข้อผิดพลาดในการลบ");
        return;
      }

      alert("ลบสำเร็จ!");
      loadProposals(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(null);
    }
  };

  // รีเซ็ตทั้งหมด
  const resetAllProposals = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .neq('id', 0); // ลบทั้งหมด

      if (error) {
        console.error("Error resetting all:", error);
        alert("เกิดข้อผิดพลาดในการรีเซ็ตทั้งหมด");
        return;
      }

      alert("รีเซ็ตทั้งหมดสำเร็จ!");
      loadProposals(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(null);
    }
  };

  const getStatusColor = (answer: string | null) => {
    if (!answer) return "bg-yellow-100 text-yellow-800";
    switch (answer) {
      case "ตกลง": return "bg-green-100 text-green-800";
      case "ขอคิดก่อน": return "bg-orange-100 text-orange-800";
      case "ไม่ตกลง": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (answer: string | null) => {
    if (!answer) return "⏳";
    switch (answer) {
      case "ตกลง": return "💚";
      case "ขอคิดก่อน": return "🤔";
      case "ไม่ตกลง": return "💔";
      default: return "❓";
    }
  };

  // แสดง loading ขณะตรวจสอบ authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-xl text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่ login ให้แสดงหน้าว่าง (จะ redirect อยู่แล้ว)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Space */}
      <div className="pt-16 sm:pt-24"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Admin Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👨‍💼</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    ยินดีต้อนรับ, {user?.username}
                  </h2>
                  <p className="text-sm text-gray-600">Admin Panel - จัดการระบบ</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              🔧 Admin Panel 🔧
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              จัดการข้อมูลการขอเป็นแฟน
            </p>
            <div className="text-4xl sm:text-5xl mb-6">⚙️</div>
          </div>

          {/* Control Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={loadProposals}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 disabled:opacity-50"
              >
                🔄 รีเฟรชข้อมูล
              </button>
              
              <button
                onClick={() => setShowConfirmDialog('reset')}
                disabled={isLoading || proposals.length === 0}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 disabled:opacity-50"
              >
                🗑️ รีเซ็ตทั้งหมด
              </button>

              <button
                onClick={() => router.push('/proposal')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
              >
                💕 ไปหน้าขอเป็นแฟน
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-lg text-gray-600">กำลังโหลด...</p>
            </div>
          )}

          {/* Proposals List */}
          {!isLoading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📋 รายการการขอเป็นแฟน (ทั้งหมด {proposals.length} รายการ)
              </h2>

              {proposals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-xl text-gray-500">ยังไม่มีข้อมูลการขอเป็นแฟน</p>
                  <p className="text-gray-400 mt-2">ลองสร้างข้อมูลใหม่ในหน้าขอเป็นแฟน</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Proposal Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getStatusIcon(proposal.answer)}</span>
                            <h3 className="text-lg font-semibold text-gray-800">
                              #{proposal.id} {proposal.question}
                            </h3>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.answer)}`}>
                              {proposal.answer ? `ตอบ: ${proposal.answer}` : 'รอการตอบ'}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 space-y-1">
                            <p>📅 สร้างเมื่อ: {new Date(proposal.created_at).toLocaleString('th-TH')}</p>
                            {proposal.answered_at && (
                              <p>✅ ตอบเมื่อ: {new Date(proposal.answered_at).toLocaleString('th-TH')}</p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {proposal.answer && (
                            <button
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowConfirmDialog('reset');
                              }}
                              disabled={isLoading}
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow transition hover:scale-105 disabled:opacity-50 text-sm"
                            >
                              🔄 รีเซ็ตคำตอบ
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setShowConfirmDialog('delete');
                            }}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow transition hover:scale-105 disabled:opacity-50 text-sm"
                          >
                            🗑️ ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Confirm Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {showConfirmDialog === 'reset' ? '⚠️' : '🗑️'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {showConfirmDialog === 'reset' 
                      ? (selectedProposal ? 'รีเซ็ตคำตอบ' : 'รีเซ็ตทั้งหมด')
                      : 'ลบข้อมูล'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {showConfirmDialog === 'reset' 
                      ? (selectedProposal 
                          ? `ต้องการรีเซ็ตคำตอบของ "${selectedProposal.question}" หรือไม่?`
                          : 'ต้องการลบข้อมูลทั้งหมดหรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้!'
                        )
                      : `ต้องการลบ "${selectedProposal?.question}" หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้!`
                    }
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowConfirmDialog(null);
                        setSelectedProposal(null);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => {
                        if (showConfirmDialog === 'reset') {
                          if (selectedProposal) {
                            resetAnswer(selectedProposal.id);
                          } else {
                            resetAllProposals();
                          }
                        } else if (selectedProposal) {
                          deleteProposal(selectedProposal.id);
                        }
                      }}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                      {showConfirmDialog === 'reset' ? 'รีเซ็ต' : 'ลบ'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
            >
              🏠 กลับหน้าหลัก
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
