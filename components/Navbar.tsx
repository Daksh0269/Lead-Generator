import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-blue-600" fill="currentColor" />
        <span className="text-xl font-bold tracking-tight text-gray-900">IntentBot v1</span>
      </div>
      <div className="text-sm text-gray-500 font-medium">Internal Sales Tool</div>
    </nav>
  );
}