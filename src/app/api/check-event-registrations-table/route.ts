import { NextRequest, NextResponse } from "next/server";
import sequelize from "@database/db-sequelize.config";

export async function GET(request: NextRequest) {
  try {
    // Check if event_registrations table exists
    const [results] = await sequelize.query("SHOW TABLES LIKE 'event_registrations'");
    
    if (results.length === 0) {
      return NextResponse.json({
        exists: false,
        message: "event_registrations table does not exist"
      });
    }

    // Check table structure
    const [columns] = await sequelize.query("DESCRIBE event_registrations");
    
    return NextResponse.json({
      exists: true,
      columns: columns,
      message: "event_registrations table exists"
    });
  } catch (error: any) {
    return NextResponse.json({
      exists: false,
      error: error.message,
      message: "Error checking table"
    }, { status: 500 });
  }
}
