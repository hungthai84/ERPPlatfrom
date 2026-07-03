import React from 'react';
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
  Settings 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const baseMenu = [
    { id: 'overview', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'thuchi', name: 'Thu chi', icon: Coins },
    { id: 'banhang', name: 'Bán hàng', icon: ShoppingCart },
    { id: 'muahang', name: 'Mua hàng', icon: ShoppingBag },
    { id: 'kho', name: 'Kho', icon: Warehouse },
  ];

  const advancedMenu = [
    { id: 'tonghop', name: 'Tổng hợp', icon: Layers },
    { id: 'danhmuc', name: 'Danh mục', icon: FolderTree },
    { id: 'thue', name: 'Thuế', icon: Percent },
    { id: 'baocao', name: 'Báo cáo', icon: TrendingUp },
    { id: 'sodu', name: 'Số dư đầu kỳ', icon: Scale },
  ];

  const renderMenuItem = (item: { id: string; name: string; icon: React.ComponentType<{ className?: string }> }) => {
    const isActive = currentTab === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        id={`sidebar-item-${item.id}`}
        onClick={() => onTabChange(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive 
            ? 'bg-[#eaf4f0] text-[#0a8251]' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#0a8251]' : 'text-gray-400'}`} />
        <span>{item.name}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen sticky top-0 font-sans">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-2 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-[#0a8251] flex items-center justify-center text-white font-bold text-lg shadow-sm">
          F
        </div>
        <div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Fintab</span>
          <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-semibold uppercase">Hộ kinh doanh</span>
        </div>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Cơ bản</h3>
          <div className="space-y-1">
            {baseMenu.map(renderMenuItem)}
          </div>
        </div>

        <div>
          <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nâng cao</h3>
          <div className="space-y-1">
            {advancedMenu.map(renderMenuItem)}
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-gray-50 bg-gray-50/50">
        <button
          id="sidebar-item-settings"
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            currentTab === 'settings' 
              ? 'bg-[#eaf4f0] text-[#0a8251]' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className={`w-5 h-5 ${currentTab === 'settings' ? 'text-[#0a8251]' : 'text-gray-400'}`} />
          <span>Cấu hình</span>
        </button>
      </div>
    </aside>
  );
}
