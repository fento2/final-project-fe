// Minimal database types to satisfy imports across the app

export type Role = 'USER' | 'COMPANY' | 'DEVELOPER' | 'ADMIN';

export interface User {
  user_id?: number;
  username?: string;
  email: string;
  name?: string;
  role?: Role;
  isVerfied?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface ProfileForm {
  username?: string;
  email?: string;
  name?: string;
  password?: string;
}

export type JobType = string;

export interface Job {
  job_id: number;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  latitude?: string;
  longitude?: string;
  location?: string;
  salary?: number;
  periodSalary?: string;
  currency?: string;
  job_type?: string;
  deletedAt?: string;
  preselection_test?: boolean;
  expiredAt?: string;
  createdAt?: string;
  updatedAt?: string;
  company_id?: number;
  Company?: any;
  Companies?: any;
}

export interface Application {
  application_id: number;
  expected_salary?: number;
  cv?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  user_id?: number;
  job_id?: number;
}

export interface JobFilters {
  search?: string;
  category?: string;
  location?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

// Blog Post interface for blog content
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
    initials?: string;
  };
  published_at?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
  tags?: string[];
  read_time?: number;
  status?: 'draft' | 'published';
}
