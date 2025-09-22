import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface StartPreSelectionProps {
    selectionTest: any,
    setStarted: (val: boolean) => void
}
const StartPreSelection = ({ selectionTest, setStarted }: StartPreSelectionProps) => {
    return <>
        <div className="container mx-auto p-10 my-12">
            <Card className=" rounded-lg">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold">
                        Pre Selection Test
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 text-gray-700 text-lg">
                    <p className="text-xl">
                        Sebelum melanjutkan ke tahap lamaran kerja, Anda diminta untuk menyelesaikan tes seleksi awal ini.
                    </p>
                    <ul className="list-disc list-inside space-y-3 text-base">
                        <li>Tes berisi {selectionTest.selection_questions.length} pertanyaan pilihan ganda.</li>
                        <li>Soal-soal berhubungan dengan posisi yang Anda lamar.</li>
                        <li>Jawaban yang benar akan membantu perusahaan menilai kompetensi Anda.</li>
                        <li>Setelah tes selesai, hasil akan langsung tersimpan dan ditampilkan pada daftar pelamar.</li>
                    </ul>
                    <div className="flex justify-end">
                        <Button size="lg" className="px-8 py-4 text-lg" onClick={() => setStarted(true)}>
                            Mulai Tes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </>
}
export default StartPreSelection