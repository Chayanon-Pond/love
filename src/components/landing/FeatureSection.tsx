"use client";

import React from "react";
import { PawPrint, Flame, TrendingUp, Cat } from "lucide-react";
import Image from "next/image";

const features1 = [
  {
    icon: PawPrint,
    title: "Cat Lover",
    desc: "ฉันเป็นทาสแมวที่รักแมวมากๆ และจะรักตลอดไปจะเก็บเงินให้แมวถึง2ล้านบาทจะรักษาแมวให้ดีที่สุด",
  },
  {
    icon: Cat,
    title: "Hoji",
    desc: "โฮจิเป็นแมว2สีที่คนอื่นเรียกมีสีที่สวยหูพับชอบกินเปียกและอยากขบนกทุกตัวที่บินผ่าน",
  },
];

const features2 = [
  {
    icon: TrendingUp,
    title: "Smart Money Manager",
    desc: "เก็บเงินเก่งและใช้ชีวิตอย่างฉลาด วางแผนการเงินเพื่ออนาคตที่ดีและการดูแลแมวที่รัก",
  },
  {
    icon: Flame,
    title: "Spicy Food Lover",
    desc: "ฉันชอบกินเผ็ดมากๆ ยิ่งเผ็ดยิ่งดี ความเผ็ดทำให้ฉันรู้สึกมีพลังและท้าทายตัวเองในทุกๆวัน",
  },
];

// Reusable block for each feature section
function FeatureBlock({
  imageSrc,
  imageAlt,
  heading,
  features,
  imageFirst = true,
}: {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  features: typeof features1;
  imageFirst?: boolean;
}) {
  return (
    <div className="w-full max-w-[1111px] mx-auto flex flex-col md:flex-row gap-[40px] md:gap-[80px] mb-[56px] md:mb-[80px] items-center">
      {imageFirst && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={454}
          height={330}
          className="w-[343px] h-[249px] md:w-[454px] md:h-[330px] rounded-xl object-cover"
        />
      )}
      <div className="w-full md:w-1/2 flex flex-col space-y-[24px]">
        <h2 className="text-[24px] md:text-[34px] font-medium text-[#1A1A1A] leading-snug max-w-[547px]">
          {heading}
        </h2>
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-[16px]">
            <div className="p-[8px] rounded-full border border-dashed border-[#b13c9d] shrink-0">
              <Icon className="text-[#e679ca] w-[20px] h-[20px]" />
            </div>
            <div className="max-w-full">
              <h3 className="font-medium text-[18px] md:text-[21px] text-[#1A1A1A]">
                {title}
              </h3>
              <p className="text-[#6B7280] text-[15px] md:text-[16px] mt-[4px]">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      {!imageFirst && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={454}
          height={330}
          className="w-[343px] h-[249px] md:w-[454px] md:h-[330px] rounded-xl object-cover object-left-center"
        />
      )}
    </div>
  );
}

const FeatureSection: React.FC = () => {
  return (
    <section className="bg-white px-[16px] sm:px-[80px] lg:px-[160px] my-[64px] lg:my-[160px] flex flex-col items-center overflow-hidden">
      <FeatureBlock
        imageSrc="/hoji.png"
        imageAlt="Feature 1"
        heading="My journey has been shaped by unique experiences and passions"
        features={features1}
        imageFirst={true}
      />
      <FeatureBlock
        imageSrc="/pez4.jpg"
        imageAlt="Feature 2"
        heading="Spice Enthusiast "
        features={features2}
        imageFirst={false}
      />
    </section>
  );
};

export default FeatureSection;
