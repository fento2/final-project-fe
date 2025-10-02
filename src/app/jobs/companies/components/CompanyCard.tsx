import React from "react";
import Link from "next/link";
import { Company } from "@/types/userCompany";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, Globe, Mail, Phone, MapPin } from "lucide-react";
import { generateCompanySlug } from "@/helper/companySlugHelper";
import DOMPurify from 'dompurify';

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    const truncateDescription = (description: string | null | undefined, maxLength: number = 120) => {
        if (!description) return "No description available";
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + "...";
    };

    // Function to sanitize HTML using DOMPurify
    const sanitizeHTML = (html: string) => {
        if (typeof window === 'undefined') {
            // Server-side: basic sanitization
            return html
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        }
        
        // Client-side: use DOMPurify
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
            ALLOWED_ATTR: ['href', 'target', 'rel'],
            ALLOW_DATA_ATTR: false,
            FORBID_ATTR: ['style', 'class'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button']
        });
    };

    const getDescriptionHTML = (description: string | null | undefined) => {
        if (!description) return "No description available";
        
        const truncated = truncateDescription(description);
        const sanitized = sanitizeHTML(truncated);
        
        return sanitized;
    };

    return (
        <Card className="group h-full hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-indigo-300 bg-white">
            {/* Header with Company Info */}
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14 border-2 border-gray-100 group-hover:border-indigo-200 transition-colors">
                        {company.profile_picture ? (
                            <AvatarImage 
                                src={company.profile_picture} 
                                alt={company.name}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold text-lg">
                                {company.name?.charAt(0)?.toUpperCase() ?? "C"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {company.name || "Unknown Company"}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            <CardDescription className="text-xs text-gray-500 font-medium">
                                Company
                            </CardDescription>
                            {/* Show location if available */}
                            {(company as any).location && (
                                <>
                                    <span className="text-gray-300 mx-1">•</span>
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                        {(company as any).location}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="pt-0 pb-4">
                {/* Description */}
                <div 
                    className="company-description text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                        __html: getDescriptionHTML(company.description) 
                    }}
                />

                {/* Contact Info */}
                <div className="space-y-2">
                    {company.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{company.email}</span>
                        </div>
                    )}
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
}