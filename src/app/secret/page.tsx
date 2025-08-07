"use client";

import React, { useState } from "react";

const SecretPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    // คุณสามารถเพิ่ม logic อื่นๆ ตรงนี้ เช่น เปิด modal หรือนำทางไปหน้าอื่น
    console.log(`คลิกที่ ${cardType}`);
  };

  const cards = [
    {
      id: "memories",
      emoji: "🌸",
      title: "ความทรงจำ",
      description: "ความทรงจำดีๆ",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      details:
        "วันแรกที่ที่รักเริ่มชอบเค้ามาจาก วันที่เค้ากลับจากเขาใหญ่และได้ช่วยเค้าคิดเมนูข้าวผัดกุ้งบวกกับเฝ้าเค้าขับรถกลับบ้าน ที่รักได้คอยทำกับข้าวและก็ให้ของอยู่ตลอดเวลาเค้าเกรงใจที่รักมากนะค้าบ แต่ขอบคุณค้าบ วันเกิดก็มีของขวัญให้เค้าซึ่งแพงมากแบบเค้าร้องไห้ดีใจที่วันเกิดมีที่รัก ที่รักให้ให้นาฬิกาเค้า กางเกงลายหมูกับเป็ด แก้วน้ำ การ์ดจดหมาย ขนมอีกต่างหาก ซึ่งก่อนหน้านั้นก็มีเสื้อให้เค้าอีกน่ารักไปแล้ว💕",
    },
    {
      id: "love",
      emoji: "💜",
      title: "ความรัก",
      description: "ความรักที่มีให้กันและกัน",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      details:
        "ความรักที่เติบโตขึ้นทุกวัน และความผูกพันที่แน่นแฟ้น เค้ารักที่รักแบบมากๆเลยในทุกๆวัน ไม่มีวันไหนที่เค้าไม่รักที่รักเลยแล้วรักที่รักคนเดียวไม่มีใครอื่น จะซื่อตรงต่อที่รัก ไม่วอกแวกทำอะไรก็จะบอกอยู่ตลอดเวลา",
    },
    {
      id: "future",
      emoji: "🌟",
      title: "อนาคต",
      description: "ความฝันและแผนการในอนาคต",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      details:
        "ก็จะเป็นแฟนที่ดีให้กับที่รักตลอดไป จะดูแลที่รักให้ดีที่สุด จะไม่ทำให้ที่รักเสียใจ จะอยู่เคียงข้างกันเสมอในวันที่ศุกร์และทุกจะมีเค้าคอยเชียอัพ คอยซัพพอต เค้าจะเดินข้างที่รักอยู่เสมอ จะไปเที่ยวทุกที่ที่มีที่รักและจะทำให้ที่รักมีความสุขที่สุดในโลก เค้าจะเป็นแฟนที่ดีที่สุดของที่รัก",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Mobile Optimized Padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header - Mobile Responsive */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4 sm:mb-6">
              Secret Page
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 px-2">
              ยินดีต้อนรับสู่หน้าลับ ✨
            </p>
          </div>

          {/* Content Card - Mobile Responsive */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-6 sm:mb-8">
            <div className="mb-6 sm:mb-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">
                💕
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-3 sm:mb-4">
                พื้นที่พิเศษของเรา
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
                นี่คือหน้าลับที่มีเฉพาะคนพิเศษเท่านั้นที่จะเข้าถึงได้
                เต็มไปด้วยความทรงจำและความรักที่มีให้กัน
              </p>
            </div>

            {/* Interactive Cards - Mobile First Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.title)}
                  className={`p-4 sm:p-6 ${card.bgColor} ${
                    card.hoverColor
                  } rounded-xl sm:rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedCard === card.title
                      ? "ring-2 ring-purple-400 scale-105"
                      : ""
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                    {card.emoji}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">
                    {card.description}
                  </p>
                  {selectedCard === card.title && (
                    <div className="mt-3 p-3 bg-white/50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {card.details}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Card Display - Mobile Responsive */}
            {selectedCard && (
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl border border-purple-200">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-2 sm:mb-3">
                  คุณเลือก: {selectedCard}
                </h3>
                <p className="text-sm sm:text-base text-purple-700">
                  {cards.find((card) => card.title === selectedCard)?.details}
                </p>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="mt-3 sm:mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
                >
                  ปิด
                </button>
              </div>
            )}

            {/* Special Proposal Button */}
            <div className="mt-8 sm:mt-10 p-6 sm:p-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl sm:rounded-2xl border-2 border-red-200">
              <div className="text-4xl sm:text-5xl mb-4">💖</div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-3">
                คำถามพิเศษจากใจ
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                ฉันมีสิ่งสำคัญที่อยากจะถามเธอ...
              </p>
              <button
                onClick={() => (window.location.href = "/proposal")}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg transform transition hover:scale-105 text-sm sm:text-base cursor-pointer"
              >
                คำถามพิเศษ 💕
              </button>
            </div>
          </div>

          {/* Back Button - Mobile Responsive */}
          <div className="mt-6 sm:mt-8 space-y-4">
            <div>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transform transition hover:scale-105 cursor-pointer text-sm sm:text-base"
              >
                กลับหน้าหลัก
              </button>
            </div>

            {/* Admin Panel Link */}
            <div>
              <button
                onClick={() => (window.location.href = "/admin/login")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transform transition hover:scale-105 cursor-pointer text-sm sm:text-base"
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

export default SecretPage;
