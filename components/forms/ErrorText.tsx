import { cn } from "@/lib/utils";

interface ErrorTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ErrorText({ children, className }: ErrorTextProps) {
  return (
    <p className={cn("text-sm text-red-500", className)} role="alert">
      {children}
    </p>
  );
}
