"use client";

import { usePathname } from "next/navigation";
import { SideBar } from "./SideBar";

const ShowSideBar = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard/")) {
    return <SideBar />;
  }
  return null;
};
export default ShowSideBar;
