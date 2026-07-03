import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Building, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface CauHinhTabProps {
  businessProfile: BusinessProfile;
  onUpdateBusinessProfile: (profile: BusinessProfile) => void;
}

export default function CauHinhTab({
  businessProfile,
  onUpdateBusinessProfile
}: CauHinhTabProps) {
  // Form states
  const [name, setName] = useState(businessProfile.name);
  const [mst, setMst] = useState(businessProfile.mst);
  const [address, setAddress] = useState(businessProfile.address);
  const [representative, setRepresentative] = useState(businessProfile.representative);
  const [phone, setPhone] = useState(businessProfile.phone);
  const [email, setEmail] = useState(businessProfile.email || '');
  const [mainSector, setMainSector] = useState(businessProfile.mainSector);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusinessProfile({
      name,
      mst,
      address,
      representative,
      phone,
      email: email || undefined,
      mainSector,
      taxMethod: businessProfile.taxMethod
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Cấu hình Hệ Thống</h1>
        <p className="text-xs text-gray-500 mt-0.5">Quản lý hồ sơ pháp lý, mã số thuế và thông tin liên hệ hóa đơn của hộ kinh doanh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile edit card (Width 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2 border-b pb-3.5">
            <Building className="w-5 h-5 text-[#0a8251]" />
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Thông tin đăng ký hộ kinh doanh</h3>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Tên Hộ kinh doanh / Showroom *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Mã số thuế đăng ký (MST) *</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={mst}
                    onChange={(e) => setMst(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Chủ hộ / Người đại diện pháp luật *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Lĩnh vực hoạt động kinh doanh chính *</label>
                <div className="relative">
                  <Settings className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={mainSector}
                    onChange={(e) => setMainSector(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Số điện thoại liên lạc showroom *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Email liên lạc hóa đơn *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Địa chỉ đăng ký showroom chính thức *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                />
              </div>
            </div>

            {/* Action buttons with success feedback indicator */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                {savedSuccess && (
                  <span className="flex items-center gap-1 text-[#0a8251] font-bold text-[11px] animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã cập nhật hồ sơ hộ kinh doanh!
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white font-bold rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi hồ sơ</span>
              </button>
            </div>
          </form>
        </div>

        {/* Informational sidebar (Width 1) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4 text-xs text-gray-600 leading-relaxed">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide block border-b pb-2">Giải pháp Fintab Cloud</span>
          <p>
            Hệ thống Fintab đồng bộ hóa các hóa đơn bán hàng, dữ liệu nhập kho và lịch sử hạch toán thu chi của bạn lên điện toán đám mây bảo mật.
          </p>
          <div className="p-3 bg-gray-50 border rounded-lg space-y-1">
            <p className="font-bold text-gray-800">Phiên bản: Fintab ERP Pro v3.4.2</p>
            <p className="font-medium text-gray-500">Môi trường: Thử nghiệm Sandbox</p>
            <p className="font-medium text-gray-500">Khách hàng: Hộ kinh doanh đồ gỗ mỹ nghệ Tây Nguyên</p>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            Mọi thông tin hạch toán chứng từ tuân thủ các quy chuẩn kế toán đơn giản cho các hộ kinh doanh theo Luật thuế Việt Nam hiện hành.
          </p>
        </div>

      </div>
    </div>
  );
}
