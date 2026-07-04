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
  CheckCircle2,
  Sliders,
  Image as ImageIcon,
  Video as VideoIcon,
  Palette,
  Layout,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface CauHinhTabProps {
  businessProfile: BusinessProfile;
  onUpdateBusinessProfile: (profile: BusinessProfile) => void;
  bgType: string;
  setBgType: (type: string) => void;
  bgValue: string;
  setBgValue: (val: string) => void;
  opacity: number;
  setOpacity: (op: number) => void;
}

const imageWallpapers = [
  "https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg",
  "https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg",
  "https://i.ibb.co/R4P1zff0/ta-i-xu-ng-15.jpg",
  "https://i.ibb.co/TDnD5NB1/ta-i-xu-ng-14.jpg",
  "https://i.ibb.co/S49fBKcv/ta-i-xu-ng-13.jpg",
  "https://i.ibb.co/04qypw8/ta-i-xu-ng-12.jpg",
  "https://i.ibb.co/ch1yf4Dz/AVv-Xs-Egn6ve-Lq-M6aj-Fr-XO6-YYuy-NTs-Wt-x9-qxb2w-O8-Xt-OWdn-JECETXTri7-Ps-rnb2-Td-Jnln6xu-kddyc-Yisi1xf.jpg",
  "https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg",
  "https://i.ibb.co/rKL4ffH2/2.jpg",
  "https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg",
  "https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg",
  "https://i.ibb.co/Fc1dczn/Wallpaper.jpg",
  "https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg",
  "https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg",
  "https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg",
  "https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg",
  "https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg",
  "https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free.jpg",
  "https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg"
];

const videoWallpapers = [
  { url: "https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/9438742/file/original-9334dd4051bb585cc561e8be06870b39.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/4241992/file/original-1fcb82b5ace105f3ec88a2deb08e842d.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/34993295/file/original-2ea4b30fcd7c6eac3ca0f4d5bfd3d67b.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/32536603/file/original-db8060ba2540c3bf1cd2f30b4984cd51.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/32480516/file/original-f4a88d4031fee315e3175bf1834c24b4.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/32404914/file/original-57644971c47c0d16f90a68404a5e65c1.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/16365481/file/original-527fee647d12f31fce8a309ad136c4bb.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/15594644/file/original-6008d4b0ddcff73c116cb7989a144a71.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/14779635/file/original-1aca59fc5dc52bee9dcd291a27effcbf.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/10782874/file/original-06f7280dda982b62cd9452b0da032598.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/32524948/file/original-3c68e4ad227ae70e1875ef71289be2b0.mp4", thumbnail: "https://i.postimg.cc/jS3rSGdF/videoframe-8901.png" },
  { url: "https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4", thumbnail: "https://i.postimg.cc/BnmJ1jNN/videoframe-3046.png" },
  { url: "https://cdn.dribbble.com/userupload/16718734/file/original-f2df9314dbf922d5452d7a8a5885d744.mp4", thumbnail: "https://i.postimg.cc/NfYtJ6zp/videoframe-1990.png" },
  { url: "https://cdn.dribbble.com/userupload/43797830/file/original-b9bafe56dd75a7ae175f827cfc662738.mp4", thumbnail: "https://i.postimg.cc/yNJW1hB0/videoframe-3097.png" },
  { url: "https://cdn.dribbble.com/userupload/16365364/file/original-dcc3ad4c0f5802c6670d36fcca720e5e.mp4", thumbnail: "https://i.postimg.cc/vBgPtKyD/videoframe-4678.png" },
  { url: "https://cdn.dribbble.com/userupload/43797856/file/original-46c91cbdf46a3cbc3f30a85f061ed817.mp4", thumbnail: "https://i.postimg.cc/L6TVLSPN/videoframe-3537.png" },
  { url: "https://cdn.dribbble.com/userupload/12532568/file/original-816b8af88c5a4336e9f0467a7848033e.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/9535990/file/original-3a87c5fdf2433287d096795a11fa9ee4.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/13253460/file/original-85659da2508a303a516780470e3ae354.mp4", thumbnail: "" },
  { url: "https://cdn.dribbble.com/userupload/9783516/file/original-47f57ffecea5c7874ff6d6c2f0ce42bf.mp4", thumbnail: "" }
];

