import { cn } from "@/lib/utils";

interface containerProps {
  className?: string;
  children: React.ReactNode;
}
const Container = ({ className, children }: containerProps) => {
  return (
    <div
      className={cn(
        "xl:max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
