"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type IHeaderDashboard = {
  children?: ReactNode;
};

const HeaderDashboard = ({ children }: IHeaderDashboard) => {
  const pathname = usePathname();

  // Ambil path dari URL → /dashboard/profile → ["dashboard", "profile"]
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-black shadow-lg">
      <nav className="flex h-16 items-center justify-between px-4 md:px-8 ml-8 md:mx-20">
        {/* Breadcrumb / Page Path */}
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((segment, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;

              return (
                <div key={href} className="flex items-center">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={href}
                      className={`${
                        isLast
                          ? "text-indigo-600 font-bold text-lg hover:text-indigo-800"
                          : "text-gray-600"
                      } capitalize`}
                    >
                      {segment}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Right Section (Button, Avatar, dll) */}
        <div className="flex items-center gap-2">{children}</div>
      </nav>
    </header>
  );
};

export default HeaderDashboard;
