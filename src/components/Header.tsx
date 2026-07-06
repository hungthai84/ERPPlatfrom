import { useState } from 'react';
import { 
  Play, 
  ChevronDown, 
  Sparkles, 
  Bell, 
  HelpCircle, 
  User, 
  X, 
  BookOpen, 
  CheckCircle2,
  Filter,
  MoreVertical,
  Search
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { motion } from 'motion/react';

interface HeaderProps {
  businessProfile: BusinessProfile;
  onChangeProfile: (profile: Partial<BusinessProfile>) => void;
  currentTabInfo?: {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
  };
}

export default function Header({ businessProfile, currentTabInfo }: HeaderProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  
  const Icon = currentTabInfo?.icon || LayoutDashboard;

  return (
    <div className="px-6 pt-4 pb-2 font-sans z-40 relative">
      <div className="bg-white dark:bg-slate-900/70 backdrop-blur-md border border-white/50 shadow-sm rounded-[10px] p-4 flex flex-col gap-4">
        
        {/* Top Row: Title & Main Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={currentTabInfo?.id}
              className="w-10 h-10 rounded-lg bg-blue-50/80 flex items-center justify-center border border-blue-100/50"
            >
              <Icon className="w-5 h-5 text-blue-600" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                {currentTabInfo?.title || 'Power Service'}
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {currentTabInfo?.subtitle || 'Quản lý thông tin & dữ liệu'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/60 shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Tài liệu hướng dẫn</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 shadow-md text-white text-xs font-semibold hover:shadow-lg transition group"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin" />
              <span>AI Trợ lý</span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Row: Search & Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhanh (Ctrl + K)..." 
              className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800/60 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/60 shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
              <Filter className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span>Bộ lọc</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/60 shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span>Tính năng</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/60 shadow-sm flex items-center justify-center hover:bg-gray-50 transition">
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <h3 className="font-bold text-sm">Tài liệu hướng dẫn</h3>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowTutorial(false)} className="hover:bg-white dark:bg-slate-900/20 p-1 rounded transition text-white">
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-gray-600 dark:text-gray-300">
              <p>Chào mừng bạn đến với Power Service AI Studio. Đây là không gian làm việc hiện đại dựa trên Fluent UI v9.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sử dụng thanh công cụ bên trái để điều hướng.</li>
                <li>Hệ thống lưu trữ dữ liệu hoàn toàn bảo mật trên bộ nhớ cục bộ.</li>
                <li>Bạn có thể tùy chỉnh hình nền, giao diện trong phần Cài đặt.</li>
              </ul>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <motion.button whileTap={{ scale: 0.95 }} 
                onClick={() => setShowTutorial(false)}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Đóng
              </motion.button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-bold text-sm">Trợ lý AI</h3>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAiModal(false)} className="hover:bg-white dark:bg-slate-900/20 p-1 rounded transition text-white">
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-gray-600 dark:text-gray-300">
              <p>AI đang phân tích dữ liệu của bạn...</p>
              <div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <motion.button whileTap={{ scale: 0.95 }} 
                onClick={() => setShowAiModal(false)}
                className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition"
              >
                Đóng
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
