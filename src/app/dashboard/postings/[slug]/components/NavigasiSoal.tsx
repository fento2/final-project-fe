"use client"

import { Button } from "@/components/ui/button"
import { FilePlus } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePreselectionStore } from "@/lib/zustand/preselectionStore"
import { schemaPreselectionTest, transformStoreToBE } from "@/validation/preselection.validation"
import { useToast } from "@/components/basic-toast"
import { apiCall } from "@/helper/apiCall"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useJobDetailStore } from "@/lib/zustand/detailJobStore"
import { useState } from "react"
import { Dots_v2 } from "@/components/ui/spinner"
interface NavigasiSoalProps {
    currentIndex: number
    questions: any[]
    handlePrev: () => void
    handleNext: () => void

}
const NavigasiSoal: React.FC<NavigasiSoalProps> = ({
    currentIndex,
    questions,
    handlePrev,
    handleNext,

}) => {
    const { minScore, setShowForm, resetQuestions } = usePreselectionStore()
    const { slug } = useParams()
    const searchParams = useSearchParams()
    const selection_id = searchParams.get('selection-id')
    const isEdit = searchParams.get('action') === 'edit'
    const toast = useToast()
    const setJob = useJobDetailStore((state) => state.setJobDetail);
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const getDetailJob = async () => {
        try {
            const { data } = await apiCall.get(`/postings/get-detail/${slug}`);
            if (data.success) {
                setJob(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSave = async () => {
        try {
            setLoading(true)
            const result = schemaPreselectionTest.safeParse(transformStoreToBE({ minScore, questions }))
            if (!result.success) {
                const messages = result.error.issues[0].message;
                toast.error(messages);
                console.log(result.error);
                return;
            }
            const { data } = await apiCall.post(`/preselection/create/${slug}`, result.data)
            if (data.success) {
                toast.success(data.message)
                getDetailJob()
                setShowForm(false)
                resetQuestions()

            }
        } catch (error) {
            toast.error('faild create preselection test')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const handleEdit = async () => {
        try {
            setLoading(true)
            const result = schemaPreselectionTest.safeParse(transformStoreToBE({ minScore, questions }))
            if (!result.success) {
                const messages = result.error.issues[0].message;
                toast.error(messages);
                console.log(result.error);
                return;
            }
            const { data } = await apiCall.patch(`/preselection/edit/${selection_id}`, result.data)
            if (data.success) {
                toast.success(data.message)
                router.replace(`/dashboard/postings/${slug}`)
                getDetailJob()
                setShowForm(false)
                resetQuestions()
            }
        } catch (error) {
            toast.error('faild edit preselection test')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex justify-between mt-4">
            {/* Tombol Previous */}
            <Button onClick={handlePrev} disabled={currentIndex === 0}>
                Prev
            </Button>

            {currentIndex === questions.length - 1 ? (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-indigo-500 hover:bg-indigo-800 flex items-center gap-2">
                            Save <FilePlus size={18} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to confirm this action?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={isEdit ? handleEdit : handleSave}
                                className="bg-indigo-500 hover:bg-indigo-700"
                            >
                                {loading ? <Dots_v2 /> : isEdit ? "Yes, Update" : "Yes, Submit"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : (
                <Button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                >
                    Next
                </Button>
            )}
        </div>
    )
}

export default NavigasiSoal
