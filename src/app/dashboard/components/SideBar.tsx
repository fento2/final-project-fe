"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ProfileNavSection from "./ProfileNavSection";
import UserOption from "./UserOption";
import HeaderDashboard from "./HeaderDashboard";
import { Menu, X } from "lucide-react";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "4.05rem" },
};

const mobileVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
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
        <SidebarContent isCollapsed={isCollapsed} />
      </motion.div>

      {/* Sidebar Mobile (slide-in) */}
      <motion.div
        className="md:hidden fixed top-0 left-0 z-50 h-full w-60 bg-white dark:bg-black shadow-2xl"
        initial="hidden"
        animate={showSideBar ? "visible" : "hidden"}
        variants={mobileVariants}
        transition={transitionProps as any}
      >
        {/* Tombol close */}

        <SidebarContent isCollapsed={false} />
      </motion.div>
    </>
  );
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <motion.div className="relative z-40 flex text-muted-foreground h-full shrink-0 flex-col transition-all">
      <motion.ul className="flex h-full flex-col">
        <div className="flex grow flex-col items-center">
          <div className="flex h-[54px] w-full shrink-0 border-b p-2">
            <ProfileNavSection isCollapsed={!isCollapsed} />
          </div>

          <div className="flex h-full w-full flex-col">
            <div className="flex grow flex-col gap-4">
              <ScrollArea className="h-16 grow p-2">
                <div className={cn("flex w-full flex-col gap-1")}>
                  <UserOption isCollapsed={isCollapsed} />
                  <Separator className="w-full" />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </motion.ul>
    </motion.div>
  );
}
