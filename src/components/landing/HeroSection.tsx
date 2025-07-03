import React from "react";
import Image from "next/image";
import { ButtonT } from "../ui/ButtonT";

function HeroSection() {
  return (
    <section className="relative bg-[#EAF1FF] w-full max-h-[700px] overflow-hidden mt-[40px] md:mt-[88px]">
      {/* Background SVG */}
      <div
        className="
          absolute -bottom-[80px] md:bottom-0 -right-[40px] md:left-[320px]
          w-[550px] h-[500px]
          sm:w-[800px] sm:h-[650px]
          md:w-[1200px] md:h-[700px]
          transition-all duration-700 ease-in-out
          z-0
        "
      >
        <Image
          src="/pez2.jpg"
          alt="Hero Background"
          fill
          className=" object-top select-none object-cover"
          priority
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[1111px] mx-[16px]  md:mx-[160px] py-[80px] flex flex-col md:flex-row items-center justify-between gap-[48px]">
        {/* Left Text Content */}
        <div className="text-left max-w-[643px] ">
          <h1 className="text-[36px] md:text-[66px] font-medium text-[#1A1A1A] leading-tight animate-fade-right animate-once animate-ease-in-out">
            My Story <br className="hidden sm:block" />
          </h1>

          <p className="text-[#cf8eb4] mt-[16px] sm:mt-[24px] text-[16px] sm:text-[18px]">
            Every chapter of my life has led me to this moment. Let me share it
            with you.
          </p>
          <div className="mt-[32px] sm:mt-[48px]">
            <a href="/our-courses">
              <ButtonT
                variant="primary"
                className="text-[16px] font-bold px-[32px] py-[16px] w-[200px] h-[60px] flex items-center justify-center"
              >
                Story
              </ButtonT>
            </a>
          </div>
        </div>

        {/* Right Illustration */}
        <div
          className="
            w-[280px] h-[280px]
            sm:w-[380px] sm:h-[380px]
            md:w-[452px] md:h-[448px]
            transition-all duration-700 ease-in-out
            

          "
        ></div>
      </div>
    </section>
  );
}

export default HeroSection;
