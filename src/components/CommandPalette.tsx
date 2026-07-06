import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutDashboard, Briefcase, Coins, ShoppingCart, ShoppingBag, Warehouse, Layers, FolderTree, Percent, TrendingUp, Scale, Settings, Bot, ArrowRight, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands = [
    { id: 'overview', title: 'Tổng quan', icon: LayoutDashboard, type: 'nav' },
    { id: 'duan', title: 'Dự án & Công việc', icon: Briefcase, type: 'nav' },
    { id: 'thuchi', title: 'Thu chi', icon: Coins, type: 'nav' },
    { id: 'banhang', title: 'Bán hàng', icon: ShoppingCart, type: 'nav' },
    { id: 'muahang', title: 'Mua hàng', icon: ShoppingBag, type: 'nav' },
    { id: 'kho', title: 'Kho', icon: Warehouse, type: 'nav' },
    { id: 'tonghop', title: 'Tổng hợp', icon: Layers, type: 'nav' },
    { id: 'danhmuc', title: 'Danh mục', icon: FolderTree, type: 'nav' },
    { id: 'thue', title: 'Thuế', icon: Percent, type: 'nav' },
    { id: 'baocao', title: 'Báo cáo', icon: TrendingUp, type: 'nav' },
    { id: 'sodu', title: 'Số dư đầu kỳ', icon: Scale, type: 'nav' },
    { id: 'settings', title: 'Cài đặt', icon: Settings, type: 'nav' },
    { id: 'ai_report', title: 'Tạo báo cáo AI', icon: Bot, type: 'ai' },
    { id: 'ai_analyze', title: 'Phân tích dữ liệu', icon: Bot, type: 'ai' },
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: any) => {
    if (cmd.type === 'nav') {
      onNavigate(cmd.id);
    } else {
      // Stub AI command
      alert('AI Command Triggered: ' + cmd.title);
    }
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"
          />
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 pointer-events-auto"
            >
              <div className="flex items-center border-b border-gray-100 dark:border-slate-800 px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  autoFocus
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm kiếm chức năng, dữ liệu, hoặc ra lệnh cho AI..."
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 text-sm font-medium"
                />
                <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommands.map(cmd => (
                      <button 
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${cmd.type === 'ai' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                            <cmd.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{cmd.title}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{cmd.type === 'nav' ? 'Điều hướng' : 'Lệnh AI'}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-500 font-medium">Không tìm thấy kết quả phù hợp cho "{query}"</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 dark:border-slate-800 p-3 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Duyệt qua các lựa chọn</span>
                <span>Nhấn Esc để đóng</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