const gradientWallpapers = [
  "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
  "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(45deg, #13547a 0%, #80d0c7 100%)",
  "linear-gradient(45deg, #ed6ea0 0%, #ec8c69 100%)",
  "linear-gradient(45deg, #000428 0%, #004e92 100%)",
  "linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(45deg, #373b44 0%, #4286f4 100%)",
  "linear-gradient(45deg, #7028e4 0%, #e5b2ca 100%)",
  "linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)",
  "linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(45deg, #0250c5 0%, #d43f8d 100%)"
];

const patternWallpapers = [
  { id: 'orbiting-planets', name: 'Orbiting Planets Space', thumbnail: 'https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'dotted-pattern', name: 'Họa tiết chấm sáng (Dotted Pattern)', style: 'radial-gradient(circle at 25% 25%, #a3b1c6 15%, transparent 15%), radial-gradient(circle at 75% 75%, #a3b1c6 15%, transparent 15%)' },
  { id: 'dark-dotted-pattern', name: 'Họa tiết chấm tối (Dark Dotted)', style: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)' }
];

export default function CauHinhTab({
  businessProfile,
  onUpdateBusinessProfile,
  bgType,
  setBgType,
  bgValue,
  setBgValue,
  opacity,
  setOpacity
}: CauHinhTabProps) {
  // Navigation tabs
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'appearance'>('profile');

  // Form states
  const [name, setName] = useState(businessProfile.name);
  const [mst, setMst] = useState(businessProfile.mst);
  const [address, setAddress] = useState(businessProfile.address);
  const [representative, setRepresentative] = useState(businessProfile.representative);
  const [phone, setPhone] = useState(businessProfile.phone);
  const [email, setEmail] = useState(businessProfile.email || '');
  const [mainSector, setMainSector] = useState(businessProfile.mainSector);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sub-category of wallpapers being edited inside appearance panel
  const [selectedWallpaperCategory, setSelectedWallpaperCategory] = useState<'image' | 'video' | 'gradient' | 'pattern' | 'color'>('image');

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

  const selectWallpaper = (type: 'image' | 'video' | 'gradient' | 'pattern' | 'color', val: string) => {
    setBgType(type);
    setBgValue(val);
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-transparent min-h-[calc(100vh-4rem)]">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0a8251]" />
            Cấu hình Hệ Thống & Giao diện
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý hồ sơ doanh nghiệp pháp lý, độ trong suốt ứng dụng và hình nền 3D sinh động</p>
        </div>

        {/* Tab Controllers */}
        <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition ${activeSubTab === 'profile' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Building className="w-3.5 h-3.5" />
            Thông tin hộ kinh doanh
          </button>
          <button
            onClick={() => setActiveSubTab('appearance')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition ${activeSubTab === 'appearance' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Giao diện & Hình nền
          </button>
        </div>
      </div>

      {activeSubTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Profile edit card (Width 2) */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
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
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
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
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono font-bold"
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
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
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
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
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
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono"
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
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
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
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                  />
                </div>
              </div>

              {/* Action buttons with success feedback indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-xs p-5 space-y-4 text-xs text-gray-600 leading-relaxed">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide block border-b pb-2">Giải pháp Fintab Cloud</span>
            <p>
              Hệ thống Fintab đồng bộ hóa các hóa đơn bán hàng, dữ liệu nhập kho và lịch sử hạch toán thu chi của bạn lên điện toán đám mây bảo mật.
            </p>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-1">
              <p className="font-bold text-gray-800">Phiên bản: Fintab ERP Pro v3.4.2</p>
              <p className="font-medium text-gray-500">Môi trường: Thử nghiệm Sandbox</p>
              <p className="font-medium text-gray-500">Khách hàng: Hộ kinh doanh đồ gỗ mỹ nghệ Tây Nguyên</p>
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Mọi thông tin hạch toán chứng từ tuân thủ các quy chuẩn kế toán đơn giản cho các hộ kinh doanh theo Luật thuế Việt Nam hiện hành.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Main appearance setting area (Width 2) */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-xl border border-gray-100 shadow-xs p-6 space-y-6">
            
            {/* Opacity Control Slider */}
            <div className="space-y-3 pb-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#0a8251]" />
                  <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Độ trong suốt giao diện (Card Opacity)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaf4f0] text-[#0a8251] font-bold text-[11px] font-mono">
                  {opacity}%
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Kéo thanh trượt để tinh chỉnh độ xuyên thấu của bảng điều khiển chính, giúp chiêm ngưỡng hình nền mờ ảo tuyệt đẹp phía sau.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <span className="text-[10px] font-bold text-gray-400 font-mono">30%</span>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0a8251]"
                />
                <span className="text-[10px] font-bold text-gray-400 font-mono">100% (Đặc)</span>
              </div>
            </div>

            {/* Background selection */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0a8251]" />
                  Cấu hình hình nền ứng dụng
                </span>
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button
                  onClick={() => setSelectedWallpaperCategory('image')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${selectedWallpaperCategory === 'image' ? 'bg-white text-[#0a8251] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Ảnh tĩnh
                </button>
                <button
                  onClick={() => setSelectedWallpaperCategory('video')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${selectedWallpaperCategory === 'video' ? 'bg-white text-[#0a8251] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  Video động
                </button>
                <button
                  onClick={() => setSelectedWallpaperCategory('gradient')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${selectedWallpaperCategory === 'gradient' ? 'bg-white text-[#0a8251] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  Dải màu Gradient
                </button>
                <button
                  onClick={() => setSelectedWallpaperCategory('pattern')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${selectedWallpaperCategory === 'pattern' ? 'bg-white text-[#0a8251] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  Họa tiết độc đáo
                </button>
                <button
                  onClick={() => setSelectedWallpaperCategory('color')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${selectedWallpaperCategory === 'color' ? 'bg-white text-[#0a8251] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Màu cơ bản
                </button>
              </div>

              {/* Selection Content Grid */}
              <div className="max-h-[320px] overflow-y-auto pr-1">
                
                {/* Images */}
                {selectedWallpaperCategory === 'image' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageWallpapers.map((url, index) => {
                      const isSelected = bgType === 'image' && bgValue === url;
                      return (
                        <div 
                          key={index}
                          onClick={() => selectWallpaper('image', url)}
                          className={`group relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-[#0a8251] shadow-md scale-[0.98]' : 'border-transparent hover:border-gray-200'}`}
                        >
                          <img 
                            src={url} 
                            alt={`Wallpaper ${index + 1}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                          />
                          <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all ${isSelected ? 'bg-transparent' : ''}`} />
                          <div className="absolute bottom-1 right-1 text-[10px] font-mono px-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Mẫu {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Videos */}
                {selectedWallpaperCategory === 'video' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {videoWallpapers.map((item, index) => {
                      const isSelected = bgType === 'video' && bgValue === item.url;
                      return (
                        <div 
                          key={index}
                          onClick={() => selectWallpaper('video', item.url)}
                          className={`group relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all bg-gray-900 ${isSelected ? 'border-[#0a8251] shadow-md scale-[0.98]' : 'border-transparent hover:border-gray-200'}`}
                        >
                          {/* If a thumbnail exists, show it, otherwise load a low-priority video preview on hover */}
                          {item.thumbnail ? (
                            <img 
                              src={item.thumbnail} 
                              alt={`Video preview ${index + 1}`} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            />
                          ) : (
                            <video 
                              src={item.url} 
                              muted 
                              loop 
                              playsInline 
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                            />
                          )}
                          <div className="absolute top-2 left-2 bg-black/60 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                            MP4 Video
                          </div>
                          <div className="absolute bottom-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0a8251]/90 text-white">
                            {isSelected ? 'Đang kích hoạt' : 'Chọn hình nền'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Gradients */}
                {selectedWallpaperCategory === 'gradient' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gradientWallpapers.map((grad, index) => {
                      const isSelected = bgType === 'gradient' && bgValue === grad;
                      const isDynamic = grad.includes('linear-gradient(-45deg');
                      return (
                        <div 
                          key={index}
                          onClick={() => selectWallpaper('gradient', grad)}
                          className={`relative h-16 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-[#0a8251] shadow-md scale-[0.98]' : 'border-transparent hover:border-gray-200'}`}
                          style={{ background: grad }}
                        >
                          <div className="absolute inset-0 flex items-center justify-between px-3 text-white">
                            <span className="text-[10px] font-bold drop-shadow-md">
                              Gradient {index + 1} {isDynamic && '(Sóng động)'}
                            </span>
                            <span className="text-[9px] font-medium bg-black/20 rounded px-1.5 py-0.5">
                              CSS Linear
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Patterns */}
                {selectedWallpaperCategory === 'pattern' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {patternWallpapers.map((item, index) => {
                      const isSelected = bgType === 'pattern' && bgValue === item.id;
                      return (
                        <div 
                          key={index}
                          onClick={() => selectWallpaper('pattern', item.id)}
                          className={`group relative h-24 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-[#0a8251] shadow-md scale-[0.98]' : 'border-transparent hover:border-gray-200'}`}
                          style={item.style ? { 
                            backgroundImage: item.style, 
                            backgroundSize: item.id === 'dotted-pattern' ? '10px 10px' : '11px 11px',
                            backgroundColor: item.id === 'dotted-pattern' ? '#e0e7ed' : '#1d1f20'
                          } : undefined}
                        >
                          {item.thumbnail && (
                            <img 
                              src={item.thumbnail} 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />
                          <div className="absolute inset-0 flex flex-col justify-end p-2.5 text-white">
                            <span className="text-[11px] font-bold leading-tight drop-shadow-md">
                              {item.name}
                            </span>
                            <span className="text-[9px] text-gray-300 font-medium">
                              Chủ đề thiết kế
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Colors */}
                {selectedWallpaperCategory === 'color' && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {['#f3f4f6', '#e5e7eb', '#d1d5db', '#0f172a', '#1e293b', '#fef2f2', '#f0fdf4', '#eff6ff', '#faf5ff'].map((colorCode, index) => {
                      const isSelected = bgType === 'color' && bgValue === colorCode;
                      return (
                        <div 
                          key={index}
                          onClick={() => selectWallpaper('color', colorCode)}
                          className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center ${isSelected ? 'border-[#0a8251] shadow-md' : 'border-transparent hover:border-gray-200'}`}
                          style={{ backgroundColor: colorCode }}
                        >
                          <span className={`text-[9px] font-mono font-bold ${colorCode.includes('#f') || colorCode.includes('#e') ? 'text-gray-600' : 'text-gray-300'}`}>
                            {colorCode}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Real-time configuration report card (Width 1) */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-100 shadow-xs p-5 space-y-4 text-xs text-gray-600 leading-relaxed flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide block border-b pb-2">Thông số Giao diện</span>
              
              <div className="space-y-3">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Phông chữ:</span>
                  <span className="font-bold text-gray-800">Play / Playfair Display</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Kiểu bo góc:</span>
                  <span className="font-bold text-gray-800">10px (Mềm mại)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Khung viền 3D:</span>
                  <span className="font-bold text-[#0a8251]">Kích hoạt</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Đổi màu viền:</span>
                  <span className="font-bold text-gray-500">Mỗi 1 phút</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Độ trong suốt:</span>
                  <span className="font-bold text-gray-800 font-mono">{opacity}% (Độ đục)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Kiểu hình nền:</span>
                  <span className="font-bold text-gray-800 capitalize">
                    {bgType === 'image' && 'Ảnh tĩnh'}
                    {bgType === 'video' && 'Video động'}
                    {bgType === 'gradient' && 'Màu Gradient'}
                    {bgType === 'pattern' && 'Họa tiết'}
                    {bgType === 'color' && 'Màu đơn sắc'}
                  </span>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-[11px] text-gray-500">
                <p className="font-bold text-gray-700 mb-1">💡 Mẹo nhỏ:</p>
                Sự kết hợp giữa phông chữ <strong className="text-[#0a8251]">Play</strong> lịch lãm và thiết kế kính mờ trong suốt (Glassmorphism) tạo nên không gian làm việc chuyên nghiệp, khơi gợi cảm hứng kinh doanh.
              </div>
            </div>

            <p className="text-[10px] text-gray-400 italic border-t border-gray-100 pt-3">
              Cài đặt giao diện được lưu trữ cục bộ (Local Storage) tự động, duy trì trạng thái yêu thích của bạn cho những phiên làm việc tiếp theo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
