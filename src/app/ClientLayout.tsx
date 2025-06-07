"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { VerticalNavBar } from "@/components/VerticalNavBar";
import { HorizontalNavBar } from "@/components/HorizontalNavBar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(true);
  const pathname = usePathname();

  // Update active section based on current path
  useEffect(() => {
    if (pathname.startsWith("/payroll")) {
      setActiveSection("payroll");
    } else if (pathname.startsWith("/accounting")) {
      setActiveSection("accounting");
    } else if (pathname.startsWith("/insights")) {
      setActiveSection("insights");
    } else if (pathname.startsWith("/settings")) {
      setActiveSection("settings");
    } else if (pathname.startsWith("/dashboard")) {
      setActiveSection("dashboard");
    }
  }, [pathname]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleNavCollapseChange = (collapsed: boolean) => {
    setIsNavCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen pt-12">
      <HorizontalNavBar activeSection={activeSection} />
      <VerticalNavBar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onCollapseChange={handleNavCollapseChange}
      />
      <div 
        className={`transition-all duration-300 ease-in-out pt-2 ${isNavCollapsed ? 'ml-20' : 'ml-60'}`}
      >
        <main className="p-6 pt-3">
          {children}
        </main>
      </div>
    </div>
  );
}