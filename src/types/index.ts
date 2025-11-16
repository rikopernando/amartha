export type UserRole = "admin" | "ops";

export interface BasicInfo {
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
}

export interface Details {
  photo: string; // Base64 encoded image
  employmentType: string;
  officeLocation: string;
  notes: string;
}

export interface FormData {
  basicInfo: Partial<BasicInfo>;
  details: Partial<Details>;
}

export interface Department {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Employee {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  officeLocation?: string;
  employmentType?: string;
  photo?: string;
  notes?: string;
}
