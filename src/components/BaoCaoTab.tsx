import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Award, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { Transaction, SalesInvoice, PurchaseInvoice, Product } from '../types';

interface BaoCaoTabProps {
  transactions: Transaction[];
  salesInvoices: SalesInvoice[];
  purchaseInvoices: PurchaseInvoice[];
  products: Product[];
}

export default function BaoCaoTab({
  transactions,
  salesInvoices,
  purchaseInvoices,
  products
}: BaoCaoTabProps) {
  const [selectedYear, setSelectedYear] = useState('2026');

  // --- 1. Monthly Financial Slicing ---
  // Let's slice transactions and invoices for July, August, September 2026 (matching our mock data cycle)
  const getMonthlyBreakdown = (month: string) => {
    // format: YYYY-MM
    const prefix = `${selectedYear}-${month}`;
    
    // Filter sales in month
    const monthlySales = salesInvoices.filter(inv => inv.date.startsWith(prefix));
    
    // Compute revenue & discounts
    let grossRevenue = 0;
    let discounts = 0;
    let cogs = 0;
    let vat = 0;

    monthlySales.forEach(inv => {
      discounts += inv.discount;
      vat += inv.totalVat;
      inv.items.forEach(item => {
        grossRevenue += item.quantity * item.price;
        const prod = products.find(p => p.id === item.productId);
        const unitCost = prod ? prod.inputPrice : 0;
        cogs += item.quantity * unitCost;
      });
    });

    const netRevenue = grossRevenue - discounts;
    const grossProfit = netRevenue - cogs;

    // Filter operating expenses in month (non-COGS expenses)
    const monthlyTxs = transactions.filter(tx => tx.date.startsWith(prefix));
    const operatingExpenses = monthlyTxs
      .filter(tx => tx.type === 'chi' && tx.category !== 'Giá vốn mua hàng' && !tx.refId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netProfitBeforeTax = grossProfit - operatingExpenses;

    return {
      grossRevenue,
      discounts,
      netRevenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfitBeforeTax,
      vat
    };
  };

  const julyStats = getMonthlyBreakdown('07');
  const augustStats = getMonthlyBreakdown('08');
  const septemberStats = getMonthlyBreakdown('09');

  // Calculate overall aggregates for the quarter
  const qGrossRevenue = julyStats.grossRevenue + augustStats.grossRevenue + septemberStats.grossRevenue;
  const qDiscounts = julyStats.discounts + augustStats.discounts + septemberStats.discounts;
  const qNetRevenue = julyStats.netRevenue + augustStats.netRevenue + septemberStats.netRevenue;
  const qCogs = julyStats.cogs + augustStats.cogs + septemberStats.cogs;
  const qGrossProfit = julyStats.grossProfit + augustStats.grossProfit + septemberStats.grossProfit;
  const qExpenses = julyStats.operatingExpenses + augustStats.operatingExpenses + septemberStats.operatingExpenses;
  const qNetProfit = qGrossProfit - qExpenses;

  // Let's compute estimated Circular 40 taxes (GTGT + TNCN)
  // We can get actual sector breakdown of sales in this cycle
  let qVatTax = julyStats.vat + augustStats.vat + septemberStats.vat;
  // Let's approximate TNCN as roughly 1.2% average of total revenue for quick report presentation
  const qTncnTax = Math.round(qNetRevenue * 0.012);
  const qTotalTax = qVatTax + qTncnTax;

  const finalNetProfitAfterTax = qNetProfit - qTotalTax;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  // Render variables for custom visual SVG bar chart
  const maxBarVal = Math.max(
    julyStats.netRevenue, julyStats.operatingExpenses,
    augustStats.netRevenue, augustStats.operatingExpenses,
    septemberStats.netRevenue, septemberStats.operatingExpenses,
    1000000 // safeguard fallback
  );

  const getBarHeight = (val: number) => {
    const percentage = (val / maxBarVal) * 100;
    return `${Math.max(10, Math.min(100, Math.round(percentage)))}%`;
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Báo cáo tài chính</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Phân tích chuyên sâu về doanh thu, giá vốn, chi phí và lợi nhuận thuần</p>
        </div>

        {/* Year filter selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-xs">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Năm hạch toán:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs font-bold text-[#0a8251] bg-transparent border-none focus:ring-0 cursor-pointer py-0"
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* Visual Chart Section: Sales vs Expenses bar graphs using clean native SVG representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Sales vs Expenses Chart (Width 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Doanh thu thuần vs Chi phí hoạt động</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Biểu đồ so sánh lũy kế các tháng trong Quý 3 / {selectedYear}</p>
            </div>
            {/* Legends */}
            <div className="flex gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#0a8251]"></div>
                <span className="text-gray-600 dark:text-gray-400">Doanh thu thuần</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-400"></div>
                <span className="text-gray-600 dark:text-gray-400">Chi phí quản lý</span>
              </div>
            </div>
          </div>

          {/* Svg bar chart layout */}
          <div className="h-56 flex items-end gap-12 border-b border-gray-100 dark:border-slate-800/50 pb-2 px-6 pt-4 justify-around relative">
            {/* Grid line helper backgrounds */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] px-2 py-4">
              <div className="border-b border-gray-900 w-full"></div>
              <div className="border-b border-gray-900 w-full"></div>
              <div className="border-b border-gray-900 w-full"></div>
            </div>

            {/* July column group */}
            <div className="flex flex-col items-center gap-2 h-full justify-end w-20">
              <div className="flex gap-2 items-end h-full">
                {/* Revenue bar */}
                <div 
                  className="w-5 bg-[#0a8251] rounded-t-sm hover:opacity-90 transition-all cursor-pointer relative group" 
                  style={{ height: getBarHeight(julyStats.netRevenue) }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap mb-1 z-10 shadow-md">
                    {formatVND(julyStats.netRevenue)}
                  </div>
                </div>
                {/* Expenses bar */}
                <div 
                  className="w-5 bg-red-400 rounded-t-sm hover:opacity-90 transition-all cursor-pointer relative group" 
                  style={{ height: getBarHeight(julyStats.operatingExpenses) }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap mb-1 z-10 shadow-md">
                    {formatVND(julyStats.operatingExpenses)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">Tháng 07</span>
            </div>

            {/* August column group */}
            <div className="flex flex-col items-center gap-2 h-full justify-end w-20">
              <div className="flex gap-2 items-end h-full">
                <div 
                  className="w-5 bg-[#0a8251] rounded-t-sm hover:opacity-90 transition-all cursor-pointer relative group" 
                  style={{ height: getBarHeight(augustStats.netRevenue) }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap mb-1 z-10 shadow-md">
                    {formatVND(augustStats.netRevenue)}
                  </div>
                </div>
                <div 
                  className="w-5 bg-red-400 rounded-t-sm hover:opacity-90 transition-all cursor-pointer relative group" 
                  style={{ height: getBarHeight(augustStats.operatingExpenses) }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap mb-1 z-10 shadow-md">
                    {formatVND(augustStats.operatingExpenses)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">Tháng 08</span>
            </div>

            {/* September column group */}
            <div className="flex flex-col items-center gap-2 h-full justify-end w-20">
              <div className="flex gap-2 items-end h-full">
                <div 
                  className="w-5 bg-[#0a8251] rounded-t-sm hover:opacity-90 transition-all cursor-pointer relative group" 
                  style={{ height: getBarHeight(septemberStats.netRevenue) }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap mb-1 z-10 shadow-md">
                    {formatVND(septemberStats.netRevenue)}
                  </div>
                </div>
                <div 
                  className="w-5 bg-red-400 rounded-t-sm hover:opacity-90 transition-all cursor-pointer relative group" 
                  style={{ height: getBarHeight(septemberStats.operatingExpenses) }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap mb-1 z-10 shadow-md">
                    {formatVND(septemberStats.operatingExpenses)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">Tháng 09</span>
            </div>
          </div>
        </div>

        {/* Profitability Highlight metrics (Width 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-3">Hiệu suất tài chính</h3>
            
            <div className="space-y-3.5 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Tỷ suất lợi nhuận gộp (GP %):</span>
                <span className="text-[#0a8251] font-extrabold bg-green-50 px-2 py-0.5 rounded">
                  {qNetRevenue > 0 ? Math.round((qGrossProfit / qNetRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Tỷ suất lợi nhuận ròng (Net %):</span>
                <span className="text-purple-700 font-extrabold bg-purple-50 px-2 py-0.5 rounded">
                  {qNetRevenue > 0 ? Math.round((finalNetProfitAfterTax / qNetRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Thuế môn bài & khoán ước tính:</span>
                <span className="text-gray-800 dark:text-gray-200 font-bold">{formatVND(qTotalTax)}</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start gap-2.5 mt-4">
            <Sparkles className="w-4.5 h-4.5 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-purple-950 leading-relaxed">
              <strong>Phân tích từ Fintab:</strong> Hộ kinh doanh đang hoạt động ổn định với tỷ suất lợi nhuận gộp tốt, phản ánh đơn giá bán gỗ nội thất mang lại giá trị gia tăng cao. Hãy tối ưu chi phí quản lý vận hành văn phòng Showroom để gia tăng thêm lợi nhuận ròng sau thuế cuối kỳ.
            </p>
          </div>
        </div>
      </div>

      {/* Profit & Loss Statement (Báo cáo Kết quả Kinh doanh chi tiết) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800/50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Báo cáo Kết quả Hoạt động Kinh doanh chi tiết (Quý 3/{selectedYear})</span>
          <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 font-bold font-mono">ĐƠN VỊ: VNĐ</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800/50">
                <th className="py-3 px-4">Chỉ tiêu hạch toán kế toán</th>
                <th className="py-3 px-4 text-center">Tháng 07</th>
                <th className="py-3 px-4 text-center">Tháng 08</th>
                <th className="py-3 px-4 text-center">Tháng 09</th>
                <th className="py-3 px-4 text-right">Lũy kế Quý 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50">
                <td className="py-2.5 px-4 font-semibold text-gray-800 dark:text-gray-200">1. Doanh thu bán hàng và cung cấp dịch vụ</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(julyStats.grossRevenue)}</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(augustStats.grossRevenue)}</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(septemberStats.grossRevenue)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white">{formatVND(qGrossRevenue)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50 text-red-500">
                <td className="py-2.5 px-4 font-semibold">2. Các khoản giảm trừ doanh thu (Chiết khấu, giảm giá)</td>
                <td className="py-2.5 px-4 text-center font-medium">-{formatVND(julyStats.discounts)}</td>
                <td className="py-2.5 px-4 text-center font-medium">-{formatVND(augustStats.discounts)}</td>
                <td className="py-2.5 px-4 text-center font-medium">-{formatVND(septemberStats.discounts)}</td>
                <td className="py-2.5 px-4 text-right font-bold">-{formatVND(qDiscounts)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50 bg-[#eaf4f0]/20 font-bold">
                <td className="py-2.5 px-4 text-[#0a8251] font-extrabold">3. Doanh thu thuần về bán hàng và cung cấp dịch vụ</td>
                <td className="py-2.5 px-4 text-center">{formatVND(julyStats.netRevenue)}</td>
                <td className="py-2.5 px-4 text-center">{formatVND(augustStats.netRevenue)}</td>
                <td className="py-2.5 px-4 text-center">{formatVND(septemberStats.netRevenue)}</td>
                <td className="py-2.5 px-4 text-right text-[#0a8251] font-extrabold">{formatVND(qNetRevenue)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50">
                <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">4. Giá vốn hàng bán (Chi phí nhập gỗ & mộc thô)</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(julyStats.cogs)}</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(augustStats.cogs)}</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(septemberStats.cogs)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white">{formatVND(qCogs)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50 font-bold bg-blue-50/10">
                <td className="py-2.5 px-4 text-blue-800 font-bold">5. Lợi nhuận gộp về bán hàng và cung cấp dịch vụ</td>
                <td className="py-2.5 px-4 text-center">{formatVND(julyStats.grossProfit)}</td>
                <td className="py-2.5 px-4 text-center">{formatVND(augustStats.grossProfit)}</td>
                <td className="py-2.5 px-4 text-center">{formatVND(septemberStats.grossProfit)}</td>
                <td className="py-2.5 px-4 text-right text-blue-900 font-extrabold">{formatVND(qGrossProfit)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50">
                <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">6. Chi phí quản lý kinh doanh (Điện nước, thuê mặt bằng showroom, internet)</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(julyStats.operatingExpenses)}</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(augustStats.operatingExpenses)}</td>
                <td className="py-2.5 px-4 text-center text-gray-600 dark:text-gray-400">{formatVND(septemberStats.operatingExpenses)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white">{formatVND(qExpenses)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50 font-extrabold bg-[#eaf4f0]/40">
                <td className="py-3 px-4 text-gray-900 dark:text-white font-extrabold uppercase">7. LỢI NHUẬN TRƯỚC THUẾ KINH DOANH:</td>
                <td className="py-3 px-4 text-center">{formatVND(julyStats.netProfitBeforeTax)}</td>
                <td className="py-3 px-4 text-center">{formatVND(augustStats.netProfitBeforeTax)}</td>
                <td className="py-3 px-4 text-center">{formatVND(septemberStats.netProfitBeforeTax)}</td>
                <td className="py-3 px-4 text-right text-emerald-800 font-extrabold">{formatVND(qNetProfit)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50 text-red-500">
                <td className="py-2.5 px-4 font-semibold">8. Thuế GTGT + TNCN khoán hộ kinh doanh ước tính (Circular 40)</td>
                <td colSpan={3} className="py-2.5 px-4"></td>
                <td className="py-2.5 px-4 text-right font-extrabold">-{formatVND(qTotalTax)}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:bg-slate-900/50/50 font-extrabold bg-purple-50 border-t-2 border-purple-200">
                <td className="py-3.5 px-4 text-purple-950 font-extrabold uppercase text-xs">9. LỢI NHUẬN RÒNG SAU THUẾ ƯỚC TÍNH:</td>
                <td colSpan={3} className="py-3.5 px-4"></td>
                <td className="py-3.5 px-4 text-right text-purple-700 font-extrabold text-sm">{formatVND(finalNetProfitAfterTax)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
