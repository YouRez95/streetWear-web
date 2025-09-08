import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryKeys as queryKeysClient } from "@/hooks/useClients";
import { queryKeys as queryKeysFaconnier } from "@/hooks/useFaconnier";
import { queryKeys } from "@/hooks/useUsers";
import { clientService } from "@/services/client";
import { faconnierService } from "@/services/faconnier";
import { userService } from "@/services/user";
// import { useUserStore } from '@/store/userStore'
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import TabClients from "./clientSettings/TabClients";
import TabFaconniers from "./faconnierSettings/TabFaconniers";
import TabSeasons from "./seasonSettings/TabSeasons";
import SettingsHeader from "./SettingsHeader";
import TabStylists from "./stylistSettings/TabStylists";
import TabUsers from "./userSettings/TabUsers";

export default function Settings() {
  const queryClient = useQueryClient();

  const TabsListItems = [
    { id: "Users", name: "Utilisateurs", content: <TabUsers /> },
    { id: "Stylists", name: "Stylists", content: <TabStylists /> },
    { id: "Faconniers", name: "Faconniers", content: <TabFaconniers /> },
    { id: "Clients", name: "Clients", content: <TabClients /> },
    { id: "Seasons", name: "Saisons", content: <TabSeasons /> },
  ];

  // Prefetch data for all tabs when component mounts
  useEffect(() => {
    // Prefetch Users data
    //console.log('Prefetching Users data')
    queryClient.prefetchQuery({
      queryKey: queryKeys.users(1, 10, ""),
      queryFn: () => userService.fetchUsers(1, 10, ""),
      staleTime: 30000, // 30 seconds
    });

    queryClient.prefetchQuery({
      queryKey: queryKeysFaconnier.faconniers(1, 10, ""),
      queryFn: () => faconnierService.fetchFaconniers(1, 10, ""),
      staleTime: 30000, // 30 seconds
    });

    queryClient.prefetchQuery({
      queryKey: queryKeysClient.clients(1, 10, ""),
      queryFn: () => clientService.fetchClients(1, 10, ""),
      staleTime: 30000, // 30 seconds
    });
  }, [queryClient]);

  return (
    <section className="h-screen w-full flex flex-col gap-4">
      <SettingsHeader />

      <div className="text-background flex-1">
        <Tabs
          defaultValue={TabsListItems[0]?.id}
          className="space-y-8 flex flex-col h-full"
        >
          <TabsList className="bg-transparent max-w-[700px] gap-7 text-background flex justify-start rounded-none py-0 w-full border-b border-b-background/20 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-background/20">
            {TabsListItems.map((item) => (
              <TabsTrigger
                key={item.id}
                className="flex-shrink-0 data-[state=active]:bg-transparent cursor-pointer text-background/50 data-[state=active]:border-b-[3px] data-[state=active]:border-b-background rounded-none data-[state=active]:font-bold text-lg data-[state=active]:text-background data-[state=active]:shadow-none"
                value={item.id}
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {TabsListItems.map((item) => (
            <TabsContent
              key={item.id}
              value={item.id}
              className="bg-foreground text-background rounded-xl border flex-1 space-y-10"
            >
              {item.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
