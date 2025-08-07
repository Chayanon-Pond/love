"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">
          ไม่พบหน้าที่คุณกำลังหา
        </h2>
        <p className="text-gray-500 mb-8">
          หน้าที่คุณพยายามเข้าถึงอาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่จริง
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
        >
          กลับหน้าหลัก 🏠
        </button>
      </div>
    </div>
  );
}
