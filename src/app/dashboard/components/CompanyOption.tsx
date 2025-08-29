"use client";
import { FileClock, LayoutDashboard, MessagesSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface IUserOption {
  isCollapsed: boolean;
}
const CompanyOption = ({ isCollapsed }: IUserOption) => {
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
      <Link
        href="/dashboard/company/profile"
        className={cn(
          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",
          pathname?.includes("dashboard") && "bg-muted text-blue-600"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        <motion.li variants={variants}>
          {!isCollapsed && (
            <p className="ml-2 text-sm font-medium">Dashboard</p>
          )}
        </motion.li>
      </Link>
      <Link
        href="/dashboard/company/profile"
        className={cn(
          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",

          pathname?.includes("reports") && "bg-muted text-blue-600"
        )}
      >
        <FileClock className="h-4 w-4" />{" "}
        <motion.li variants={variants}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <p className="ml-2 text-sm font-medium">Reports</p>
            </div>
          )}
        </motion.li>
      </Link>
      <Link
        href="/chat"
        className={cn(
          "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
          pathname?.includes("chat") && "bg-muted text-blue-600"
        )}
      >
        <MessagesSquare className="h-4 w-4" />
        <motion.li variants={variants}>
          {!isCollapsed && (
            <div className="ml-2 flex items-center  gap-2">
              <p className="text-sm font-medium">Chat</p>
              <Badge
                className={cn(
                  "flex h-fit w-fit items-center gap-1.5 rounded border-none bg-blue-50 px-1.5 text-blue-600 dark:bg-blue-700 dark:text-blue-300"
                )}
                variant="outline"
              >
                BETA
              </Badge>
            </div>
          )}
        </motion.li>
      </Link>
    </>
  );
};

export default CompanyOption;
