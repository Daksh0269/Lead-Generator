import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    console.log("1. Connecting to DB in Miner...");
    await connectDB();
    
    console.log("2. Fetching search results from Serper.io...");
    const { query = 'site:lever.co OR site:greenhouse.io "Sales Development Representative" "remote"' } = await request.json().catch(() => ({}));

    const serperRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 10 }),
    });

    const serperData = await serperRes.json();
    
    // Catch Serper API key issues
    if (serperData.message || serperData.statusCode === 403) {
        throw new Error(`Serper API Error: ${serperData.message || "Invalid Key"}`);
    }

    const searchSnippets = serperData.organic?.map((res: any) => 
      `Title: ${res.title}\nLink: ${res.link}\nSnippet: ${res.snippet}`
    ).join("\n\n");

    if (!searchSnippets) {
        throw new Error("Serper returned no organic search results.");
    }

    console.log("3. Sending search text to Gemini 1.5 Flash for extraction...");
    const responseSchema = {
        type: Type.ARRAY,
        description: "List of extracted sales leads.",
        items: {
            type: Type.OBJECT,
            properties: {
                companyName: { type: Type.STRING },
                website: { type: Type.STRING },
                signalCategory: { type: Type.STRING },
                intentScore: { type: Type.INTEGER },
                aiJustification: { type: Type.STRING }
            },
            required: ["companyName", "website", "signalCategory", "intentScore", "aiJustification"]
        }
    };

    const prompt = `Extract sales leads from these search results. Score their intent to buy outbound sales services (0-100). High score for hiring sales roles or recent funding.\n\n${searchSnippets}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    console.log("4. Parsing structured JSON from Gemini...");
    const extractedLeads = JSON.parse(response.text || "[]");

    console.log(`5. Saving ${extractedLeads.length} AI-scored leads to MongoDB...`);
    if (extractedLeads.length > 0) {
      await Lead.insertMany(extractedLeads);
    }

    console.log("6. Pipeline Complete!");
    return NextResponse.json({ success: true, count: extractedLeads.length });

  } catch (error: any) {
    // This will catch exact API key failures or model errors
    console.error("🔥 FATAL ERROR IN POST /api/fetch-signals:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}