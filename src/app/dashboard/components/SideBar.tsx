"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ProfileNavSection from "./ProfileNavSection";
import UserOption from "./UserOption";
import HeaderDashboard from "./HeaderDashboard";
import { Menu, ChevronLeft, LogOut } from "lucide-react";
import Link from "next/link";
import CompanyOption from "./CompanyOption";
import { useAuthStore } from "@/lib/zustand/authStore";
import DeveloperOption from "./DeveloperOption";
import { handleLogOut } from "@/helper/handleLogout";
import { useRouter } from "next/navigation";

const sidebarVariants = {
  open: { width: "18rem" },
  closed: { width: "4.05rem" },
};

const mobileVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

export function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(true); // desktop
  const [showSideBar, setShowSideBar] = useState(false); // mobile


  return (
    <>
      {/* Header */}
      <HeaderDashboard>
        {/* Logo Website untuk desktop */}
        <div className="hidden md:flex items-center mr-4 justify-center">
          <img
            src="/images/logo.png"
            alt="Website Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Tombol hamburger hanya di mobile */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setShowSideBar(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </HeaderDashboard>

      {/* Overlay untuk mobile */}
      {showSideBar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSideBar(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <motion.div
        className={cn(
          "hidden md:block sidebar left-0 top-0 z-50 h-full shrink-0 border-r fixed shadow-2xl bg-white dark:bg-black"
        )}
        initial={isCollapsed ? "closed" : "open"}
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={transitionProps as any}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <SidebarContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </motion.div>

      {/* Sidebar Mobile (slide-in) */}
      <motion.div
        className="md:hidden fixed top-0 left-0 z-50 h-full bg-white dark:bg-black shadow-2xl w-70"
        initial="hidden"
        animate={showSideBar ? "visible" : "hidden"}
        variants={mobileVariants}
        transition={transitionProps as any}
      >

        <div className="flex items-center justify-center h-16 border-b py-14">
          <img
            src="/images/logo.png"
            alt="Website Logo"
            className="max-h-18 w-auto"
          />
        </div>
        <SidebarContent isCollapsed={false} setIsCollapsed={setIsCollapsed} />
      </motion.div>
    </>
  );
}

function SidebarContent({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) {
  const { role, setLogOut } = useAuthStore();
  const router = useRouter()

  return (
    <motion.div className="relative z-40 flex text-muted-foreground h-full shrink-0 flex-col transition-all">
      <motion.ul className="flex h-full flex-col">
        <div className="flex grow flex-col items-center py-2.5">
          {/* Profile Section */}
          <div className="flex h-[54px] w-full shrink-0 border-b p-2">
            <ProfileNavSection isCollapsed={!isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>

          {/* Main User Options */}
          <div className="flex h-full w-full flex-col">
            <div className="flex grow flex-col gap-4">
              <ScrollArea className="h-16 grow p-2">
                <div className={cn("flex w-full flex-col gap-1")}>
                  {role === 'USER' && <>
                    <UserOption isCollapsed={isCollapsed} />
                    <Separator className="w-full" />
                  </>}
                  {role === 'COMPANY' && <>
                    <CompanyOption isCollapsed={isCollapsed} />
                    <Separator className="w-full" />
                  </>}
                  {role === 'DEVELOPER' && <>
                    <DeveloperOption isCollapsed={isCollapsed} />
                    <Separator className="w-full" />
                  </>}

                  {/* Logout Button */}
                  <div
                    onClick={() => {
                      handleLogOut(setLogOut)
                      router.replace('/')
                    }}
                    className={cn(
                      "flex h-8 w-full flex-row items-center rounded-md px-2.5 py-1.5 transition hover:bg-muted hover:text-red-500 cursor-pointer",
                    )}
                  >
                    <LogOut className="h-6 w-6" />
                    {!isCollapsed && <span className="ml-4 text-md font-medium">Logout</span>}
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Separator */}
            <Separator className="w-full" />

            {/* Home Menu di paling bawah */}
            <Link
              href="/"
              className={cn(
                "flex h-10 w-full items-center rounded-md px-4 py-2 mb-2 transition hover:bg-muted hover:text-primary"
              )}
            >
              <ChevronLeft className="h-6 w-6" />
              {!isCollapsed && <span className="ml-3 font-medium">Back Home</span>}
            </Link>
          </div>
        </div>
      </motion.ul>
    </motion.div>
  );
}
