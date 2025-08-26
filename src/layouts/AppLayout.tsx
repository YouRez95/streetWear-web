import Header from "@/components/header";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type LayoutProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

export const AppLayout = ({ children, className, ...props }: LayoutProps) => {
  return (
    <main
      className={cn("flex flex-row h-screen bg-muted", className)}
      {...props}
    >
      {children}
    </main>
  );
};

export const Sidebar = ({ className, children, ...props }: LayoutProps) => {
  return (
    <aside className={cn("m-1", className)} {...props}>
      {children}
    </aside>
  );
};

export const Content = ({ children, className, ...props }: LayoutProps) => (
  <div className={cn("flex-1 overflow-auto", className)} {...props}>
    {children}
  </div>
);

export const ContentHeader = ({
  className,
  ...props
}: Omit<LayoutProps, "children">) => {
  // const { theme, toggleTheme } = useTheme()

  return (
    <div
      className={cn("flex w-full h-[80px]  rounded-xl", className)}
      {...props}
    >
      <Header />
    </div>
  );
};
