"use client";

import React from "react";
import Footer from "@/components/footer";

function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {/* Main content goes here */}
          <h1 className="text-3xl font-bold text-center mt-10">
            Welcome to CourseFlow
          </h1>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
