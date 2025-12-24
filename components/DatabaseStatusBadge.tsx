
import { Badge } from "@/components/ui/badge";
import { dbConnectionStatus } from "@/lib/connection-status";

export async function DatabaseStatusBadge() {
  const dbStatus = await dbConnectionStatus();
  
  return (
    <Badge
      variant={dbStatus === "Database connected" ? "default" : "destructive"}
      className="px-3 py-1 text-xs whitespace-nowrap rounded-md"
    >
      {dbStatus}
    </Badge>
  )
}