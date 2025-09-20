/**
 * Helper function to generate company slug from company name
 * This matches the pattern used in existing company components
 */
export const generateCompanySlug = (companyName: string): string => {
    if (!companyName) return '';
    
    return companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

/**
 * Helper function to get company slug from various company data formats
 */
export const getCompanySlug = (company: any): string => {
    // Priority: existing slug > generated from name > company_id > id
    if (company?.slug) return company.slug;
    if (company?.name) return generateCompanySlug(company.name);
    if (company?.company_id) return company.company_id.toString();
    if (company?.id) return company.id.toString();
    return '';
};

/**
 * Helper function to navigate to company detail page
 */
export const getCompanyDetailUrl = (company: any): string => {
    const slug = getCompanySlug(company);
    return `/jobs/companies/${slug}`;
};