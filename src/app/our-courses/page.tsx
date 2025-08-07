"use client";

import React, { useState } from "react";

const OurCoursesPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const cuteMoments = [
    {
      id: 1,
      title: "ยิ้มหวานๆ ตอนเช้า",
      description: "ช่วงเวลาที่สวยที่สุดของวัน",
      emoji: "😊",
      details: "ตอนตื่นนอนมาเจอรอยยิ้มหวานๆ ที่ทำให้วันใหม่เริ่มต้นด้วยความสุข",
      color: "from-pink-300 to-pink-500",
    },
    {
      id: 2,
      title: "หัวเราะกิ๊กเกอร์",
      description: "เสียงหัวเราะที่น่ารักที่สุด",
      emoji: "🤭",
      details: "เวลาหัวเราะแบบกิ๊กเกอร์ น่ารักมากจนใจละลาย",
      color: "from-purple-300 to-purple-500",
    },
    {
      id: 3,
      title: "โกรธงอแง",
      description: "แม้แต่ตอนโกรธก็ยังน่ารัก",
      emoji: "😤",
      details: "ใบหน้าบึ้งๆ แต่ก็ยังดูน่ารักไม่เสียหาย",
      color: "from-red-300 to-red-500",
    },
    {
      id: 4,
      title: "กิน eating show",
      description: "น่ารักที่สุดตอนกิน",
      emoji: "🍰",
      details: "ท่าทางตอนกิน การเคี้ยว ทุกอย่างน่ารักหมด",
      color: "from-orange-300 to-orange-500",
    },
    {
      id: 5,
      title: "งีบหลับ",
      description: "หน้าตาตอนนอนน่ารักมาก",
      emoji: "😴",
      details: "นอนหลับสนิท หน้าตาสงบ น่ารักที่สุดในโลก",
      color: "from-blue-300 to-blue-500",
    },
    {
      id: 6,
      title: "อายๆ บลัชแดง",
      description: "ตอนอายแก้มแดงๆ",
      emoji: "😳",
      details: "แก้มแดงๆ ตอนอาย น่ารักจนอยากหอม",
      color: "from-rose-300 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navigation Space */}
      <div className="pt-16 sm:pt-24"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4 sm:mb-6">
              ความน่ารักของหนู
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8">
              คอลเลกชันความน่ารักที่ไม่มีวันจบ 💕
            </p>
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-6">🥰</div>
          </div>

          {/* Cute Moments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {cuteMoments.map((moment) => (
              <div
                key={moment.id}
                onClick={() =>
                  setSelectedPhoto(
                    selectedPhoto === moment.id ? null : moment.id
                  )
                }
                className={`bg-gradient-to-br ${
                  moment.color
                } p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedPhoto === moment.id
                    ? "ring-4 ring-white scale-105"
                    : ""
                }`}
              >
                <div className="text-center text-white">
                  <div className="text-4xl sm:text-5xl mb-4">
                    {moment.emoji}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">
                    {moment.title}
                  </h3>
                  <p className="text-sm sm:text-base opacity-90 mb-4">
                    {moment.description}
                  </p>

                  {selectedPhoto === moment.id && (
                    <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                      <p className="text-sm sm:text-base leading-relaxed">
                        {moment.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Moment Display */}
          {selectedPhoto && (
            <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {cuteMoments.find((m) => m.id === selectedPhoto)?.title}
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                {cuteMoments.find((m) => m.id === selectedPhoto)?.details}
              </p>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transform transition hover:scale-105"
              >
                ปิด
              </button>
            </div>
          )}

          {/* Love Message */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                💖 ข้อความจากใจ 💖
              </h3>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                ทุกท่าทาง ทุกการกระทำของที่รักล้วนน่ารักในสายตาเค้า
                <br />
                ไม่ว่าจะเป็นตอนไหน
                ที่รักคือคนที่น่ารักที่สุดในโลกเค้ารักที่รักที่สุด
                ไม่อยากทำให้ผิดหวัง รักคนเดียวนะค้าบ ❤️
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 cursor-pointer text-lg sm:text-xl"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCoursesPage;
