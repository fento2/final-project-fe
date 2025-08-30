"use client";
import {
  Briefcase,
  MessagesSquare,
  UserPenIcon,
  ChevronDown,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface IUserOption {
  isCollapsed: boolean;
}

const UserOption = ({ isCollapsed }: IUserOption) => {
  const pathname = usePathname();
  const [openJobs, setOpenJobs] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);

  const variants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Profile */}
      <Link
        href="/dashboard/profile"
        className={cn(
          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted",
          pathname === "/dashboard/profile" && "bg-muted text-blue-600"
        )}
      >
        <UserPenIcon className="h-6 w-6" />
        <motion.li variants={variants}>
          {!isCollapsed && <p className="ml-4 text-md font-medium">Profile</p>}
        </motion.li>
      </Link>

      {/* Jobs Parent */}
      <button
        onClick={() => setOpenJobs(!openJobs)}
        className={cn(
          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted ",
          (pathname === "/dashboard/my-applications" ||
            pathname === "/dashboard/saved-jobs") &&
            "bg-muted text-blue-600"
        )}
      >
        <Briefcase className="h-6 w-6 flex-shrink-0" />
        <motion.li variants={variants} className="flex w-full items-center">
          {!isCollapsed && (
            <div className="ml-4 flex w-full items-center justify-between">
              <p className="text-md font-medium">Jobs</p>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openJobs && "rotate-180"
                )}
              />
            </div>
          )}
        </motion.li>
      </button>

      {/* Jobs Submenu */}
      <AnimatePresence>
        {openJobs && !isCollapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-9 flex flex-col gap-1 text-sm overflow-hidden"
          >
            <li>
              <Link
                href="/dashboard/my-applications"
                className={cn(
                  "block rounded-md px-2 py-1 hover:bg-muted",
                  pathname === "/dashboard/my-applications" &&
                    "bg-muted text-blue-600"
                )}
              >
                My Applications
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/saved-jobs"
                className={cn(
                  "block rounded-md px-2 py-1 hover:bg-muted",
                  pathname === "/dashboard/saved-jobs" &&
                    "bg-muted text-blue-600"
                )}
              >
                Saved Jobs
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Interview */}
      <Link
        href="/dashboard/interview"
        className={cn(
          "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted ",
          pathname === "/dashboard/interview" && "bg-muted text-blue-600"
        )}
      >
        <MessagesSquare className="h-6 w-6" />
        <motion.li variants={variants}>
          {!isCollapsed && (
            <div className="ml-4 flex items-center gap-2">
              <p className="text-md font-medium">Interview</p>
            </div>
          )}
        </motion.li>
      </Link>

      {/* Skill Parent */}
      <button
        onClick={() => setOpenSkill(!openSkill)}
        className={cn(
          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted ",
          (pathname === "/dashboard/my-skill" ||
            pathname === "/dashboard/skill-assessment") &&
            "bg-muted text-blue-600"
        )}
      >
        <Star className="h-6 w-6 flex-shrink-0" />
        <motion.li variants={variants} className="flex w-full items-center">
          {!isCollapsed && (
            <div className="ml-4 flex w-full items-center justify-between">
              <p className="text-md font-medium">Skill</p>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openJobs && "rotate-180"
                )}
              />
            </div>
          )}
        </motion.li>
      </button>

      {/*Skill Submenu */}
      <AnimatePresence>
        {openSkill && !isCollapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-9 flex flex-col gap-1 text-sm overflow-hidden"
          >
            <li>
              <Link
                href="/dashboard/my-skill"
                className={cn(
                  "block rounded-md px-2 py-1 hover:bg-muted",
                  pathname === "/dashboard/my-skill" && "bg-muted text-blue-600"
                )}
              >
                My Skill
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/skill-assessment"
                className={cn(
                  "block rounded-md px-2 py-1 hover:bg-muted",
                  pathname === "/dashboard/skill-assessment" &&
                    "bg-muted text-blue-600"
                )}
              >
                Skill Assessment
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOption;
