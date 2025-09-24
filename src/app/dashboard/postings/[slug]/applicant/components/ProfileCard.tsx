"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, User, Wallet } from "lucide-react";
import { toTitleCase } from "@/helper/toTitleCase";

type ProfileCardProps = {
    profile_picture?: string;
    name: string;
    score?: number;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    age?: number;
    gender?: string;
    expectedSalary?: number;
};

const ProfileCard = ({
    profile_picture,
    name,
    score,
    email,
    phone,
    address,
    birthDate,
    age,
    gender,
    expectedSalary,
}: ProfileCardProps) => {
    return (
        <Card className="p-6 shadow-md rounded-2xl">
            <CardHeader className="flex flex-col items-center space-y-4">
                <Avatar className="w-65 h-65 border-4 border-muted shadow">
                    {profile_picture ? (
                        <AvatarImage src={profile_picture} alt={name} />
                    ) : (
                        <AvatarFallback className="text-3xl bg-muted">
                            {name[0]}
                        </AvatarFallback>
                    )}
                </Avatar>
                <CardTitle className="text-2xl font-bold tracking-wide">{name}</CardTitle>
                {score === undefined ? null : <Badge variant="secondary" className="text-lg px-4 py-1">
                    Score: {score}
                </Badge>}
            </CardHeader>

            <CardContent className="space-y-3 text-muted-foreground">
                <p className="flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5" /> {email}
                </p>
                <p className="flex items-center gap-2 text-lg">
                    <Phone className="w-5 h-5" /> {phone ?? "-"}
                </p>
                <p className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5" /> {address ?? "-"}
                </p>
                <p className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />{" "}
                    {birthDate ? new Date(birthDate).toLocaleDateString() : "-"}
                </p>
                <p className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" /> Age: {age ?? "-"} |{" "}
                    {toTitleCase(gender ?? "-")}
                </p>
                <p className="flex items-center gap-2 text-lg font-medium">
                    <Wallet className="w-5 h-5" /> Expected Salary:{" "}
                    {expectedSalary ? `Rp ${expectedSalary.toLocaleString()}` : "-"}
                </p>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
