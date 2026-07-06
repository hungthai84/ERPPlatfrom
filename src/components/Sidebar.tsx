import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Coins, 
  ShoppingCart, 
  ShoppingBag, 
  Warehouse, 
  Layers, 
  FolderTree, 
  Percent, 
  TrendingUp, 
  Scale, 
  Settings,
  Bell,
  UserCircle,
  ChevronRight,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  opacity?: number;
}

export default function Sidebar({ currentTab, onTabChange, opacity = 100 }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const menuItems = [
    { id: 'overview', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'duan', name: 'Dự án', icon: Briefcase },
    { id: 'thuchi', name: 'Thu chi', icon: Coins },
    { id: 'banhang', name: 'Bán hàng', icon: ShoppingCart },
    { id: 'muahang', name: 'Mua hàng', icon: ShoppingBag },
    { id: 'kho', name: 'Kho', icon: Warehouse },
    { id: 'tonghop', name: 'Tổng hợp', icon: Layers },
    { id: 'danhmuc', name: 'Danh mục', icon: FolderTree },
    { id: 'thue', name: 'Thuế', icon: Percent },
    { id: 'baocao', name: 'Báo cáo', icon: TrendingUp },
    { id: 'sodu', name: 'Số dư đầu kỳ', icon: Scale },
  ];

  const handleMenuClick = (id: string) => {
    onTabChange(id);
    setActivePopup(null);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 72 : 250 }}
      transition={{ duration: 0.3, ease: 'circOut' }}
      className="relative h-full border-r border-gray-200/50 dark:border-slate-800/50 flex flex-col font-sans bg-white dark:bg-slate-900/95 dark:bg-slate-900/95"
      style={{ backgroundColor: `rgba(var(--bg-rgb, 255, 255, 255), ${opacity / 100})` }}
    >
      {/* Toggle Button */}
      <motion.button whileTap={{ scale: 0.95 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 z-50 transition-transform"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
        )}
      </motion.button>

      {/* Top: Logo */}
      <div className="flex-none pt-6 pb-4 flex flex-col items-center justify-center">
        <motion.button whileTap={{ scale: 0.95 }} 
          onClick={() => onTabChange('overview')}
          className="flex items-center justify-center w-full px-2"
        >
          <img 
            src="https://i.ibb.co/GvcmMgD3/Logo-Tr-ng.png" 
            alt="Power Service"
            className="w-10 h-10 object-contain drop-shadow-sm transition-transform hover:scale-105"
          />
          {!isCollapsed && (
            <span className="ml-3 font-bold text-lg text-gray-900 dark:text-white tracking-tight whitespace-nowrap overflow-hidden">
              Power Service
            </span>
          )}
        </motion.button>
      </div>

      {/* Center: Main Menu */}
      <div className="flex-1 flex flex-col justify-center py-4 w-full relative">
        <div className="space-y-1.5 px-3">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="relative group">
                <motion.button whileTap={{ scale: 0.95 }}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center h-10 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50/50 dark:bg-blue-900/30 text-blue-600 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:text-white'
                  } ${isCollapsed ? 'justify-center' : 'px-3'}`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </motion.button>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Footer Menu */}
      <div className="flex-none pb-6 px-3 space-y-1.5">
        <motion.button whileTap={{ scale: 0.95 }} className={`w-full flex items-center h-10 rounded-lg transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:text-white ${isCollapsed ? 'justify-center' : 'px-3'}`}>
          <Bell className="w-5 h-5 text-gray-400" />
          {!isCollapsed && <span className="ml-3 text-sm font-medium whitespace-nowrap">Thông báo</span>}
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} 
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center h-10 rounded-lg transition-all duration-200 ${
            currentTab === 'settings' 
              ? 'bg-blue-50/50 dark:bg-blue-900/30 text-blue-600 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:text-white'
          } ${isCollapsed ? 'justify-center' : 'px-3'}`}
        >
          <Settings className={`w-5 h-5 ${currentTab === 'settings' ? 'text-blue-600' : 'text-gray-400'}`} />
          {!isCollapsed && <span className="ml-3 text-sm font-medium whitespace-nowrap">Cài đặt</span>}
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className={`w-full flex items-center h-10 rounded-lg transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:text-white ${isCollapsed ? 'justify-center' : 'px-3'}`}>
          <UserCircle className="w-5 h-5 text-gray-400" />
          {!isCollapsed && <span className="ml-3 text-sm font-medium whitespace-nowrap">Tài khoản</span>}
        </motion.button>
      </div>
    </motion.div>
  );
}
