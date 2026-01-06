import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-gradient-to-r from-coral-500 to-coral-400 text-white hover:opacity-90 shadow-md shadow-coral-500/20 border-0":
              variant === "default",
            "border border-input hover:bg-accent hover:text-accent-foreground":
              variant === "outline",
            "hover:bg-black/5 text-brown-900": variant === "ghost",
            "text-primary underline-offset-4 hover:underline":
              variant === "link",
            "h-10 py-2 px-6": size === "default",
            "h-9 px-3 rounded-md": size === "sm",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
