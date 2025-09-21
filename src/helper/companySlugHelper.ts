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

/**
 * Helper function to check if user is a company
 * Checks both role field and username patterns
 */
export const isCompanyUser = (user: any): boolean => {
    console.log('🔍 isCompanyUser checking:', user);
    
    // Primary check: if role is explicitly set as company (case-insensitive)
    const role = user?.role?.toString?.()?.toUpperCase?.();
    console.log('🔍 Role extracted (uppercase):', role);
    
    if (role === 'COMPANY' || role === 'COMPANIES') {
        console.log('✅ Detected as COMPANY via role field');
        return true;
    }
    
    // Secondary check: if username follows company pattern
    if (user?.username) {
        const username = user.username.toString().toLowerCase();
        const hasCompanyPattern = username.endsWith('_company') || username.includes('company');
        console.log('🔍 Username pattern check:', username, '→', hasCompanyPattern);
        
        if (hasCompanyPattern) {
            console.log('✅ Detected as COMPANY via username pattern');
            return true;
        }
    }
    
    console.log('❌ NOT detected as company');
    return false;
};

/**
 * Helper function to build company slug from username or name
 */
export const buildCompanySlug = (user: any): string => {
    console.log('🏗️ buildCompanySlug input:', user);
    
    // If user has a name, use that for slug generation
    if (user?.name) {
        const nameSlug = generateCompanySlug(user.name);
        console.log('🏗️ Using name for slug:', user.name, '→', nameSlug);
        return nameSlug;
    }
    
    // If username exists, process it for slug generation
    if (user?.username) {
        let slugBase = user.username;
        console.log('🏗️ Original username:', slugBase);
        
        // If username ends with _company, remove that suffix
        if (slugBase.endsWith('_company')) {
            slugBase = slugBase.replace('_company', '');
            console.log('🏗️ Removed _company suffix:', slugBase);
        }
        
        // Convert underscores to spaces and generate slug
        const processedBase = slugBase.replace(/_/g, ' ');
        const finalSlug = generateCompanySlug(processedBase);
        console.log('🏗️ Processed:', processedBase, '→ Final slug:', finalSlug);
        return finalSlug;
    }
    
    console.log('🏗️ No name or username found, returning empty');
    return '';
};