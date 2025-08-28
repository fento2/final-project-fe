"use client";

import { usePathname } from "next/navigation";
import { SessionNavBar } from "./SideBar";

const ShowSideBar = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) {
    return <SessionNavBar />;
  }
  return null;
};
export default ShowSideBar;
