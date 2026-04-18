import { Loader2 } from "lucide-react";

export default function GameLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  );
}
