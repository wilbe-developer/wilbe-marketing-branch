
import React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataRoomSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const DataRoomSection = ({
  title,
  children,
  className
}: DataRoomSectionProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <Separator className="mb-4" />
      <div>{children}</div>
    </div>
  );
};
