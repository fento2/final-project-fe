import React from "react";
import Link from "next/link";
import { Company } from "@/types/userCompany";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                    {company.profile_picture ? (
                        <AvatarImage src={company.profile_picture} alt={company.name} />
                    ) : (
                        <AvatarFallback>{company.name?.charAt(0) ?? "C"}</AvatarFallback>
                    )}
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-sm">{company.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground truncate">
                        {company.email} • {company.phone}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {company.description && company.description?.length > 140
                        ? company.description.slice(0, 140) + "…"
                        : company.description}
                </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <Link href={company.website ? company.website : ""} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">Website</Button>
                </Link>

                <Link href={`/jobs/companies/${company.name}`}>
                    <Button size="sm">Lihat Profil</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}