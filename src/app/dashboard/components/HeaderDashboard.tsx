"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react"; // icon back
import { Button } from "@/components/ui/button";

type IHeaderDashboard = {
  children?: ReactNode;
};

const HeaderDashboard = ({ children }: IHeaderDashboard) => {
  const pathname = usePathname();
  const router = useRouter();

  let pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Maksimal 3 segment di mobile
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;
  if (isMobile && pathSegments.length > 3) {
    pathSegments = [
      pathSegments[0],
      "...",
      pathSegments[pathSegments.length - 2],
      pathSegments[pathSegments.length - 1],
    ];
  }

  const truncateText = (text: string, maxLength = 20): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-black shadow-lg">
      <nav className="flex h-16 items-center justify-between px-4 md:px-8 ml-2 md:mx-20">
        {/* Left: Back button + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-medium">
              Back
            </span>
          </Button>

          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.map((segment, index) => {
                const href = "/" + pathSegments.slice(0, index + 1).join("/");
                const isLast = index === pathSegments.length - 1;

                return (
                  <div key={href} className="flex items-center max-w-[150px]">
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className={`truncate whitespace-nowrap ${isLast
                          ? "text-indigo-600 font-bold sm:text-lg hover:text-indigo-800"
                          : "text-gray-600"
                          } capitalize`}
                        title={segment}
                      >
                        {truncateText(segment, 9)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Section (Button, Avatar, dll) */}
        <div className="flex items-center gap-2">{children}</div>
      </nav>
    </header>
  );
};
export default HeaderDashboard