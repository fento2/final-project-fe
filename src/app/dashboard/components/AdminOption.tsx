import { cn } from "@/lib/utils";
import { FileText, ChevronDown, ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface IAdminOption {
  isCollapsed: boolean;
}

const menus = [
  {
    title: "Content",
    icon: FileText,
    sub: [
      { title: "Blog", href: "/dashboard/blog" },
    ],
  },
];

const AdminOption = ({ isCollapsed }: IAdminOption) => {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  const variants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  return (
    <div className="grid gap-3">
      {menus.map(({ title, icon: Icon, sub }) => {
        const isActive = sub?.some((s) => s.href === pathname);

        return (
          <div key={title} className="flex flex-col">
            {
              <button
                onClick={() => setOpen(open === title ? null : title)}
                className={cn(
                  "flex h-8 items-center rounded-md px-2 py-1.5 transition hover:bg-muted",
                  isActive && "bg-muted text-blue-600"
                )}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <motion.li variants={variants} className="flex w-full items-center">
                  {!isCollapsed && (
                    <div className="ml-4 flex w-full items-center justify-between">
                      <p className="text-md font-medium">{title}</p>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          open === title && "rotate-180"
                        )}
                      />
                    </div>
                  )}
                </motion.li>
              </button>
            }

            <AnimatePresence>
              {sub && open === title && !isCollapsed && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-9 flex flex-col gap-1 text-sm overflow-hidden"
                >
                  {sub.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        className={cn(
                          "block rounded-md px-2 py-1 hover:bg-muted",
                          pathname === s.href && "bg-muted text-blue-600"
                        )}
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOption;
