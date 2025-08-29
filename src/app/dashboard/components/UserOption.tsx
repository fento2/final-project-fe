"use client";
import { FileCheck2, MessagesSquare, UserPenIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface IUserOption {
  isCollapsed: boolean;
}
const UserOption = ({ isCollapsed }: IUserOption) => {
  const pathname = usePathname();
  const variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        x: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        x: { stiffness: 100 },
      },
    },
  };
  return (
    <>
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",
            pathname === "/dashboard/profile" && "bg-muted text-blue-600"
          )}
        >
          <UserPenIcon className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <p className="ml-4 text-md font-medium">Profile</p>
            )}
          </motion.li>
        </Link>
        <Link
          href="/dashboard/my-applications"
          className={cn(
            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",

            pathname === "/dashboard/my-applications" &&
              "bg-muted text-blue-600"
          )}
        >
          <FileCheck2 className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <p className="ml-4 text-md font-medium">My Applications</p>
              </div>
            )}
          </motion.li>
        </Link>
        <Link
          href="/dashboard/interview"
          className={cn(
            "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
            pathname === "/dashboard/interview" && "bg-muted text-blue-600"
          )}
        >
          <MessagesSquare className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <div className="ml-4 flex items-center  gap-2">
                <p className="text-md font-medium">Interview</p>
              </div>
            )}
          </motion.li>
        </Link>
      </div>
    </>
  );
};

export default UserOption;
