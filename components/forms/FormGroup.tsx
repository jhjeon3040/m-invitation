import { cn } from "@/lib/utils";

interface FormGroupProps {
  children: React.ReactNode;
  error?: boolean;
  className?: string;
}

export function FormGroup({ children, error, className }: FormGroupProps) {
  return (
    <div className={cn("space-y-2", error && "has-error", className)}>
      {children}
    </div>
  );
}
