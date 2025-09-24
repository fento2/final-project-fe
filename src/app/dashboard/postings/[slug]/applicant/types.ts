export interface Education {
  university: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  name: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Certificate {
  code: string;
}

export interface Interview {
  startDate: string;
  endDate: string;
  note: string;
  location: string;
}

export interface DetailApplicant {
  name: string;
  email: string;
  score: number;
  profile_picture: string | null;
  appliedOn: string;
  phone?: string;
  status: string;
  address?: string;
  birthDate?: string;
  age?: number | null;
  gender?: string;
  expectedSalary: number;
  cvUrl?: string | null;
  education: Education[];
  experience: Experience[];
  CertificatesCode: Certificate[];
  jobTitle?: string;
  JobType?: string;
  interview: Interview;
  jobCategory?: string;
}

export interface AllSchedules {
  applicant_id: number;
  interview_id: number;
  startDate: string;
  endDate: string;
  note: string;
}
