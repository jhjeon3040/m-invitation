import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-brown-900", className)}
      {...props}
    >
      {children}
      {required && <span className="text-coral-500 ml-1">*</span>}
    </label>
  );
}
