import { useState } from 'react';
import { 
  Percent, 
  FileCheck, 
  Calculator, 
  ChevronRight, 
  Info, 
  X, 
  Printer, 
  CheckCircle2 
} from 'lucide-react';
import { SalesInvoice, Product, BusinessProfile } from '../types';

interface ThueTabProps {
  salesInvoices: SalesInvoice[];
  products: Product[];
  businessProfile: BusinessProfile;
}

export default function ThueTab({
  salesInvoices,
  products,
  businessProfile
}: ThueTabProps) {
  const [showTaxReturnModal, setShowTaxReturnModal] = useState(false);

  // Sector definition based on Vietnamese Tax circular 40/2021/TT-BTC
  const sectors = [
    {
      type: 1,
      name: 'Phân phối, cung cấp hàng hóa',
      vatRate: 1,
      tncnRate: 0.5,
      example: 'Bán buôn, bán lẻ đồ gỗ, bàn ghế, tủ gỗ, phụ kiện gỗ thô'
    },
    {
      type: 2,
      name: 'Dịch vụ, xây dựng không bao thầu nguyên vật liệu',
      vatRate: 5,
      tncnRate: 2,
      example: 'Phí tư vấn thiết kế nội thất, tiền công lắp đặt, tiền sửa gỗ tại nhà'
    },
    {
      type: 3,
      name: 'Sản xuất, vận tải, dịch vụ có gắn với hàng hóa, xây dựng có bao thầu',
      vatRate: 3,
      tncnRate: 1.5,
      example: 'Sản xuất đồ mỹ nghệ gỗ xuất khẩu, gia công sơn PU bao thầu vật liệu'
    },
    {
      type: 4,
      name: 'Hoạt động kinh doanh khác',
      vatRate: 2,
      tncnRate: 1,
      example: 'Cho thuê tài sản gỗ trưng bày, thiết bị xưởng gỗ, hoặc ngành khác'
    }
  ];

  // Calculate actual revenue per sector type
  const getSectorFinancials = (sectorType: number) => {
    let revenue = 0;
    
    // Scan all paid/unpaid invoices to gather real sales revenues in the cycle
    salesInvoices.forEach(inv => {
      inv.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod && prod.sectorType === sectorType) {
          // Adjust for discount proportionately
          // (item_amount / invoice_subtotal) * discount
          const subtotal = inv.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
          const ratio = subtotal > 0 ? (item.quantity * item.price) / subtotal : 0;
          const proportionalDiscount = inv.discount * ratio;
          
          revenue += (item.quantity * item.price) - proportionalDiscount;
        }
      });
    });

    const sectorMeta = sectors.find(s => s.type === sectorType)!;
    const vatAmount = Math.round(revenue * (sectorMeta.vatRate / 100));
    const tncnAmount = Math.round(revenue * (sectorMeta.tncnRate / 100));

    return {
      revenue: Math.round(revenue),
      vatAmount,
      tncnAmount,
      totalTax: vatAmount + tncnAmount
    };
  };

  // Aggregated totals
  let totalRevenueAllSectors = 0;
  let totalVatLiability = 0;
  let totalTncnLiability = 0;

  const sectorBreakdowns = sectors.map(sector => {
    const financials = getSectorFinancials(sector.type);
    totalRevenueAllSectors += financials.revenue;
    totalVatLiability += financials.vatAmount;
    totalTncnLiability += financials.tncnAmount;
    return {
      ...sector,
      ...financials
    };
  });

  const totalTaxLiability = totalVatLiability + totalTncnLiability;

  // Check if subject to tax (exempt if annual revenue is <= 100 million VND)
  // But let's assume the annual estimation is active. If 100 million is breached, tax is payable.
  const isTaxExempt = totalRevenueAllSectors <= 100000000;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Thuế Hộ Kinh Doanh</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ước tính nghĩa vụ thuế GTGT & TNCN tự động theo Thông tư 40/2021/TT-BTC</p>
        </div>

        <button
          id="btn-tax-declaration"
          onClick={() => setShowTaxReturnModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <FileCheck className="w-4 h-4" />
          <span>Mở Tờ Khai 01/CNKD</span>
        </button>
      </div>

      {/* Tax Exemption Alert */}
      {isTaxExempt && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
          <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <strong>Thông tin miễn thuế:</strong> Do tổng doanh thu hiện tại của hộ kinh doanh đạt <strong>{formatVND(totalRevenueAllSectors)}</strong> (dưới ngưỡng quy định 100,000,000đ/năm), Hộ kinh doanh của bạn thuộc diện <strong>được miễn đóng thuế GTGT và TNCN</strong> đối với hoạt động kinh doanh này. Chỉ số hiển thị bên dưới mang tính tham khảo hạch toán.
          </div>
        </div>
      )}

      {/* Grid Overall Tax Liabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total tax to pay */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-purple-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng thuế môn bài & khoán ước tính</span>
            <p className="text-xl font-extrabold text-purple-700 mt-1">{isTaxExempt ? '0 đ (Miễn thuế)' : formatVND(totalTaxLiability)}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* VAT portion */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800/50 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Thuế giá trị gia tăng (GTGT)</span>
            <p className="text-lg font-extrabold text-gray-800 dark:text-gray-200 mt-1">{formatVND(totalVatLiability)}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0a8251] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        {/* PIT portion */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800/50 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Thuế thu nhập cá nhân (TNCN)</span>
            <p className="text-lg font-extrabold text-gray-800 dark:text-gray-200 mt-1">{formatVND(totalTncnLiability)}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Detailed Sectors Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Biểu tổng hợp doanh thu chịu thuế phân loại theo Nhóm Ngành</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800/50">
                <th className="py-3 px-4">Nhóm Ngành Kinh Doanh (Circular 40)</th>
                <th className="py-3 px-4 text-center">Thuế GTGT (%)</th>
                <th className="py-3 px-4 text-center">Thuế TNCN (%)</th>
                <th className="py-3 px-4 text-right">Doanh thu tính thuế</th>
                <th className="py-3 px-4 text-right">Thuế GTGT tạm tính</th>
                <th className="py-3 px-4 text-right">Thuế TNCN tạm tính</th>
                <th className="py-3 px-4 text-right">Tổng thuế phát sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {sectorBreakdowns.map((sector) => (
                <tr key={sector.type} className="hover:bg-gray-50 dark:bg-slate-900/50/50 transition">
                  <td className="py-3 px-4 max-w-sm">
                    <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{sector.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight italic">Ví dụ: {sector.example}</p>
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-purple-600">{sector.vatRate}%</td>
                  <td className="py-3 px-4 text-center font-extrabold text-amber-600">{sector.tncnRate}%</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{formatVND(sector.revenue)}</td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{formatVND(sector.vatAmount)}</td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{formatVND(sector.tncnAmount)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#0a8251]">{formatVND(sector.totalTax)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-slate-900/50/80 font-bold border-t">
                <td className="py-3.5 px-4 text-gray-900 dark:text-white text-xs uppercase font-extrabold">Tổng cộng các ngành:</td>
                <td colSpan={2} className="py-3.5 px-4"></td>
                <td className="py-3.5 px-4 text-right text-sm text-[#0a8251] font-extrabold">{formatVND(totalRevenueAllSectors)}</td>
                <td className="py-3.5 px-4 text-right text-gray-800 dark:text-gray-200">{formatVND(totalVatLiability)}</td>
                <td className="py-3.5 px-4 text-right text-gray-800 dark:text-gray-200">{formatVND(totalTncnLiability)}</td>
                <td className="py-3.5 px-4 text-right text-sm text-purple-700 font-extrabold">{formatVND(totalTaxLiability)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Returns Modal Form 01/CNKD layout */}
      {showTaxReturnModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header action bar */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-b flex justify-between items-center shrink-0">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#0a8251]" />
                Tờ khai Thuế Mẫu 01/CNKD (Kinh doanh cá thể)
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1 bg-[#eaf4f0] text-[#0a8251] rounded text-[11px] font-bold hover:bg-green-100 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In tờ khai</span>
                </button>
                <button onClick={() => setShowTaxReturnModal(false)} className="p-1 rounded text-gray-400 hover:text-gray-900 dark:text-white transition">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Document sheet body */}
            <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900 text-xs select-text font-sans space-y-6">
              {/* National Emblem Header block */}
              <div className="text-center space-y-0.5">
                <h4 className="font-extrabold text-[13px] tracking-wide text-gray-900 dark:text-white">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                <p className="font-bold text-[11px] text-gray-800 dark:text-gray-200">Độc lập - Tự do - Hạnh phúc</p>
                <div className="w-32 h-[1px] bg-gray-300 mx-auto my-2"></div>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white pt-1">TỜ KHAI THUẾ ĐỐI VỚI HỘ KINH DOANH, CÁ NHÂN KINH DOANH</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold italic">(Ban hành kèm theo Thông tư số 40/2021/TT-BTC ngày 01/06/2021 của Bộ Tài chính)</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 pt-2 font-mono">Kỳ tính thuế: Quý 3/2026</p>
              </div>

              {/* Section 1: Business Profile */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 dark:text-white block border-b pb-1 uppercase tracking-wide">I. THÔNG TIN NGƯỜI NỘP THUẾ:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-gray-700 dark:text-gray-300">
                  <p>[01] Tên người nộp thuế: <strong className="text-gray-900 dark:text-white">{businessProfile.representative}</strong></p>
                  <p>[02] Mã số thuế: <strong className="text-gray-900 dark:text-white font-mono">{businessProfile.mst}</strong></p>
                  <p>[03] Tên hộ kinh doanh: <strong className="text-gray-900 dark:text-white">{businessProfile.name}</strong></p>
                  <p>[04] Địa điểm kinh doanh: <strong className="text-gray-900 dark:text-white">{businessProfile.address}</strong></p>
                  <p>[05] Số điện thoại: <strong className="text-gray-900 dark:text-white font-mono">{businessProfile.phone}</strong></p>
                  <p>[06] Ngành nghề kinh doanh chính: <strong className="text-gray-900 dark:text-white">{businessProfile.mainSector}</strong></p>
                </div>
              </div>

              {/* Section 2: Taxation breakdown table */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 dark:text-white block border-b pb-1 uppercase tracking-wide">II. CHI TIẾT DOANH THU VÀ THUẾ PHẢI NỘP:</span>
                
                <table className="w-full text-left border-collapse border border-gray-200 dark:border-slate-800">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase border-b border-gray-200 dark:border-slate-800">
                      <th className="py-2 px-2 border border-gray-200 dark:border-slate-800">Chỉ tiêu nhóm ngành hàng</th>
                      <th className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-right">Doanh thu chịu thuế (đ)</th>
                      <th className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-center">Tỉ lệ thuế (%)</th>
                      <th className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-right">Thuế GTGT phải nộp (đ)</th>
                      <th className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-right">Thuế TNCN phải nộp (đ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectorBreakdowns.map((sector, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:bg-slate-900/50/20">
                        <td className="py-2 px-2 border border-gray-200 dark:border-slate-800 font-medium">
                          {idx + 1}. {sector.name}
                        </td>
                        <td className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-right font-semibold text-gray-900 dark:text-white">{formatVND(sector.revenue)}</td>
                        <td className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-center text-purple-700 font-bold">
                          GTGT: {sector.vatRate}% / TNCN: {sector.tncnRate}%
                        </td>
                        <td className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-right">{formatVND(sector.vatAmount)}</td>
                        <td className="py-2 px-2 border border-gray-200 dark:border-slate-800 text-right">{formatVND(sector.tncnAmount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 dark:bg-slate-900/50 font-bold">
                      <td className="py-2.5 px-2 border border-gray-200 dark:border-slate-800 uppercase font-extrabold">TỔNG CỘNG NGHĨA VỤ:</td>
                      <td className="py-2.5 px-2 border border-gray-200 dark:border-slate-800 text-right text-gray-900 dark:text-white font-extrabold">{formatVND(totalRevenueAllSectors)}</td>
                      <td className="py-2.5 px-2 border border-gray-200 dark:border-slate-800 text-center text-purple-700">-</td>
                      <td className="py-2.5 px-2 border border-gray-200 dark:border-slate-800 text-right">{formatVND(totalVatLiability)}</td>
                      <td className="py-2.5 px-2 border border-gray-200 dark:border-slate-800 text-right">{formatVND(totalTncnLiability)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 3: Declaration Commitments */}
              <div className="space-y-4 pt-4 border-t border-dashed">
                <p className="italic text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  Tôi cam đoan số liệu khai trên đây là đúng sự thật và chịu trách nhiệm trước pháp luật về tính chính xác của số liệu đã kê khai./.
                </p>
                <div className="grid grid-cols-2 text-center">
                  <div></div>
                  <div className="space-y-12">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">Hà Nội, ngày 30 tháng 09 năm 2026</p>
                    <p className="font-bold text-gray-900 dark:text-white uppercase">NGƯỜI NỘP THUẾ / ĐẠI DIỆN HỘ KINH DOANH</p>
                    <p className="font-extrabold text-gray-800 dark:text-gray-200 pt-6">{businessProfile.representative}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
