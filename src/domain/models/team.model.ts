export interface ITeam {
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
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyTeam: ITeam = {
  id: 0,
  name: "",
  role: "",
  position: "",
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  twitter: "",
  skills: [],
  experience: "",
  education: "",
  location: "",
  isActive: true,
  joinDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

