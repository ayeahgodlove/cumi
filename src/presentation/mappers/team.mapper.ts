import { ITeam } from "@domain/models/team.model";

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

export class TeamMapper {
  toDTO(team: ITeam): TeamDTO {
    return {
      id: team.id,
      name: team.name,
      role: team.role,
      position: team.position,
      bio: team.bio,
      avatar: team.avatar,
      email: team.email,
      phone: team.phone,
      linkedin: team.linkedin,
      github: team.github,
      twitter: team.twitter,
      skills: team.skills,
      experience: team.experience,
      education: team.education,
      location: team.location,
      isActive: team.isActive,
      joinDate: team.joinDate.toISOString(),
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString()
    };
  }

  toDTOs(teams: ITeam[]): TeamDTO[] {
    return teams.map(team => this.toDTO(team));
  }

  toModel(dto: TeamDTO): ITeam {
    return {
      id: dto.id,
      name: dto.name,
      role: dto.role,
      position: dto.position,
      bio: dto.bio,
      avatar: dto.avatar,
      email: dto.email,
      phone: dto.phone,
      linkedin: dto.linkedin,
      github: dto.github,
      twitter: dto.twitter,
      skills: dto.skills,
      experience: dto.experience,
      education: dto.education,
      location: dto.location,
      isActive: dto.isActive,
      joinDate: new Date(dto.joinDate),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }
}

export const teamMapper = new TeamMapper();

