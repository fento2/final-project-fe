"use client";

type Props = {
    role: "user" | "company";
    setRole: (r: "user" | "company") => void;
};

export default function RoleSelector({ role, setRole }: Props) {
    return (
        <div className="text-sm">
            <span className="text-gray-700 block mb-2">Role</span>
            <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                    <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === "user"}
                        onChange={() => setRole("user")}
                        className="w-4 h-4"
                    />
                    <span>User</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="radio"
                        name="role"
                        value="company"
                        checked={role === "company"}
                        onChange={() => setRole("company")}
                        className="w-4 h-4"
                    />
                    <span>Company</span>
                </label>
            </div>
        </div>
    );
}