# ⚡ IntentBot V1: AI-Powered Lead Intelligence

> A proof-of-concept internal dashboard that automates the discovery and intent-scoring of B2B sales leads using public web signals.

🌍 **Live Demo:** [IntentBot V1 Deployment](https://lead-generator-5gfefcbfb-dakshs-projects-f412be2f.vercel.app/)

---

## 🧠 The Architecture (V1)

For this POC, execution speed, deterministic AI integration, and UI usability were prioritized over building complex, brittle web scrapers. The pipeline is designed to be fast, reliable, and entirely serverless.

* **Ingestion (Serper.io API):** Bypasses CAPTCHAs and rate limits to instantly retrieve structured, real-time search snippets for high-intent signals (e.g., *"recently raised Series A"*, *"hiring SDRs"*).
* **AI Engine (Groq/Llama 3 & Gemini):** Configured with strict JSON-schema outputs to act as a digital analyst. It reads unstructured web text, extracts the company, and deterministically calculates an `intentScore` (0-100) based on the evidence.
* **Database (MongoDB Atlas):** Serverless persistence via Next.js API route handlers to store leads and their AI-generated justifications securely.
* **Frontend (Next.js App Router):** A clean, reactive data-table experience built with Tailwind CSS and Shadcn UI, featuring Sonner for fluid asynchronous toast notifications.

---

## 🚀 Why this approach? (The Tradeoffs)

Building manual web scrapers for platforms like LinkedIn or Crunchbase is notoriously slow, violates TOS, and requires constant maintenance whenever DOM structures change. 

By combining a robust Search API with an LLM's natural language processing capabilities, this project creates a deterministic pipeline that reads unstructured web text and outputs structured, scored database rows. This architectural choice allowed for the rapid shipping of a fully functional, end-to-end scoring engine while maintaining high data quality and avoiding scraper maintenance overhead.

---

## 🔮 V2 Roadmap (What's Next)

Transitioning this from a Proof of Concept to a Production-ready tool involves the following immediate milestones:

1.  **Agentic Validation (LangGraph):** Instead of scoring purely off search snippets, deploy an autonomous agent to visit the extracted company's URL, read their live "Careers" or "About" page, and self-correct the intent score to eliminate false positives.
2.  **Contact Enrichment:** Integrate the Apollo.io or Hunter.io API to automatically fetch the email addresses of the "Head of Sales" or "CEO" for leads scoring `>80`.
3.  **Zero-Touch Automation:** Move the `/api/fetch-signals` endpoint to a Vercel Cron Job that runs nightly. Sales reps will wake up to fresh leads waiting in the dashboard without clicking a button, and Slack webhooks will alert the team of any lead scoring `>95`.

---

## 💻 Local Setup

To run this project locally, follow these steps:

**1. Clone the repository and install dependencies:**
```bash
git clone <your-repo-url>
cd intentbot
npm install