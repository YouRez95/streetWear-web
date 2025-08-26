import spinner from "@/assets/icons/dot-revolve.svg";
export const LoadingSuspense = () => {
  return (
    <div className="w-[300px] h-[300px] flex items-center justify-center">
      <img src={spinner} alt="" className="w-10 h-10" />
    </div>
  );
};
