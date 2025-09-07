import { ITeam } from "./team.model";

export class TeamEntity {
  constructor(
    public id: number,
    public name: string,
    public role: string,
    public position: string,
    public bio: string,
    public avatar?: string,
    public email?: string,
    public phone?: string,
    public linkedin?: string,
    public github?: string,
    public twitter?: string,
    public skills: string[] = [],
    public experience: string = "",
    public education?: string,
    public location?: string,
    public isActive: boolean = true,
    public joinDate: Date = new Date(),
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static fromModel(model: ITeam): TeamEntity {
    return new TeamEntity(
      model.id,
      model.name,
      model.role,
      model.position,
      model.bio,
      model.avatar,
      model.email,
      model.phone,
      model.linkedin,
      model.github,
      model.twitter,
      model.skills,
      model.experience,
      model.education,
      model.location,
      model.isActive,
      model.joinDate,
      model.createdAt,
      model.updatedAt
    );
  }

  toModel(): ITeam {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      position: this.position,
      bio: this.bio,
      avatar: this.avatar,
      email: this.email,
      phone: this.phone,
      linkedin: this.linkedin,
      github: this.github,
      twitter: this.twitter,
      skills: this.skills,
      experience: this.experience,
      education: this.education,
      location: this.location,
      isActive: this.isActive,
      joinDate: this.joinDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
