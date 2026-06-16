"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LeadsTable from "@/components/LeadsTable";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mining, setMining] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      
      // CRITICAL FIX: Check if data is actually an array before setting it
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        console.error("API returned an error instead of an array:", data);
        setLeads([]); // Fallback to an empty array so the app doesn't crash
      }
    } catch (err) {
      console.error("Network error:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const triggerMiningPipeline = async () => {
    setMining(true);
    await fetch("/api/fetch-signals", { method: "POST" });
    await fetchLeads(); // Refresh table after mining
    setMining(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">High-Intent Leads</h1>
            <p className="text-gray-500 text-sm">Prioritized by AI based on public growth signals.</p>
          </div>
          <Button onClick={triggerMiningPipeline} disabled={mining}>
            {mining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {mining ? "Mining Web Signals..." : "Run AI Miner"}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-md shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            <p className="text-gray-500 mt-1">Click "Run AI Miner" to scan the web for new signals.</p>
          </div>
        ) : (
          <LeadsTable leads={leads} />
        )}
      </main>
    </div>
  );
}