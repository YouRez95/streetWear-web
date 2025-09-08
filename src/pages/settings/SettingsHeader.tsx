import { useGeneralSettings } from "@/hooks/useDashboard";
import { Building, Calendar, Scissors, User, Users } from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  users: <Users className="w-6 h-6 text-muted-foreground" />,
  faconniers: <Scissors className="w-6 h-6 text-muted-foreground" />,
  clients: <User className="w-6 h-6 text-muted-foreground" />,
  stylists: <Building className="w-6 h-6 text-muted-foreground" />,
  seasons: <Calendar className="w-6 h-6 text-muted-foreground" />,
};

type Stat = {
  key: "users" | "faconniers" | "clients" | "stylists" | "seasons";
  label: string;
  value: string | number;
  active?: string | number;
  inactive?: string | number;
};

export default function SettingsHeader() {
  const { data, isLoading } = useGeneralSettings();

  const stats: Stat[] = [
    {
      key: "users",
      label: "Utilisateurs",
      value: data?.settings?.users || 0,
    },
    {
      key: "faconniers",
      label: "Faconniers",
      value:
        (data?.settings?.faconnierActive || 0) +
        (data?.settings?.faconnierInactive || 0),
      active: data?.settings?.faconnierActive || 0,
      inactive: data?.settings?.faconnierInactive || 0,
    },
    {
      key: "clients",
      label: "Clients",
      value:
        (data?.settings?.clientsActive || 0) +
        (data?.settings?.clientsInactive || 0),
      active: data?.settings?.clientsActive || 0,
      inactive: data?.settings?.clientsInactive || 0,
    },
    {
      key: "stylists",
      label: "Stylists",
      value:
        (data?.settings?.stylistsActive || 0) +
        (data?.settings?.stylistsInactive || 0),
      active: data?.settings?.stylistsActive || 0,
      inactive: data?.settings?.stylistsInactive || 0,
    },
    {
      key: "seasons",
      label: "Saisons",
      value: data?.settings?.seasons || 0,
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full">
      {stats.map((stat, index) => {
        return (
          <div
            key={stat.key}
            className={`flex flex-col gap-2 bg-foreground rounded-lg p-3 shadow-sm border ${
              index === stats.length - 1
                ? "col-span-2 lg:col-span-2 xl:col-span-1"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-3 bg-secondary rounded-full">
                {iconMap[stat.key]}
              </div>
              <div className="flex flex-col gap-0">
                <p className="text-base text-primary/90">{stat.label}</p>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold font-bagel">
                    {stat.value}
                  </p>
                  {stat.active !== undefined && stat.inactive !== undefined && (
                    <div className="hidden md:flex items-center gap-1 p-1 px-3 rounded-full text-sm font-medium">
                      <div className="rounded-full p-1 flex flex-col items-center text-secondary">
                        <span className="text-xs">Active</span>
                        <span>{stat.active}</span>
                      </div>
                      <div className="rounded-full p-1 flex flex-col items-center text-destructive">
                        <span className="text-xs">Inactive</span>
                        <span>{stat.inactive}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
