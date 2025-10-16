import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navbarItems } from "@/constants";
import { LogOut } from "lucide-react";
import { Badge } from "../ui/badge";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function UserProfileDropDown({
  children,
  userName,
  onLogout,
  role,
}: {
  children: React.ReactNode;
  userName: string | undefined;
  role: string | undefined;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const name = userName || "User";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span className="font-semibold font-bagel">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
          <Badge variant="default">{role}</Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Show navbar items only on small screens */}
        <div className="block xl:hidden">
          {navbarItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="flex items-center gap-2 p-0"
            >
              <NavLink
                to={item.link}
                className="w-full h-full"
                onClick={() => setOpen(false)}
              >
                {({ isActive }) => (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded py-2 px-3 ",
                      isActive && "text-secondary bg-secondary/10 font-medium"
                    )}
                  >
                    <img src={item.icon} alt="" className="w-4 h-4" />
                    <span>{item.text}</span>
                  </div>
                )}
              </NavLink>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {/* Logout in mobile dropdown */}
          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 text-black" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>

        <div className="hidden xl:block">
          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
