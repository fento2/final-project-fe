import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toTitleCase } from "@/helper/toTitleCase";
import { useAuthStore } from "@/lib/zustand/authStore";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface IProfileNavSection {
  isCollapsed: boolean;
}

const ProfileNavSection = ({ isCollapsed }: IProfileNavSection) => {
  const { email, role } = useAuthStore();

  return (
    <div className="flex items-center gap-3 -mt-2">
      <Avatar className="w-11 h-11">
        <AvatarImage
          src="https://originui.com/avatar-80-07.jpg"
          alt="User"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      {isCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {email}
          </span>
          <span className="truncate text-xs text-gray-500 dark:text-gray-400">
            {toTitleCase(role)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileNavSection;
