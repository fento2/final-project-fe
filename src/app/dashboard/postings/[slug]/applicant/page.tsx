'use client'
import { useAuthRole } from "@/helper/authRole"
import GridDetailApplication from "./components/GridDetailApplication"

const ApplicantionPage = () => {
    useAuthRole('COMPANY')
    return (
        <>
            <GridDetailApplication />
        </>
    )
}
export default ApplicantionPage