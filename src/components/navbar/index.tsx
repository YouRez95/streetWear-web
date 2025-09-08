import defaultImage from "@/assets/placeholder-image/default-user.png";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/icons/logo.png";
import { cn, getImageUrl } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { navbarItems } from "@/constants";
import { authService } from "@/services/auth";
import { SettingsIcon } from "lucide-react";
import UserProfileDropDown from "./UserProfileDropDown";
import DropDownSeasons from "../header/dropDownSeasons";

export const Navbar = () => {
  const { setLogout, userData } = useUserStore();
  const userName = userData?.name.substring(0, 19);
  const role = userData?.role;
  const userProfileImg = getImageUrl(userData?.imageUrl, "user");

  async function handleLogout() {
    // TODO: add sonner
    const { status } = await authService.logoutUser();
    if (status === "success") {
      setLogout();
    }
  }

  return (
    <nav className=" w-full border-b">
      <div className="flex justify-between items-center px-5 py-0 lg:py-3">
        <div className="flex items-center gap-10 ">
          <Link className="flex items-center justify-start mb-1" to={"/"}>
            <img src={logo} alt="Logo" className="lg:w-10 w-12 lg:h-10 h-12" />
            <h1 className={cn("font-bagel text-xl hidden lg:flex")}>
              StreetWear
            </h1>
          </Link>
          <div className="lg:flex items-center gap-4 hidden">
            {navbarItems.map((item) => {
              return (
                <NavLink to={item.link} key={item.id}>
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "px-3 py-2",
                          isActive &&
                            "text-secondary bg-secondary/10 rounded-full font-medium"
                        )}
                      >
                        {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex ">
            <DropDownSeasons />
          </div>
          <NavLink to={"settings"}>
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "w-8 h-8 p-1 rounded-lg flex items-center justify-center",
                    isActive && "bg-secondary/10 text-secondary"
                  )}
                >
                  <SettingsIcon className="w-6 h-6" />
                </div>
              </>
            )}
          </NavLink>

          <UserProfileDropDown
            userName={userName}
            onLogout={handleLogout}
            role={role || ""}
          >
            <div className="cursor-pointer rounded-full w-8 h-8 overflow-hidden">
              <img
                src={userProfileImg}
                alt="Logo"
                className={cn("object-cover w-full h-full rounded-full")}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = defaultImage;
                }}
              />
            </div>
          </UserProfileDropDown>
        </div>
      </div>
    </nav>
  );
};
