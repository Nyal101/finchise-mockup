"use client";
import React, { useState } from "react";
import { VerticalNavBar } from "@/components/VerticalNavBar";
import { HorizontalNavBar } from "@/components/HorizontalNavBar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen">
      <VerticalNavBar 
        className="border-r bg-[#ffffff]"
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div className="flex-1 flex flex-col">
        <HorizontalNavBar activeSection={activeSection} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}