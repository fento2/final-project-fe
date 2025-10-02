import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Dots_v2 } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Dispatch, SetStateAction } from "react"

interface ModalTextAreaProps {
    showEditor: boolean
    setShowEditor: Dispatch<SetStateAction<boolean>>
    text: string
    setText: (value: SetStateAction<string>) => void
    loading: boolean
    handleSend: () => Promise<void>
}
export const ModalTextArea = ({ showEditor, setShowEditor, text, setText, handleSend, loading }: ModalTextAreaProps) => {
    return <>
        {/* Modal Text Area */}
        <Dialog open={showEditor} onOpenChange={setShowEditor}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Custom Message</DialogTitle>
                </DialogHeader>

                <Textarea
                    className="w-full h-48 p-2 border rounded-md"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tulis pesan custom untuk dikirim ke email di sini..."
                />

                <DialogFooter className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setShowEditor(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={loading}>
                        {loading ? <Dots_v2 /> : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}