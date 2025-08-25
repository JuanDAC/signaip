'use client'
import { useState } from "react";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Botón de menú para mobile/tablet */}
      <button
        className="lg:hidden fixed top-5 -left-2 z-10 bg-[#df3253] text-white p-2 rounded-lg shadow-lg hover:bg-[#d01045] transition-colors cursor-pointer"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar responsive */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="fixed inset-0 z-40 lg:static lg:z-auto">
          {/* Overlay para mobile */}
          <div 
            className="fixed inset-0 bg-gradient-to-r from-[#df3253] to-[transparent] backdrop-blur-xs bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg lg:static lg:shadow-none">
            <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Brand Manager</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="Cerrar menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              {sidebar}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-0">
        {children}
      </div>
    </div>
  );
};
