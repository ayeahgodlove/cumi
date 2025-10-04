export interface TeamDTO {
  id: number;
  name: string;
  role: string;
  position: string;
  bio: string;
  avatar?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  skills: string[];
  experience: string;
  education?: string;
  location?: string;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

