import { cn } from "@/lib/utils";

interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HelperText({ children, className }: HelperTextProps) {
  return (
    <p className={cn("text-sm text-gray-500", className)}>
      {children}
    </p>
  );
}
