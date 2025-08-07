"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  User,
  LogOut,
  BookText,
  ClipboardCheck,
  Star,
  Package,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ButtonT } from "@/components/ui/ButtonT";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

type NavBarProps = {
  navigate?: (to: string) => void;
};

const NavBar: React.FC<NavBarProps> = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleNav = (to: string) => {
    if (navigate) {
      navigate(to);
    } else {
      router.push(to); // fallback
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      (async () => {
        await signOut();
        document.cookie = "redirecting=; max-age=0; path=/;";
        window.location.href = "/secret";
      })();
    }
  }, [user]);

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: BookText, label: "My Pic", href: "/my-pic" },
    { icon: ClipboardCheck, label: "My Story", href: "/my-story" },
    { icon: Star, label: "My Wishlist", href: "/wishlist" },
    { icon: Package, label: "My Bundle", href: "/my-bundles" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      document.cookie = "redirecting=; max-age=0; path=/;";
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = user?.full_name || "User";
  const avatarUrl = user?.profile_picture || "/img/defaultProfileImage.png";

  return (
    <nav className="bg-white fixed w-full h-[56px] sm:h-[88px] z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between mx-[80px] lg:mx-[160px] h-full">
        {/* Logo */}
        <a
          className="text-3xl font-extrabold text-transparent cursor-pointer bg-[#c788ad]"
          style={{ backgroundClip: "text", WebkitBackgroundClip: "text" }}
          onClick={() => handleNav("/")}
        >
          Pezpoy
        </a>

        <div className="flex items-center space-x-6">
          <a
            className="font-semibold text-[#c788ad] hover:text-[#993f74] transition cursor-pointer text-lg"
            onClick={() => handleNav("/our-courses")}
          >
            ความน่ารักของหนู
          </a>

          {!user ? (
            <button 
              onClick={() => handleNav("/secret")}
              className="font-sans whitespace-nowrap bg-[#c788ad] hover:bg-[#993f74] rounded-[12px] font-bold px-[32px] py-[18px] cursor-pointer flex items-center justify-center text-white text-lg transition"
            >
              Secret
            </button>
          ) : (
            <DropdownMenu onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 cursor-pointer px-2 py-1 rounded-md transition focus:outline-none">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={avatarUrl}
                      alt={displayName}
                      className="object-cover"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1">
                    <span className="text-base font-medium text-[#3B3F66]">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#3B3F66] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                align="start"
                alignOffset={100}
                sideOffset={-8}
                className="w-52 mt-2 rounded-xl bg-white border border-gray-200 shadow-xl py-2"
              >
                {menuItems.map(({ icon: Icon, label, href }) => (
                  <DropdownMenuItem
                    key={label}
                    onClick={() => handleNav(href)}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 text-[#646D89] cursor-pointer"
                  >
                    <Icon className="w-5 h-5 text-[#8DADE0]" />
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-2 border-t text-[#E4E6ED]" />
                <DropdownMenuItem
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 text-[#646D89] cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-[#8DADE0]" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex justify-between items-center h-full mx-[16px]">
        {/* Logo */}
        <a
          className="text-xl font-extrabold text-transparent bg-[#c788ad] cursor-pointer"
          style={{ backgroundClip: "text", WebkitBackgroundClip: "text" }}
          onClick={() => handleNav("/")}
        >
          pezpoy
        </a>

        <div className="flex items-center space-x-4">
          <a
            className="text-sm font-bold text-[#c788ad] hover:text-[#993f74] transition !important cursor-pointer"
            onClick={() => handleNav("/our-courses")}
          >
            ความน่ารักของหนู
          </a>

          {!user ? (
            <button 
              onClick={() => handleNav("/secret")}
              className="font-sans whitespace-nowrap w-[74px] h-[37px] bg-[#c788ad] hover:bg-[#993f74] rounded-[12px] font-bold px-[32px] py-[18px] cursor-pointer flex items-center justify-center text-white text-sm transition"
            >
              Secret
            </button>
          ) : (
            <DropdownMenu onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={avatarUrl}
                      alt={displayName}
                      className="object-cover"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`w-4 h-4 text-[#3B3F66] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-44 mt-2 rounded-xl bg-white border border-gray-200 shadow-xl py-2">
                {menuItems.map(({ icon: Icon, label, href }) => (
                  <DropdownMenuItem
                    key={label}
                    onClick={() => handleNav(href)}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 text-[#646D89] cursor-pointer"
                  >
                    <Icon className="w-5 h-5 text-[#8DADE0]" />
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-2 border-t text-[#E4E6ED]" />
                <DropdownMenuItem
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 text-[#646D89]"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-[#8DADE0]" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
