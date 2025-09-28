"use client";
import UserDemographics from "./components/UserDemographics";
import SalaryTrends from "./components/SalaryTrends";
import ApplicantInterest from "./components/ApplicantInterest";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAuthRole } from "@/helper/authRole";


const AnalyticsPage = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setOpen(true);
        }
    }, []);
    return (
        <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-sm text-muted-foreground">
                        Dashboard overview of user demographics, salary trends, and applicant interests
                    </p>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Better Experience on Desktop</DialogTitle>
                        <DialogDescription>
                            This analytics dashboard is best viewed on a desktop or larger
                            screen for better readability and usability.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <UserDemographics />
            <SalaryTrends />
            <ApplicantInterest />
        </div>
    );
};

export default AnalyticsPage;
