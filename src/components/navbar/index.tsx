import defaultImage from "@/assets/placeholder-image/default-user.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import doubleArrowIcon from "@/assets/icons/double-arrow-icon.svg";
import logo from "@/assets/icons/logo.png";
import logoutIcon from "@/assets/icons/logout-icon.svg";
import settingsIcon from "@/assets/icons/settings-icon.svg";
import { cn, getImageUrl } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { navbarItems } from "@/constants";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
// import { Button } from '../ui/button'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { setLogout, userData } = useUserStore();
  const userName = userData?.name.substring(0, 19);
  const role = userData?.role;
  const userProfileImg = getImageUrl(userData?.imageUrl, "user");

  async function handleLogout() {
    const { status } = await authService.logoutUser();
    if (status === "success") {
      setLogout();
    }
  }

  return (
    <nav
      className={cn(
        "bg-background rounded-2xl h-[99vh] text-muted relative w-[300px]",
        !isOpen && "w-[85px]"
      )}
    >
      <div
        className="absolute top-[50%] -translate-y-1/2 -right-3 cursor-pointer rounded-full w-10 h-10 bg-background flex items-center justify-center z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={doubleArrowIcon}
          alt="double arrow"
          className={cn(
            "w-3 h-3 transition-all duration-300",
            !isOpen && "rotate-180"
          )}
        />
      </div>
      <div className="flex flex-col justify-between h-full">
        {/* Logo & user & menu */}
        <div className="space-y-10 m-3">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-16 h-16" />
            <h1 className={cn("font-bagel text-2xl", !isOpen && "hidden")}>
              StreetWear
            </h1>
          </div>
          {/* user */}
          <div
            className={cn(
              "flex items-center gap-2 bg-foreground/10 p-2 rounded-xl",
              !isOpen && "justify-center"
            )}
          >
            <div>
              <img
                src={userProfileImg}
                alt="Logo"
                className={cn(
                  "w-12 h-12 rounded-xl object-cover",
                  !isOpen && "w-8 h-8"
                )}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = defaultImage;
                }}
              />
            </div>
            <div className={cn("flex flex-col", !isOpen && "hidden")}>
              <h1 className="text-lg font-bagel text-muted">{userName}</h1>
              <p className="text-muted/50 text-sm">{role}</p>
            </div>
          </div>
          {/* menu */}
          <div>
            <p>Menu</p>
            <div className="space-y-4 mt-4">
              {navbarItems.map((item) => {
                return (
                  <NavLink
                    to={item.link}
                    key={item.id}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 py-3 px-2 bg-foreground/5 rounded-xl",
                        !isOpen && "justify-center scale-90",
                        isActive && "bg-muted text-background font-bold"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={cn(
                            "w-8 h-8 p-1 rounded-lg flex items-center justify-center",
                            isActive && "bg-secondary"
                          )}
                        >
                          <img
                            src={item.icon}
                            alt=""
                            className="object-cover"
                          />
                        </div>
                        <span className={cn("", !isOpen && "hidden")}>
                          {item.text}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
        {/* settings & logout */}
        <div className="m-3 space-y-4">
          <NavLink
            to={"settings"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 py-3 px-2 bg-foreground/5 rounded-xl",
                !isOpen && "justify-center",
                isActive && "bg-muted text-background font-bold"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "w-8 h-8 p-1 rounded-lg flex items-center justify-center",
                    isActive && "bg-secondary"
                  )}
                >
                  <img src={settingsIcon} alt="" className="object-cover" />
                </div>
                <span className={cn("", !isOpen && "hidden")}>Settings</span>
              </>
            )}
          </NavLink>

          <Button
            className={cn(
              " w-full flex justify-start rounded-xl px-2 py-6 text-foreground bg-foreground/15 hover:bg-muted group",
              !isOpen && "justify-center"
            )}
            onClick={handleLogout}
          >
            <div className="flex items-center gap-2">
              <img
                src={logoutIcon}
                alt=""
                className="w-8 h-8 p-1 rounded-lg flex items-center justify-center group-hover:bg-secondary"
              />
              <span
                className={cn(
                  "group-hover:text-background group-hover:font-bold",
                  !isOpen && "hidden"
                )}
              >
                Logout
              </span>
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
};
