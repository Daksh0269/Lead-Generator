IntentBot V1: AI-Powered Lead Intelligence ⚡
A proof-of-concept internal dashboard that automates the discovery and intent-scoring of B2B sales leads using public web signals.

🌍 Live Demo: IntentBot V1 Deployment

🧠 The Architecture (V1)
For this POC, I prioritized execution speed, deterministic AI integration, and UI usability over building complex, brittle web scrapers.

Ingestion (Serper.io API): Bypasses CAPTCHAs and rate limits to instantly retrieve structured, real-time search snippets for high-intent signals (e.g., "recently raised Series A", "hiring SDRs").

AI Engine (Groq/Llama 3 & Gemini): Configured with strict JSON-schema outputs to act as an analyst. It reads unstructured web text, extracts the company, and deterministically calculates an intentScore (0-100) based on the evidence.

Database (MongoDB Atlas): Serverless persistence via Next.js API route handlers to store leads and their AI-generated justifications.

Frontend (Next.js App Router): A clean, reactive data-table experience built with Tailwind CSS, Shadcn UI, and Sonner for asynchronous toast notifications.

🚀 Why this approach? (The Tradeoffs)
Building manual web scrapers for platforms like LinkedIn or Crunchbase is slow, violates TOS, and requires constant maintenance when DOM structures change.

By combining a robust Search API with an LLM's natural language processing, I created a deterministic pipeline that reads unstructured web text and outputs structured, scored database rows. This allowed me to ship a fully functional, end-to-end scoring engine rapidly while maintaining high data quality.

🔮 V2 Roadmap (What's Next)
If I were to take this from POC to Production, here is the immediate roadmap:

Agentic Validation (LangGraph): Instead of scoring purely off search snippets, deploy an autonomous agent to visit the extracted company's URL, read their live "Careers" or "About" page, and self-correct the intent score to eliminate false positives.

Contact Enrichment: Integrate the Apollo.io or Hunter.io API to automatically fetch the email addresses of the "Head of Sales" or "CEO" for leads scoring >80.

Zero-Touch Automation: Move the /api/fetch-signals endpoint to a Vercel Cron Job that runs nightly. Sales reps would wake up to fresh leads waiting in the dashboard without clicking a button, and Slack webhooks would alert the team of any lead scoring >95.

💻 Local Setup
To run this project locally:

Clone the repository and install dependencies:

Bash
npm install
Create a .env.local file in the root directory and add your keys:

Code snippet
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_key
SERPER_API_KEY=your_serper_key
Start the development server:

Bash
npm run dev
Navigate to http://localhost:3000 to view the dashboard and run the AI Miner.