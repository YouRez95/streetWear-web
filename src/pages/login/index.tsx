import { useState } from "react";
import loginBg from "../../assets/icons/login.png";
import logo from "../../assets/icons/logo.png";
import { useUserStore } from "@/store/userStore";
import { authService } from "@/services/auth";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserDataAndIsLoggedIn } = useUserStore();

  const handleLoginUser: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const response = await authService.loginUser({ email, password });

    console.log("response from login", response);
    if (response.status === "failed") {
      const msg = Array.isArray(response.message)
        ? response.message[0]?.message || "Login failed"
        : response.message;
      setError(msg);
    }

    if (response.status === "success" && response.user) {
      setError("");
      setUserDataAndIsLoggedIn(response.user);
    }
  };

  return (
    <section className="flex bg-muted h-screen relative">
      <div className="absolute flex items-center left-4 top-4 gap-1">
        <img src={logo} alt="Logo" className="md:w-16 w-12 h-12 md:h-16" />
        <h1 className="font-bagel text-2xl md:text-3xl">StreetWear</h1>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col gap-2 md:gap-5  items-center lg:w-[60%] w-full max-w-[800px] justify-center bg-muted my-auto p-10 rounded-xl">
          <h1 className="text-3xl md:text-5xl font-bagel text-center">
            Welcome to your <br /> warehouse
          </h1>
          <form
            className="mt-4 flex flex-col w-full gap-4"
            onSubmit={handleLoginUser}
          >
            <input
              type="text"
              placeholder="Email"
              className="border p-2 rounded"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded mt-2"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-secondary text-white p-2 rounded mt-4 font-bagel"
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
      <div className="hidden items-center justify-center overflow-hidden flex-1 m-3 rounded-xl lg:flex">
        <img src={loginBg} alt="logo" className="object-cover w-full h-full" />
      </div>
    </section>
  );
}
