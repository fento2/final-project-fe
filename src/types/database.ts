// ========================================
// DATABASE TYPES - Based on Prisma Schema
// ========================================

export interface User {
  user_id: number;
  username: string;
  email: string;
  googleId?: string;
  password?: string;
  name: string;
  role: Role;
  isVerfied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  company_id: number;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  website?: string;
  profile_picture?: string;
  user_id: number;
}

export interface Profile {
  profile_id: number;
  email: string;
  name: string;
  education?: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
  address?: string;
  profile_picture?: string;
  user_id?: number;
}

export interface Job {
  job_id: number;
  title: string;
  slug: string;
  description: string;
  category: Category;
  latitude: string;
  longitude: string;
  location: string;
  salary: number;
  periodSalary: PeriodSalary;
  currency: Currency;
  job_type: JobType;
  deletedAt?: string;
  preselection_test: boolean;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  company_id?: number;
  Company?: Company;
  skills: Skill[];
}

export interface Skill {
  id: number;
  name: string;
}

export interface Education {
  education_id: number;
  university: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  user_id?: number;
}

export interface Experience {
  experience_id: number;
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  user_id?: number;
}

export interface Application {
  application_id: number;
  expected_salary: number;
  cv: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  user_id?: number;
  job_id?: number;
  User?: User;
  Job?: Job;
}

export interface JobSave {
  job_save_id: number;
  createdAd: string;
  updatedAt: string;
  user_id?: number;
  job_id?: number;
  Job?: Job;
}

export interface Interview {
  interview_id: number;
  application_id: number;
  schedule: string;
  createAt: string;
  updatedAt: string;
  Application?: Application;
}

export interface Selection {
  selection_id: number;
  job_id: number;
  passingScore?: number;
  result: string;
  createAt: string;
  updatedAt: string;
  user_id: number;
  Job?: Job;
  User?: User;
  SelectionQuestions: SelectionQuestion[];
}

export interface SelectionQuestion {
  selection_question_id: number;
  selection_id: number;
  question: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  correct_option: CorrectOptionEnum;
  createAt: string;
  updatedAt: string;
}

export interface SkillAssessment {
  assessment_id: number;
  skill_name: string;
  createAt: string;
  updatedAt: string;
  deletedAt?: string;
  AssessmentQuestions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  assessment_question_id: number;
  assessment_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: CorrectOptionEnum;
  createAt: string;
  updatedAt: string;
}

export interface UserAssessment {
  user_assessment_id: number;
  assessment_id: number;
  user_id: number;
  score: number;
  date_taken: string;
  createAt: string;
  updatedAt: string;
  Assessment?: SkillAssessment;
  User?: User;
  AssessmentCertificates: AssessmentCertificate[];
}

export interface AssessmentCertificate {
  assessment_certificate_id: number;
  user_assessment_id: number;
  certificate_code: string;
  createAt: string;
  updatedAt: string;
}

export interface Subscription {
  subscription_id: number;
  name: string;
  price: number;
  createAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  user_subscription_id: number;
  user_id: number;
  subscription_id: number;
  start_date: string;
  end_date: string;
  createAt: string;
  updatedAt: string;
  User?: User;
  Subscription?: Subscription;
}

export interface UserCompany {
  user_company_id: number;
  company_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  createAt: string;
  updatedAt: string;
  Company?: Company;
  User?: User;
  Reviews: Review[];
}

export interface Review {
  review_id: number;
  user_company_id: number;
  salary_estimate: number;
  rating_culture: number;
  rating_work_life_balance: number;
  rating_facilities: number;
  rating_career: number;
  createAt: string;
  updatedAt: string;
  UserCompany?: UserCompany;
}

// ========================================
// ENUMS
// ========================================
export enum Role {
  USER = "USER",
  COMPANY = "COMPANY",
  DEVELOPER = "DEVELOPER"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum PeriodSalary {
  MONTH = "MONTH",
  YEAR = "YEAR",
  DAY = "DAY",
  HOUR = "HOUR"
}

export enum Currency {
  RP = "RP",
  DOLLAR = "DOLLAR",
  EURO = "EURO"
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
  CONTRACT = "CONTRACT",
  TEMPORARY = "TEMPORARY",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID"
}

export enum Category {
  SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
  DATA_SCIENCE = "DATA_SCIENCE",
  PRODUCT_MANAGEMENT = "PRODUCT_MANAGEMENT",
  DESIGN = "DESIGN",
  MARKETING = "MARKETING",
  SALES = "SALES",
  CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
  FINANCE = "FINANCE",
  HUMAN_RESOURCES = "HUMAN_RESOURCES",
  OPERATIONS = "OPERATIONS",
  EDUCATION = "EDUCATION",
  HEALTHCARE = "HEALTHCARE",
  MANUFACTURING = "MANUFACTURING",
  CONSTRUCTION = "CONSTRUCTION",
  OTHERS = "OTHERS"
}

export enum Status {
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  INTERVIEW = "INTERVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export enum CorrectOptionEnum {
  A = "A",
  B = "B",
  C = "C",
  D = "D"
}

// ========================================
// API RESPONSE TYPES
// ========================================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========================================
// FORM TYPES
// ========================================
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: Role;
}

export interface JobForm {
  title: string;
  description: string;
  category: Category;
  location: string;
  latitude: string;
  longitude: string;
  salary: number;
  periodSalary: PeriodSalary;
  currency: Currency;
  job_type: JobType;
  expiredAt: string;
  skills: string[];
  preselection_test: boolean;
}

export interface ApplicationForm {
  job_id: number;
  expected_salary: number;
  cv: string;
}

export interface ProfileForm {
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
  address?: string;
  education?: string;
}

export interface CompanyForm {
  name: string;
  email: string;
  phone?: string;
  description?: string;
  website?: string;
}

export interface EducationForm {
  university: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ExperienceForm {
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ReviewForm {
  user_company_id: number;
  salary_estimate: number;
  rating_culture: number;
  rating_work_life_balance: number;
  rating_facilities: number;
  rating_career: number;
}

// ========================================
// FILTER TYPES
// ========================================
export interface JobFilters {
  search?: string;
  category?: Category;
  location?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export interface CompanyFilters {
  search?: string;
  industry?: string;
  location?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

// ========================================
// STATISTICS TYPES
// ========================================
export interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  totalUsers: number;
  recentApplications: Application[];
  popularCategories: { category: string; count: number }[];
}

export interface CompanyStats {
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  pendingApplications: number;
  interviewScheduled: number;
  applicationsByStatus: { status: string; count: number }[];
}

export interface PublicStats {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  successRate: number;
}

// Blog Post interface untuk konten blog
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
  read_time?: number;
  status: 'draft' | 'published';
}
