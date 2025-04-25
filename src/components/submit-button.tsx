"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText: string;
  text: ReactNode | string;
}

export default function SubmitButton({
  loadingText,
  text,
  className,
  variant = "default",
  ...props
}: Props & VariantProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      className={cn("flex items-center justify-center gap-2", className)}
      variant={variant}
      disabled={pending}
    >
      {pending ? loadingText : text}{" "}
      {pending && (
        <span className="animate-spin">
          <Loader2 />
        </span>
      )}
    </Button>
  );
}