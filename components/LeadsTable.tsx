"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LeadsTable({ leads }: { leads: any[] }) {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Signal Category</TableHead>
              <TableHead className="text-center">Intent Score</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">
                  {lead.companyName}
                  <div className="text-xs text-gray-400">{lead.website || "No website"}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{lead.signalCategory}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(lead.intentScore)}`}>
                    {lead.intentScore} / 100
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                    View AI Insights
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* AI Insights Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLead?.companyName} - AI Analysis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500">Why did AI score this a {selectedLead?.intentScore}?</h4>
              <p className="mt-2 text-sm text-gray-800">{selectedLead?.aiJustification}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}