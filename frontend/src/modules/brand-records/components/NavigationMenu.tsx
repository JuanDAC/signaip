'use client';

import Link from 'next/link';
import React from 'react';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { useNavigationMenu } from '../hooks/useNavigationMenu';

export const NavigationMenu: React.FC = () => {
  const { menuItems, loading, isActive, hasActions, getActionPath } = useNavigationMenu();
  const { locale } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="space-y-2 sm:space-y-3">
      {menuItems.map((item) => {
        return (
          <div key={item.key} className="space-y-1 sm:space-y-2">
            {/* Enlace principal de la sección */}
            <Link
              href={`/${locale}/${item.path}`}
              className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg sm:text-xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">{item.title}</div>
                <div className="text-xs sm:text-sm text-gray-500 truncate">{item.description}</div>
              </div>
            </Link>

            {/* Submenús de acciones */}
            {hasActions(item) && (
              <div className="ml-4 sm:ml-8 space-y-1">
                {item.actions!.map((action) => {
                  const actionPath = getActionPath(item, action);
                  const isActionActive = isActive(actionPath);

                  return (
                    <Link
                      key={action.key}
                      href={actionPath}
                      className={`block px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        isActionActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-500 truncate">{action.description}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
