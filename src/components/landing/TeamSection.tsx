"use client";

import React from "react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Lifestyle",
    title: "sexy and Street",
    image: "/pez5.png",
  },
  {
    name: "Favorite Food",
    title: "ข้าวคลุกกะปิ",
    image: "/food.png",
  },
  {
    name: "personality",
    title: "คลั่งรัก",
    image: "/pez6.jpg",
  },
];

const TeamSection: React.FC = () => {
  return (
    <section className="bg-white px-[16px] sm:px-[80px] lg:px-[160px] mb-40">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-[24px] md:text-[36px] font-medium mb-[24px]">
          My Life Chapters
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-[48px]">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={357}
                height={420}
                className="object-cover rounded-lg mx-auto w-[342px] h-[403px] md:w-[357px] md:h-[420px]"
              />
              <h3 className="mt-[16px] text-[20px] md:text-[24px] font-normal md:font-medium text-black">
                {member.name}
              </h3>
              <p className="text-[#cf8eb4] text-[16px] font-normal">
                {member.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
