"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ProposalData {
  id?: number;
  question: string;
  answer: string | null;
  answered_at: string | null;
  created_at: string;
}

const ProposalPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    "question" | "waiting" | "answered"
  >("question");
  const [answer, setAnswer] = useState<string>("");
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("/music/oneday.mp3"); // ใช้ไฟล์จริงของคุณ
  const audioRef = useRef<HTMLAudioElement>(null);

  // ตรวจสอบว่ามีการขอเป็นแฟนแล้วหรือยัง
  useEffect(() => {
    checkExistingProposal();
    // เล่นเพลงอัตโนมัติเมื่อเข้าหน้า
    const timer = setTimeout(() => {
      playMusic();
    }, 500); // รอ 500ms เพื่อให้โหลดสมบูรณ์
    
    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันสำหรับเล่นเพลงเมื่อมีการ interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isPlaying && audioRef.current) {
        playMusic();
      }
    };

    // เพิ่ม event listeners สำหรับ user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isPlaying]);

  // เล่นเพลง
  const playMusic = async () => {
    if (audioRef.current) {
      try {
        // ตั้งค่า volume ก่อนเล่น
        audioRef.current.volume = 0.7;
        audioRef.current.muted = false;
        
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Auto-play prevented:", error);
        // บางเบราว์เซอร์จะบล็อค auto-play
        // จะเล่นได้เมื่อมี user interaction
      }
    }
  };

  // หยุด/เล่นเพลง
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // เปลี่ยนเพลง
  const changeSong = (songPath: string) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = songPath;
      setCurrentSong(songPath);
      
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const checkExistingProposal = async () => {
    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error checking proposal:", error);
        return;
      }

      if (data && data.length > 0) {
        const latest = data[0];
        setProposalData(latest);

        if (latest.answer) {
          setCurrentStep("answered");
          setAnswer(latest.answer);
        } else {
          setCurrentStep("waiting");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendProposal = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("proposals")
        .insert([
          {
            question: "จะเป็นแฟนฉันไหม? 💕",
            answer: null,
            answered_at: null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sending proposal:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      setProposalData(data);
      setCurrentStep("waiting");
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (selectedAnswer: string) => {
    if (!proposalData?.id) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("proposals")
        .update({
          answer: selectedAnswer,
          answered_at: new Date().toISOString(),
        })
        .eq("id", proposalData.id);

      if (error) {
        console.error("Error updating proposal:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      setAnswer(selectedAnswer);
      setCurrentStep("answered");
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-100">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        autoPlay
        muted={false}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedData={() => {
          // เมื่อโหลดเสร็จแล้วให้พยายามเล่น
          if (audioRef.current) {
            playMusic();
          }
        }}
      >
        <source src={currentSong} type="audio/mpeg" />
        เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง
      </audio>

      {/* Music Control Panel */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs text-gray-600 font-medium">🎵 เพลงประกอบ</div>

          {/* Play/Pause Button */}
          <button
            onClick={toggleMusic}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full p-3 shadow-lg transform transition hover:scale-105"
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>

          {/* Song Selection */}
          <div className="flex flex-col space-y-1">
            <select
              value={currentSong}
              onChange={(e) => changeSong(e.target.value)}
              className="text-xs bg-white/80 border border-pink-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="/music/oneday.mp3">🎵 One Day</option>
            </select>
          </div>

          {/* Volume Control */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.volume = parseFloat(e.target.value);
              }
            }}
            className="w-16 h-1 bg-pink-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-500">🔊</div>
        </div>
      </div>

      {/* Navigation Space */}
      <div className="pt-16 sm:pt-24"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-4 sm:mb-6">
              💖 คำถามพิเศษ 💖
            </h1>
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6">💕</div>
          </div>

          {/* Question Step */}
          {currentStep === "question" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                  ฉันมีคำถามพิเศษที่อยากจะถาม...
                </h2>
                <div className="text-5xl sm:text-6xl mb-6">💝</div>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  ฉันอยากถามสิ่งหนึ่งที่สำคัญมากๆ กับฉัน
                  <br />
                  คำตอบของเธอจะเปลี่ยนชีวิตของเราทั้งคู่...
                </p>
              </div>

              <button
                onClick={sendProposal}
                disabled={isLoading}
                className={`bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg sm:text-xl py-4 px-8 sm:px-12 rounded-full shadow-xl transform transition duration-300 hover:scale-105 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "กำลังส่ง..." : "ถามคำถามพิเศษ 💕"}
              </button>
            </div>
          )}

          {/* Waiting Step */}
          {currentStep === "waiting" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-6">
                  เป็นแฟนกับเค้าไหม?
                </h2>
                <div className="text-6xl sm:text-7xl mb-8 animate-bounce">
                  💖
                </div>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                  เรารู้จักกันมาจะ 3 เดือนกว่าแล้ว
                  <br />
                  เค้าอยากบอกที่รักว่า
                  <br />
                  ฉันรักที่รักจริงๆ นะ... 💕
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-800 mb-6">
                  ที่รักคิดว่าไงค้าบ? 🥺
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => submitAnswer("ตกลง")}
                    disabled={isLoading}
                    className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    ตกลง 💚
                  </button>

                  <button
                    onClick={() => submitAnswer("ขอคิดก่อน")}
                    disabled={isLoading}
                    className={`bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    ขอคิดก่อน 🤔
                  </button>

                  <button
                    onClick={() => submitAnswer("ไม่ตกลง")}
                    disabled={isLoading}
                    className={`bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    ไม่ตกลง 💔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Answered Step */}
          {currentStep === "answered" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
              <div className="mb-8">
                {answer === "ตกลง" && (
                  <>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-6">
                      เย้ๆๆๆ! 🎉
                    </h2>
                    <div className="text-6xl sm:text-7xl mb-6">🥳💕✨</div>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                      ขอบคุณมากนะค้าบ เค้ามีความสุขมากๆ เลย
                      <br />
                      ตอนนี้เราเป็นแฟนกันแล้ว! 💖
                      <br />
                      เค้าจะรักและดูแลที่รักดีๆ
                      นะค้าบจะซื่อสัตย์และรักที่รักคนเดียวตลอดไป
                    </p>
                  </>
                )}

                {answer === "ขอคิดก่อน" && (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-6">
                      ไม่เป็นไรนะ 😊
                    </h2>
                    <div className="text-6xl sm:text-7xl mb-6">🤗💛</div>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                      เค้าเข้าใจ เอาเวลาคิดดีๆ นะ
                      <br />
                      ไม่ต้องรีบตอบ เค้าจะรออยู่
                      <br />
                      ยังไงเค้าก็ยังรักที่รักอยู่นะ 💕
                    </p>
                  </>
                )}

                {answer === "ไม่ตกลง" && (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-6">
                      เศร้า แต่เข้าใจ 😢
                    </h2>
                    <div className="text-6xl sm:text-7xl mb-6">💔😭</div>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                      แม้จะเศร้า แต่ฉันเข้าใจนะ
                      <br />
                      ขอบคุณที่ซื่อสัตย์กับฉัน
                      <br />
                      🥺
                    </p>
                  </>
                )}
              </div>

              {proposalData && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    ถูกบันทึกเมื่อ:{" "}
                    {new Date(proposalData.created_at).toLocaleString("th-TH")}
                  </p>
                  {proposalData.answered_at && (
                    <p className="text-sm text-gray-600">
                      ตอบเมื่อ:{" "}
                      {new Date(proposalData.answered_at).toLocaleString(
                        "th-TH"
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 sm:mt-12 space-y-4 text-center">
            <div>
              <button
                onClick={() => (window.location.href = "/secret")}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
              >
                กลับหน้าลับ
              </button>
            </div>

            {/* Admin Panel Link */}
            <div>
              <button
                onClick={() => (window.location.href = "/admin/login")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 text-sm"
              >
                🔧 Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;
