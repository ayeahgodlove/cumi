import { NextRequest, NextResponse } from "next/server";
import { TeamUseCase } from "@domain/usecases/team.usecase";
import { TeamRepository } from "@data/repositories/team.repository";
import { teamMapper } from "@presentation/mappers/team.mapper";

const teamUseCase = new TeamUseCase(new TeamRepository());

export async function GET(request: NextRequest) {
  try {
    const teams = await teamUseCase.getAll();
    const teamsMapped = teamMapper.toDTOs(teams as any);
    return NextResponse.json(teamsMapped);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const team = await teamUseCase.create(body);
    const teamDTO = teamMapper.toDTO(team as any);
    return NextResponse.json(teamDTO, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

