"use client";
import {
  Building2,
  FileCheck2,
  FileInput,
  FilePen,
  MessagesSquare,
  UserPenIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";

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
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/company"
          className={cn(
            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",
            pathname === "/dashboard/company" && "bg-muted text-blue-600"
          )}
        >
          <Building2 className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <p className="ml-4 text-md font-medium">Company Profile</p>
            )}
          </motion.li>
        </Link>
        <Link
          href="/dashboard/postings"
          className={cn(
            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",

            pathname === "/dashboard/postings" && "bg-muted text-blue-600"
          )}
        >
          <FilePen className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <p className="ml-4 text-md font-medium">Postings</p>
              </div>
            )}
          </motion.li>
        </Link>
        <Link
          href="/dashboard/applicants"
          className={cn(
            "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
            pathname === "/dashboard/applicants" && "bg-muted text-blue-600"
          )}
        >
          <FileInput className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <div className="ml-4 flex items-center  gap-2">
                <p className="text-md font-medium">Applicants</p>
              </div>
            )}
          </motion.li>
        </Link>
        <Link
          href="/dashboard/applications"
          className={cn(
            "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
            pathname === "/dashboard/aplications" && "bg-muted text-blue-600"
          )}
        >
          <MessagesSquare className="h-6 w-6" />
          <motion.li variants={variants}>
            {!isCollapsed && (
              <div className="ml-4 flex items-center gap-2">
                <p className="text-md font-medium">Applications</p>
              </div>
            )}
          </motion.li>
        </Link>
      </div>
    </>
  );
};

export default CompanyOption;
