'use client'
import { NavigationMenu } from "@/modules/brand-records/components/NavigationMenu";
import Image from "next/image";

export const Sidebar = () => {
  return (
    <aside className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <Image 
          src="https://www.signaip.com/_next/image?url=%2Fnavbar%2Flogo.png&w=384&q=75" 
          alt="Brand Manager" 
          width={200} 
          height={100} 
          className="w-full max-w-[200px] h-auto"
        />
      </div>
      <NavigationMenu />
    </aside>
  );
};
