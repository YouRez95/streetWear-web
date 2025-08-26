import { useUserStore } from "@/store/userStore";
import DashboardSummaryHeader from "./DashboardSummaryHeader";
import RetardOrdersFaconnier from "./RetardOrdersFaconnier";

export default function Dashboard() {
  const { userData } = useUserStore();
  return (
    <div className="flex flex-col gap-10 min-h-[calc(100vh-100px)] bg-foreground rounded-t-xl w-full p-3">
      {userData?.role === "super admin" && (
        // <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <DashboardSummaryHeader />
        // </div>
      )}
      <div className="bg-foreground rounded-b-xl w-full">
        <RetardOrdersFaconnier />
      </div>
    </div>
  );
}
