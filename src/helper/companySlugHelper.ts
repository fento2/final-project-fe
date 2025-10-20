/**
 * Helper function to generate company slug from company name
 * Uses URL encoding for company names like "Agritech%20Solutions"
 */
export const generateCompanySlug = (companyName: string): string => {
  if (!companyName) return "";

  // Use URL encoding instead of kebab-case for company names
  return encodeURIComponent(companyName.trim());
};

/**
 * Helper function to decode company slug back to name
 */
export const decodeCompanySlug = (slug: string): string => {
  if (!slug) return "";
  try {
    return decodeURIComponent(slug);
  } catch (e) {
    // Fallback for invalid encoded strings
    return slug.replace(/-/g, " ");
  }
};

/**
 * Helper function to get company slug from various company data formats
 * Uses URL encoding format like "Agritech%20Solutions"
 */
export const getCompanySlug = (company: any): string => {
  // Priority: use name with URL encoding > existing slug > company_id > id
  if (company?.name) return generateCompanySlug(company.name);
  if (company?.slug) return company.slug;
  if (company?.company_id) return company.company_id.toString();
  if (company?.id) return company.id.toString();
  return "";
};

/**
 * Example usage:
 * - Company name: "Agritech Solutions"
 * - Generated slug: "Agritech%20Solutions"
 * - URL: /jobs/companies/Agritech%20Solutions
 * - Decoded back: "Agritech Solutions"
 */

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
  // Primary check: if role is explicitly set as company (case-insensitive)
  const role = user?.role?.toString?.()?.toUpperCase?.();

  if (role === "COMPANY" || role === "COMPANIES") {
    return true;
  }

  // Secondary check: if username follows company pattern
  if (user?.username) {
    const username = user.username.toString().toLowerCase();
    const hasCompanyPattern =
      username.endsWith("_company") || username.includes("company");

    if (hasCompanyPattern) {
      return true;
    }
  }

  return false;
};

/**
 * Helper function to build company slug from username or name
 */
export const buildCompanySlug = (user: any): string => {
  // If user has a name, use that for slug generation
  if (user?.name) {
    const nameSlug = generateCompanySlug(user.name);

    return nameSlug;
  }

  // If username exists, process it for slug generation
  if (user?.username) {
    let slugBase = user.username;

    // If username ends with _company, remove that suffix
    if (slugBase.endsWith("_company")) {
      slugBase = slugBase.replace("_company", "");
    }

    // Convert underscores to spaces and generate slug
    const processedBase = slugBase.replace(/_/g, " ");
    const finalSlug = generateCompanySlug(processedBase);

    return finalSlug;
  }

  return "";
};
