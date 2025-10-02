import React from "react";
import { Building2, MapPin, Phone, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Company } from "../types/jobsPageTypes";
import { toAbsoluteUrl, truncateDescription } from "../utils/jobsPageHelpers";
import { generateCompanySlug } from "@/helper/companySlugHelper";

interface CompanyCardProps {
    company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                        <AvatarImage 
                            src={toAbsoluteUrl(company.profile_picture)} 
                            alt={company.name} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold text-lg">
                            {company.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate" title={company.name}>
                            {company.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-1">
                            {company.jobCount} open position{company.jobCount !== 1 ? 's' : ''}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4">
                {/* Description */}
                {company.description && (
                    <div className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {truncateDescription(company.description)}
                    </div>
                )}

                {/* Company Stats */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{company.location || 'Multiple Locations'}</span>
                    </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                    {company.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{company.phone}</span>
                        </div>
                    )}
                    {company.website && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Globe className="w-3 h-3" />
                            <span className="truncate">{company.website}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer with Actions */}
            <CardFooter className="pt-0 pb-4 mt-auto">
                <div className="flex w-full gap-2">
                    {company.website && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs font-medium hover:bg-gray-50 border-gray-200"
                            asChild
                        >
                            <Link 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Website
                            </Link>
                        </Button>
                    )}
                    
                    <Button
                        size="sm"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
                        asChild
                    >
                        <Link 
                            href={`/jobs/companies/${generateCompanySlug(company.name || '')}`}
                            className="inline-flex items-center justify-center gap-1"
                        >
                            <Building2 className="w-3 h-3" />
                            View Profile
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};