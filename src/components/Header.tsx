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
  CheckCircle2 
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface HeaderProps {
  businessProfile: BusinessProfile;
  onChangeProfile: (profile: Partial<BusinessProfile>) => void;
}

export default function Header({ businessProfile }: HeaderProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 font-sans">
      {/* Left side: Business Info / Quick Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <BookOpen className="w-4 h-4 text-[#0a8251]" />
          <span className="text-xs text-gray-500 font-medium">Chế độ sổ sách:</span>
          <span className="text-xs text-gray-800 font-semibold bg-green-50 px-1.5 py-0.5 rounded text-[#0a8251]">
            TT 88/2021/TT-BTC
          </span>
        </div>
      </div>

      {/* Right side: Actions, Dropdown, User */}
      <div className="flex items-center gap-4">
        {/* Tutorial Button */}
        <button
          id="btn-tutorial"
          onClick={() => setShowTutorial(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <Play className="w-3 h-3 text-[#0a8251] fill-[#0a8251]" />
          <span>Hướng dẫn</span>
        </button>

        {/* Selected Business Profile Dropdown */}
        <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer transition">
          <div className="w-2 h-2 rounded-full bg-[#0a8251]"></div>
          <span className="text-xs font-bold text-gray-800">{businessProfile.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-gray-200"></div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* AI Helper Trigger */}
          <button
            id="btn-ai-helper"
            onClick={() => setShowAiModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-50 text-purple-600 transition relative group"
            title="Trợ lý thuế & tài chính Fintab AI"
          >
            <Sparkles className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Trigger */}
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0a8251] rounded-full"></span>
          </button>

          {/* Help Center */}
          <button
            id="btn-help"
            onClick={() => setShowTutorial(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-gray-900">{businessProfile.representative}</span>
            <span className="text-[10px] text-gray-500">{businessProfile.mst}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a8251] to-emerald-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            H
          </div>
        </div>
      </div>

      {/* 1. Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-[#0a8251] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                <h3 className="font-bold text-sm">Hướng dẫn sử dụng Sổ sách Hộ kinh doanh</h3>
              </div>
              <button onClick={() => setShowTutorial(false)} className="hover:bg-white/20 p-1 rounded transition text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-gray-600 leading-relaxed">
                Chào mừng bạn đến với Fintab! Phần mềm hỗ trợ kê khai thuế và hạch toán cho các hộ kinh doanh cá thể theo chế độ sổ sách chứng từ của <strong>Thông tư 88/2021/TT-BTC</strong> và nộp thuế theo <strong>Thông tư 40/2021/TT-BTC</strong>.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide border-b pb-1">Các bước hạch toán chính:</h4>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#eaf4f0] text-[#0a8251] flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Cấu hình thông tin Hộ kinh doanh</p>
                    <p className="text-[11px] text-gray-500">Khai báo mã số thuế, địa chỉ và đại diện hợp pháp ở tab <strong>Cấu hình</strong>.</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#eaf4f0] text-[#0a8251] flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Đăng ký Danh mục Vật tư, Hàng hóa</p>
                    <p className="text-[11px] text-gray-500">Khai báo hàng hóa và gán phân nhóm biểu thuế (Circular 40) tại tab <strong>Danh mục</strong>.</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#eaf4f0] text-[#0a8251] flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Ghi nhận Hóa đơn bán hàng & Mua hàng</p>
                    <p className="text-[11px] text-gray-500">Phần mềm tự động trích quỹ tài chính, ghi giảm tồn kho vật tư và tích hợp doanh thu thuế.</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#eaf4f0] text-[#0a8251] flex items-center justify-center text-xs font-bold shrink-0">4</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Báo cáo & Tờ khai thuế</p>
                    <p className="text-[11px] text-gray-500">Vào tab <strong>Thuế</strong> để nhận bảng phân bổ thuế môn bài, thuế GTGT & TNCN ước tính theo quý một cách chính xác.</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-yellow-800 leading-relaxed">
                  <strong>Mẹo:</strong> Tất cả dữ liệu của bạn được lưu hoàn toàn cục bộ trên trình duyệt thông qua <code>localStorage</code>. Dữ liệu sẽ được bảo toàn khi tải lại trang!
                </p>
              </div>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="px-4 py-1.5 bg-[#0a8251] text-white text-xs font-bold rounded-lg hover:bg-[#075f3b] transition"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Notifications Drawer/Popup */}
      {showNotifications && (
        <div className="absolute right-24 top-14 bg-white border border-gray-100 rounded-xl shadow-xl w-80 py-2 z-50 animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900">Thông báo từ hệ thống</span>
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">Mới</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
            <div className="p-3.5 hover:bg-gray-50 transition cursor-pointer">
              <p className="text-xs font-bold text-gray-800">Chu kỳ kê khai thuế Quý 3/2026</p>
              <p className="text-[10px] text-gray-500 mt-1">Chu kỳ thuế kết thúc vào 30/09/2026. Hãy rà soát lại sổ quỹ và xuất hóa đơn đúng hạn.</p>
            </div>
            <div className="p-3.5 hover:bg-gray-50 transition cursor-pointer">
              <p className="text-xs font-medium text-gray-800">Cấu hình doanh nghiệp hoàn tất</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Hộ kinh doanh {businessProfile.name} đã được khởi tạo dữ liệu mẫu thành công.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI Smart Modal (Tax / Financial Insights) */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-[#0a8251] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-200 fill-purple-100" />
                <h3 className="font-bold text-sm">Gợi ý phân tích thông minh - Fintab AI</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="hover:bg-white/20 p-1 rounded transition text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-900">Phân tích Thuế & Dòng tiền hiện tại</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Hệ thống nhận thấy hộ kinh doanh <strong className="text-[#0a8251]">{businessProfile.name}</strong> có doanh số bán lẻ gỗ chiếm tỷ trọng chính (Hàng hóa - thuế 1.5%). Bạn có một số khoản dịch vụ đi kèm lắp đặt (thuế 7%).
                  </p>
                </div>
              </div>

              <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 space-y-3 text-xs text-purple-950">
                <p className="font-bold">💡 Đề xuất tối ưu hóa tài chính của AI:</p>
                <ul className="list-disc pl-4 space-y-2 text-[11px] text-purple-900">
                  <li><strong>Tách bạch dịch vụ:</strong> Hãy cố gắng tách tiền lắp đặt riêng và tiền bán hàng gỗ riêng trên hóa đơn bán hàng. Tránh gộp chung cả gói lắp đặt vào tiền bán hàng nếu đơn lắp đặt có tỷ suất lợi nhuận cao.</li>
                  <li><strong>Cân đối Sổ quỹ:</strong> Sổ quỹ tiền mặt hiện tại có mức dư dồi dào, tuy nhiên hãy ưu tiên thanh toán qua chuyển khoản ngân hàng (như Techcombank) đối với hóa đơn mua gỗ đầu vào trên 20 triệu đồng để làm căn cứ hạch toán kiểm tra chuẩn chỉnh.</li>
                  <li><strong>Chính sách hóa đơn:</strong> Luôn rà soát lượng xuất hóa đơn đầu ra khớp sát với lượng nhập kho gỗ thô (Lâm sản Tây Nguyên) để tối ưu công tác đối chứng thực tế khi Chi cục Thuế kiểm tra.</li>
                </ul>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg text-[11px] text-gray-500 text-center">
                Mô-đun phân tích tài chính AI được tích hợp tối ưu theo các văn bản Thuế hiện hành.
              </div>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowAiModal(false)}
                className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
