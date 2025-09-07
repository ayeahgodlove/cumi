import { ITeam } from "@domain/models/team.model";
import { ITeamRepository } from "@data/repositories/team.repository";

export class TeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async getAll(): Promise<ITeam[]> {
    const teams = await this.teamRepository.getAll();
    return teams.map((team: any) => team.dataValues || team);
  }

  async getById(id: number): Promise<ITeam | null> {
    const team = await this.teamRepository.getById(id);
    if (!team) return null;
    return (team as any).dataValues || team;
  }

  async create(teamData: Partial<ITeam>): Promise<ITeam> {
    const team = await this.teamRepository.create(teamData as ITeam);
    return (team as any).dataValues || team;
  }

  async update(id: number, teamData: Partial<ITeam>): Promise<ITeam | null> {
    const team = await this.teamRepository.update(id, teamData);
    if (!team) return null;
    return (team as any).dataValues || team;
  }

  async delete(id: number): Promise<boolean> {
    return await this.teamRepository.delete(id);
  }

  async getActiveMembers(): Promise<ITeam[]> {
    const teams = await this.teamRepository.getActiveMembers();
    return teams.map((team: any) => team.dataValues || team);
  }
}
