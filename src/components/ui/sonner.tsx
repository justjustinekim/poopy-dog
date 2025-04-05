
import React from "react"
import { Toaster as Sonner } from "sonner"
import { useMobile } from "@/hooks/use-mobile"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const isMobile = useMobile();
  
  return (
    <Sonner
      theme="system"
      className="toaster group"
      // Set more appropriate defaults for mobile
      position={isMobile ? "bottom-center" : "top-right"}
      closeButton={true}
      richColors={true}
      duration={4000}
      visibleToasts={isMobile ? 1 : 3}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
