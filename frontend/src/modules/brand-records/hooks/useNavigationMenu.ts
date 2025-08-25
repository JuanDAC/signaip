import { useTranslation } from "@/modules/shared/hooks/useTranslation";
import { getNavigationMenu } from '../../shared/i18n/routes';
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavigationAction {
  key: string;
  path: string;
  title: string;
  description: string;
}

interface NavigationItem {
  key: string;
  path: string;
  title: string;
  description: string;
  icon: string;
  actions?: NavigationAction[];
}

export const useNavigationMenu = () => {
    const { locale } = useTranslation();
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState<NavigationItem[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadMenu = async () => {
        try {
          const menu = await getNavigationMenu(locale);
          setMenuItems(menu);
        } catch (error) {
          console.error('Error loading navigation menu:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadMenu();
    }, [locale]);
  
    const isActive = (path: string) => pathname.includes(`/${locale}/${path}`);
  
    const hasActions = (item: NavigationItem) => item.actions && item.actions.length > 0;
  
    const getActionPath = (item: NavigationItem, action: NavigationAction) => `/${locale}/${item.path}/${action.path}`;
  
    return { menuItems, loading, isActive, hasActions, getActionPath };
  }