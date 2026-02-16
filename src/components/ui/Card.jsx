import { forwardRef } from "react";

const Card = forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`font-semibold leading-none tracking-tight text-slate-900 ${className}`} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`text-sm text-slate-500 ${className}`} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
