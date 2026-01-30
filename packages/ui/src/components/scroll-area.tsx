"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both"
}

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  ...props
}: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full",
          orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
          orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
          orientation === "both" && "overflow-auto"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { ScrollArea }
