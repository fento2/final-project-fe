import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toTitleCase } from "@/helper/toTitleCase";
import { useAuthStore } from "@/lib/zustand/authStore";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { AnimatePresence, motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";

interface IProfileNavSection {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void
}

const ProfileNavSection = ({ isCollapsed, setIsCollapsed }: IProfileNavSection) => {
  const { email, role, profile_picture } = useAuthStore();
  const transitionProps = {
    type: "tween",
    ease: "easeOut",
    duration: 0.3,
  };

  return (
    <div className="flex items-center gap-3 -mt-2">
      <Avatar className="w-11 h-11 rounded-full">
        <AvatarImage
          src={profile_picture || ''}
          alt="user"
          className="rounded-full object-cover"
        />
        <AvatarFallback className="rounded-full text-indigo-500">
          <UserCircle2 size={40} />
        </AvatarFallback>
      </Avatar>
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            className="flex flex-col min-w-0"
            initial={isCollapsed ? "closed" : "open"}
            animate={isCollapsed ? "closed" : "open"}
            transition={transitionProps as any}
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
          >
            <span className="font-medium text-gray-900 dark:text-white truncate max-w-50">
              {email}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {toTitleCase(role)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileNavSection;
