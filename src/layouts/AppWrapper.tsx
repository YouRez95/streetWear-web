import { LoadingSuspense } from "@/components/loading";
import Login from "@/pages/login";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export const AppWrapper = () => {
  const { isLoggedIn, setUserDataAndIsLoggedIn, setLogout } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;

      const auth_token = localStorage.getItem("auth_token");
      if (userData && auth_token) {
        setUserDataAndIsLoggedIn(userData);
      } else {
        setLogout();
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSuspense />
      </div>
    );
  }

  return isLoggedIn && !loading ? <Outlet /> : <Login />;
};
