import { User, User2, UserCircle } from "lucide-react";
interface IProfileNavSection {
  isCollapsed: boolean;
}
const ProfileNavSection = ({ isCollapsed }: IProfileNavSection) => {
  return (
    <>
      <div className="flex justify-center items-center gap-2 mx-1">
        <UserCircle size={24} />
        {isCollapsed && (
          <div className="flex justify-center flex-cols">
            <span className="text-sm">email@mail.com</span>
          </div>
        )}
      </div>
    </>
  );
};
export default ProfileNavSection;
