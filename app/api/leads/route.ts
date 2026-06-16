import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    console.log("1. Attempting to connect to MongoDB...");
    await connectDB();
    console.log("2. MongoDB connected successfully!");

    console.log("3. Fetching leads from database...");
    const leads = await Lead.find({}).sort({ intentScore: -1 }).lean();
    
    console.log(`4. Successfully fetched ${leads.length} leads.`);
    return NextResponse.json(leads);
  } catch (error: any) {
    const message = typeof error?.message === "string" ? error.message : String(error ?? "Unknown error");
    console.error("🔥 FATAL ERROR IN GET /api/leads:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}