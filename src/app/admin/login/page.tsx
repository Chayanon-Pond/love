"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    console.log("🎯 handleLogin called!", e);
    e.preventDefault();

    console.log("🚀 Starting login process...");
    console.log("Username:", credentials.username);
    console.log("Password length:", credentials.password.length);

    if (!credentials.username || !credentials.password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔍 Checking credentials...");

      // ตรวจสอบ username และ password (สำหรับ demo ใช้ hardcode)
      if (
        credentials.username !== "admin" ||
        credentials.password !== "admin123"
      ) {
        console.log("❌ Invalid credentials");
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        setIsLoading(false);
        return;
      }

      console.log("✅ Credentials valid");

      // สร้าง session token
      const token = generateToken();
      console.log("🎫 Generated token:", token.substring(0, 10) + "...");

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 ชั่วโมง
      console.log("⏰ Token expires at:", expiresAt);

      // ลองหา admin user หรือสร้างใหม่
      let adminUserId = null;

      console.log("👤 Checking for existing admin user...");

      // ตรวจสอบว่ามี admin user อยู่หรือไม่
      const { data: existingUser, error: findError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("username", "admin")
        .single();

      console.log("Find user result:", { existingUser, findError });

      if (existingUser) {
        adminUserId = existingUser.id;
        console.log("✅ Found existing user:", adminUserId);
      } else {
        console.log("⚠️ No existing user, creating new one...");
        // สร้าง admin user ใหม่ถ้าไม่มี
        const { data: newUser, error: createError } = await supabase
          .from("admin_users")
          .insert({
            username: "admin",
            password_hash: "demo_hash", // placeholder
            is_active: true,
          })
          .select("id")
          .single();

        console.log("Create user result:", { newUser, createError });

        if (createError) {
          console.error("❌ Create user error:", createError);
          // ใช้ hardcode id สำหรับ demo
          adminUserId = "demo-admin-id";
          console.log("🔧 Using fallback admin ID:", adminUserId);
        } else {
          adminUserId = newUser.id;
          console.log("✅ Created new user:", adminUserId);
        }
      }

      console.log("💾 Saving session...");

      // บันทึก session
      const { error: sessionError } = await supabase
        .from("admin_sessions")
        .insert({
          admin_user_id: adminUserId,
          token: token,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        });

      console.log("Session save result:", { sessionError });

      if (sessionError) {
        console.error("⚠️ Session error:", sessionError);
        // ถ้า session ไม่สามารถบันทึกได้ ยังคง login ได้
        console.warn("🔄 Continue without database session");
      }

      // เก็บ token ใน localStorage
      const userData = {
        id: adminUserId,
        username: "admin",
      };

      console.log("📝 Saving to localStorage...");
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(userData));

      console.log("✅ Saved to localStorage:", {
        token: token.substring(0, 10) + "...",
        user: userData,
      });

      alert("เข้าสู่ระบบสำเร็จ!");
      console.log("🎉 Login successful! Redirecting...");

      // redirect ไป admin panel
      console.log("🔄 Redirecting to /admin/panel...");
      setTimeout(() => {
        console.log("🚀 Executing redirect...");
        window.location.href = "/admin/panel";
      }, 1000); // เพิ่มเวลารอเป็น 1 วินาที
    } catch (error) {
      console.error("💥 Login error:", error);
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ: " + error);
    } finally {
      console.log("🏁 Login process finished");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation Space */}
      <div className="pt-16 sm:pt-24"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6">
              🔐 Admin Login
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6">
              เข้าสู่ระบบจัดการ
            </p>
            <div className="text-4xl sm:text-5xl mb-6">🛡️</div>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  👤 ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="กรอกชื่อผู้ใช้"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  🔑 รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12"
                    placeholder="กรอกรหัสผ่าน"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={(e) => {
                  console.log("🔥 Button clicked!", e);
                  console.log("🔥 Form values:", credentials);
                }}
                disabled={
                  isLoading || !credentials.username || !credentials.password
                }
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 ${
                  isLoading || !credentials.username || !credentials.password
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  "🚀 เข้าสู่ระบบ"
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <p className="text-sm text-yellow-200 text-center">
                <strong>🧪 Demo Account:</strong>
                <br />
                Username:{" "}
                <code className="bg-black/30 px-2 py-1 rounded">ไม่บอก</code>
                <br />
                Password:{" "}
                <code className="bg-black/30 px-2 py-1 rounded">ไม่บอก</code>
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105"
            >
              🏠 กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
