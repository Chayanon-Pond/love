"use client";

import React from "react";
import NavBar from "@/components/nav";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import TeamSection from "@/components/landing/TeamSection";
import Footer from "@/components/footer";
import { useAuth } from "@/app/context/authContext";

function Home() {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <HeroSection />
      <FeatureSection />
      <TeamSection />
      <Footer />
    </>
  );
}

export default Home;
