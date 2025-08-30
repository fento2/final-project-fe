export interface Company {
    id: number;
    name: string;
    logo: string;
    employees: number;
    salary: string;
    location: string;
    jobsOpen: number;
    rating: number;
    industry: string;
    founded: number;
    description: string;
    benefits: string[];
    growth: number;
    verified: boolean;
}

export interface CompanyFilters {
    activity: string[];
    industry: string[];
    languages: string[];
    location: string[];
    tools: string[];
}

export const formatSalary = (salary: string): string => {
    return salary.replace(/(\d+),(\d+)/g, '$1,$2');
};

export const formatEmployeeCount = (count: number): string => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString();
};

export const getCompanySizeCategory = (employees: number): string => {
    if (employees <= 50) return 'Startup';
    if (employees <= 200) return 'Small';
    if (employees <= 1000) return 'Medium';
    return 'Large';
};

export const getCompanyAge = (founded: number): number => {
    return new Date().getFullYear() - founded;
};

export const filterCompanies = (
    companies: Company[],
    searchTerm: string,
    industryFilter: string,
    locationFilter: string,
    sizeFilter: string,
    ratingFilter: number
): Company[] => {
    return companies.filter(company => {
        const matchesSearch = !searchTerm || 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.industry.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesIndustry = !industryFilter || company.industry === industryFilter;
        
        const matchesLocation = !locationFilter || 
            company.location.toLowerCase().includes(locationFilter.toLowerCase());
        
        const matchesSize = !sizeFilter || getCompanySizeCategory(company.employees) === sizeFilter;
        
        const matchesRating = !ratingFilter || company.rating >= ratingFilter;

        return matchesSearch && matchesIndustry && matchesLocation && matchesSize && matchesRating;
    });
};

export const sortCompanies = (companies: Company[], sortBy: string): Company[] => {
    return [...companies].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'employees':
                return b.employees - a.employees;
            case 'jobs':
                return b.jobsOpen - a.jobsOpen;
            case 'rating':
                return b.rating - a.rating;
            case 'growth':
                return b.growth - a.growth;
            case 'founded':
                return b.founded - a.founded;
            default:
                return 0;
        }
    });
};

export const getUniqueValues = (companies: Company[], field: keyof Company): string[] => {
    return [...new Set(companies.map(company => {
        if (field === 'location') {
            // Extract state/country from location
            return company.location.split(',')[1]?.trim() || company.location;
        }
        return company[field] as string;
    }))].filter(Boolean);
};

export const getCompanyStats = (companies: Company[]) => {
    const totalJobs = companies.reduce((sum, company) => sum + company.jobsOpen, 0);
    const avgRating = companies.reduce((sum, company) => sum + company.rating, 0) / companies.length;
    const avgEmployees = companies.reduce((sum, company) => sum + company.employees, 0) / companies.length;
    const avgGrowth = companies.reduce((sum, company) => sum + company.growth, 0) / companies.length;

    return {
        totalCompanies: companies.length,
        totalJobs,
        averageRating: Math.round(avgRating * 10) / 10,
        averageEmployees: Math.round(avgEmployees),
        averageGrowth: Math.round(avgGrowth * 10) / 10,
        verifiedCompanies: companies.filter(c => c.verified).length,
    };
};

export const getIndustryDistribution = (companies: Company[]) => {
    const distribution: { [key: string]: number } = {};
    companies.forEach(company => {
        distribution[company.industry] = (distribution[company.industry] || 0) + 1;
    });
    return Object.entries(distribution).map(([industry, count]) => ({ industry, count }));
};

export const getLocationDistribution = (companies: Company[]) => {
    const distribution: { [key: string]: number } = {};
    companies.forEach(company => {
        const location = company.location.split(',')[1]?.trim() || company.location;
        distribution[location] = (distribution[location] || 0) + 1;
    });
    return Object.entries(distribution).map(([location, count]) => ({ location, count }));
};

export const getTopBenefits = (companies: Company[]) => {
    const benefitCount: { [key: string]: number } = {};
    companies.forEach(company => {
        company.benefits.forEach(benefit => {
            benefitCount[benefit] = (benefitCount[benefit] || 0) + 1;
        });
    });
    return Object.entries(benefitCount)
        .map(([benefit, count]) => ({ benefit, count }))
        .sort((a, b) => b.count - a.count);
};
