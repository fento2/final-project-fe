import { Button } from "@/components/ui/button"
interface ButtonProfileProps {
    editing: boolean;
    handleSave: () => void;
    setEditing: (value: boolean) => void;
    getData: () => void;
}
const ButtonProfile: React.FC<ButtonProfileProps> = ({
    editing,
    handleSave,
    setEditing,
    getData,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {editing ? (
                <>
                    <Button
                        onClick={handleSave}
                        className="bg-indigo-500 text-white w-full sm:w-auto"
                    >
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setEditing(false);
                            getData();
                        }}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                </>
            ) : (
                <Button
                    onClick={() => setEditing(true)}
                    className="w-full sm:w-auto"
                >
                    Edit Profile
                </Button>
            )}
        </div>
    );
};

export default ButtonProfile;
