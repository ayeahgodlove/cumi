import User from "@data/entities/user";
import { RoleMapper, UserMapper } from "@presentation/mappers/mapper";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const roleMapper = new RoleMapper();
const userMapper = new UserMapper()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found!" });
    }
    // const userRoles = await user.$get("roles");
    // const rolesDTO = roleMapper.toDTOs(userRoles);
    // const userEntity: IUser = {
    //   ...user.toJSON<IUser>(),
    //   roles: rolesDTO,
    // };

    const hashedPassword = await bcrypt.compare(
      password,
      `${user.password}`
    );
    if (!hashedPassword) {
      return NextResponse.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, `${process.env.mysecretekey}`);

    return NextResponse.json({
      success: true,
      message: "Login Successfully!",
      data: {
        ...userMapper.toDTO(user),
        token,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Login Failed" + error.message,
      data: error,
    });
  }
}
