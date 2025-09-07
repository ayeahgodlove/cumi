import { ITeam } from "@domain/models/team.model";
import { TeamEntity } from "@data/entities/team.entity";

export interface ITeamRepository {
  getAll(): Promise<ITeam[]>;
  getById(id: number): Promise<ITeam | null>;
  create(team: ITeam): Promise<ITeam>;
  update(id: number, team: Partial<ITeam>): Promise<ITeam | null>;
  delete(id: number): Promise<boolean>;
  getActiveMembers(): Promise<ITeam[]>;
}

export class TeamRepository implements ITeamRepository {
  async getAll(): Promise<ITeam[]> {
    // This would typically connect to a database
    // For now, return mock data
    return [
      {
        id: 1,
        name: "Ayuk Godlove",
        role: "Founder & Software Engineer",
        position: "Creative Designer",
        bio: "At Cumi, I combined my skills as a software engineer and creative designer to empower startup businesses through innovative web solutions. I developed scalable websites and applications using technologies like React and Laravel, while also managing client relationships and project timelines.",
        avatar: "/img/avatar.png",
        email: "ayukgodlove@cumitech.com",
        phone: "+237681289411",
        linkedin: "https://linkedin.com/in/ayukgodlove",
        github: "https://github.com/ayukgodlove",
        skills: ["React", "Laravel", "Node.js", "TypeScript", "PHP", "JavaScript", "UI/UX Design"],
        experience: "5+ years",
        education: "Software Engineering",
        location: "Bamenda, Northwest, Cameroon",
        isActive: true,
        joinDate: new Date("2024-06-01"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getById(id: number): Promise<ITeam | null> {
    const teams = await this.getAll();
    return teams.find(team => team.id === id) || null;
  }

  async create(team: ITeam): Promise<ITeam> {
    // Mock implementation - in real app, this would save to database
    const newTeam = {
      ...team,
      id: Date.now(), // Simple ID generation
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newTeam;
  }

  async update(id: number, team: Partial<ITeam>): Promise<ITeam | null> {
    // Mock implementation - in real app, this would update database
    const existingTeam = await this.getById(id);
    if (!existingTeam) return null;

    const updatedTeam = {
      ...existingTeam,
      ...team,
      updatedAt: new Date()
    };
    return updatedTeam;
  }

  async delete(id: number): Promise<boolean> {
    // Mock implementation - in real app, this would delete from database
    const team = await this.getById(id);
    return team !== null;
  }

  async getActiveMembers(): Promise<ITeam[]> {
    const teams = await this.getAll();
    return teams.filter(team => team.isActive);
  }
}
