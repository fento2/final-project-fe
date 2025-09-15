import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"

interface ApplciantActionProps {
    status: string;
    setIsModalOpen: (val: boolean) => void
    setStatus: (val: string) => void
}
const ApplciantAction = ({ setIsModalOpen, setStatus, status }: ApplciantActionProps) => {
    return (
        <>
            {/* Application Actions */}
            <Card className="p-6 space-y-4">
                <CardTitle className="text-xl font-semibold">Application Actions</CardTitle>

                {status === "In Review" && (
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Set Interview
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition"
                            onClick={() => setStatus("Rejected")}
                        >
                            Reject
                        </Button>
                    </div>
                )}

                {status === "Rejected" && (
                    <p className="font-medium text-lg text-red-600">Status: Rejected</p>
                )}
            </Card>
        </>
    )
}
export default ApplciantAction