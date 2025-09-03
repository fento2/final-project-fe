import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { LayoutDashboardIcon } from "lucide-react";
interface IMobileNav {
  setOpen: (open: boolean) => void;
  setActive: (active: string) => void;
  active: string;
}
const MobileNav = ({ setOpen, setActive, active }: IMobileNav) => {
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const menus = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm z-20"
        onClick={() => setOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-64 bg-white z-30 shadow-lg flex flex-col pt-24 px-6">
        <ul className="flex flex-col gap-4">
          {menus.map((m) => (
            <li key={m.label}>
              <Link
                href={m.href}
                className={`block px-4 py-2 rounded ${
                  active === m.label
                    ? "text-white bg-[#4F46E5]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActive(m.label);
                  setOpen(false);
                }}
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Divider inside mobile menu */}
        {/* <div className="border-t mt-6 pt-6 flex flex-col gap-3">
          <Button
            className="w-full bg-indigo-600 text-white hover:bg-[#4F46E5]"
            onClick={() => {
              setOpen(false);
              setShowSignIn(true);
            }}
          >
            Sign In
          </Button>
          <Button
            className="w-full bg-transparant text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-700"
            onClick={() => {
              setOpen(false);
              setShowSignUp(true);
            }}
          >
            Sign Up
          </Button>
        </div> */}
        <div>
          <Button className="w-full bg-indigo-600 text-white hover:bg-[#4F46E5]">
            <LayoutDashboardIcon />
            Dashboard
          </Button>
        </div>
      </div>
    </>
  );
};
export default MobileNav;
