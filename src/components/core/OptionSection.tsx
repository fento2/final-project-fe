import { useAuthStore } from "@/lib/zustand/authStore";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const DeveloperOption = () => {
    const router = useRouter()
    return <>
        <DropdownMenuItem
            onClick={() => {
                router.push("/dashboard/list-skill-assessment");
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            Manage Skill Assesment
        </DropdownMenuItem>

        <DropdownMenuItem
            onClick={() => {
                router.push("/dashboard/subscription");
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            Manage Subscription
        </DropdownMenuItem>

    </>
}
export const UserOption = () => {
    const router = useRouter()
    const { username } = useAuthStore()
    return <>
        <DropdownMenuItem
            onClick={() => {
                router.push("/dashboard/profile");
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
            onClick={() => {
                router.push(`/profile/${username}`);
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
            onClick={() => {
                router.push(`/dashboard/my-subscription`);
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            My Subscription
        </DropdownMenuItem>

    </>
}
export const CompanyOption = () => {
    const router = useRouter()
    return <>
        <DropdownMenuItem
            onClick={() => {
                router.push("/dashboard/company");
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
            onClick={() => {
                router.push(`/dashboard/postings`);
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            My Postings
        </DropdownMenuItem>

        <DropdownMenuItem
            onClick={() => {
                router.push(`/dashboard/analytics`);
            }}
            className="text-lg px-4 py-2 rounded-md"
        >
            Analytics
        </DropdownMenuItem>

    </>
}

interface MobileOptionProps {
    setOpen: (val: boolean) => void

}

export const MobileUserOption = ({ setOpen }: MobileOptionProps) => {
    const { username } = useAuthStore()
    return <>
        <li>
            <Link
                href={'/dashboard/profile'}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                Dashboard
            </Link>
        </li>
        <li>
            <Link
                href={`/profile/${username}`}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                My Profile
            </Link>
        </li>
        <li>
            <Link
                href={`/dashboard/my-subscription`}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                My Subcription
            </Link>
        </li>
    </>
}
export const MobileCompanyOption = ({ setOpen }: MobileOptionProps) => {
    return <>
        <li>
            <Link
                href={'/dashboard/company'}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                Dashboard
            </Link>
        </li>
        <li>
            <Link
                href={`/dashboard/postings`}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                My Postings
            </Link>
        </li>
        <li>
            <Link
                href={`/dashboard/analytics`}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                Analytics
            </Link>
        </li>
    </>
}
export const MobileDeveloperOption = ({ setOpen }: MobileOptionProps) => {

    return <>
        <li>
            <Link
                href={"/dashboard/list-skill-assessment"}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                Manage Skill Assesment
            </Link>
        </li>
        <li>
            <Link
                href={"/dashboard/subscription"}
                className="block px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
            >
                Manage Subscription
            </Link>
        </li>
    </>
}
