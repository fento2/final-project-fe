"use client";

import { usePathname } from "next/navigation";
import { SideBar } from "./SideBar";

const ShowSideBar = () => {
  const pathname = usePathname();
  const hideOn = ["/dashboard"];

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  if (shouldHide) return <SideBar />;

  return null;
};
export default ShowSideBar;
