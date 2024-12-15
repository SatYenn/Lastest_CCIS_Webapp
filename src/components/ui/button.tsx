import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = "default", 
    size = "default", 
    asChild = false,
    isLoading = false,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
      // Scroll to top when button is clicked, unless it's specifically prevented
      if (!props['data-no-scroll']) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
      outline: "border border-red-200 bg-transparent hover:bg-red-100 focus-visible:ring-red-500",
      secondary: "bg-red-100 text-red-900 hover:bg-red-200 focus-visible:ring-red-500",
      ghost: "hover:bg-red-100 hover:text-red-900 focus-visible:ring-red-500",
      link: "text-red-900 underline-offset-4 hover:underline focus-visible:ring-red-500",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-50 cursor-wait",
          className
        )}
        ref={ref}
        onClick={handleClick}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };