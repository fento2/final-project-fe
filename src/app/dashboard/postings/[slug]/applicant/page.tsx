'use client'
import { useAuthRole } from "@/helper/useAuthRole"
import GridDetailApplication from "./components/GridDetailApplication"

const ApplicantionPage = () => {
    useAuthRole('COMPANY');

    return (
        <>
            <GridDetailApplication />
        </>
    )
}
export default ApplicantionPage