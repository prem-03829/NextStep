import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Navigate from frontend root to backend/data
    const filePath = path.join(process.cwd(), "..", "backend", "data", "college_data_final.json");
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Master data file not found at " + filePath }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read master database: " + error.message }, { status: 500 });
  }
}
