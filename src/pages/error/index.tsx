import { Button } from "@/components/ui/button";
import { FlagIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <FlagIcon className="w-20 h-20 mx-auto" />
        <p className="mt-10 text-3xl leading-snug md:text-4xl">
          Error 404 <br /> It looks like something went wrong.
        </p>
        <p className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          Please try refreshing the page or come back later.
        </p>

        <Button
          className="w-full px-4 md:w-[8rem]"
          onClick={() => navigate("/")}
        >
          back home
        </Button>
      </div>
    </div>
  );
}
