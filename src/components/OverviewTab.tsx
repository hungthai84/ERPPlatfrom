import { useState } from 'react';
import { 
  Building, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  CheckCircle2, 
  Users, 
  ShoppingBag, 
  Layers 
} from 'lucide-react';
import { BusinessProfile, Transaction, SalesInvoice, PurchaseInvoice, FundAccount, Product } from '../types';

interface OverviewTabProps {
  businessProfile: BusinessProfile;
  transactions: Transaction[];
  salesInvoices: SalesInvoice[];
  purchaseInvoices: PurchaseInvoice[];
  fundAccounts: FundAccount[];
  products: Product[];
}

export default function OverviewTab({
  businessProfile,
  transactions,
  salesInvoices,
  purchaseInvoices,
  fundAccounts,
  products
}: OverviewTabProps) {
  // Date states matching the screenshot (01/07/2026 to 30/09/2026)
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [revenuePage, setRevenuePage] = useState(1);
  const [fundPageIndex, setFundPageIndex] = useState(0);

  // Filter items by selected date range
  const filterByDate = (dateStr: string) => {
    return dateStr >= startDate && dateStr <= endDate;
  };

  const filteredSales = salesInvoices.filter(inv => filterByDate(inv.date));
  const filteredPurchases = purchaseInvoices.filter(inv => filterByDate(inv.date));
  const filteredTxs = transactions.filter(tx => filterByDate(tx.date));

  // --- Calculations for 'Theo doanh thu' ---
  // 1. Doanh thu bán hàng (Gross revenue before discounts and VAT)
  let grossSalesRevenue = 0;
  filteredSales.forEach(inv => {
    inv.items.forEach(item => {
      grossSalesRevenue += item.quantity * item.price;
    });
  });

  // 2. Các khoản giảm trừ (Discounts)
  const totalDiscounts = filteredSales.reduce((sum, inv) => sum + inv.discount, 0);

  // 3. Doanh thu thuần
  const netRevenue = grossSalesRevenue - totalDiscounts;

  // 4. Giá vốn hàng bán (COGS - Cost of Goods Sold)
  // Compute dynamically based on product input prices
  let costOfGoodsSold = 0;
  filteredSales.forEach(inv => {
    inv.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const unitCost = prod ? prod.inputPrice : 0;
      costOfGoodsSold += item.quantity * unitCost;
    });
  });

  // 5. Lợi nhuận gộp
  const grossProfit = netRevenue - costOfGoodsSold;

  // 6. Chi phí (Operating expenses, e.g. rent, bills - chi transactions that are NOT COGS/purchase payments)
  const operatingExpenses = filteredTxs
    .filter(tx => tx.type === 'chi' && tx.category !== 'Giá vốn mua hàng' && !tx.refId)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // 7. Lợi nhuận trước thuế
  const netProfitBeforeTax = grossProfit - operatingExpenses;

  // 8. Thuế GTGT đầu ra bán lẻ
  const totalVat = filteredSales.reduce((sum, inv) => sum + inv.totalVat, 0);

  // --- Calculations for Cash & Funds ---
  // Income (Tiền vào) in period
  const totalMoneyIn = filteredTxs
    .filter(tx => tx.type === 'thu')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Expense (Tiền ra) in period
  const totalMoneyOut = filteredTxs
    .filter(tx => tx.type === 'chi')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Compute actual balances for each Fund Account
  const calculatedFundBalances = fundAccounts.map(account => {
    const totalIn = transactions
      .filter(tx => tx.fundAccountId === account.id && tx.type === 'thu')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalOut = transactions
      .filter(tx => tx.fundAccountId === account.id && tx.type === 'chi')
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      ...account,
      balance: account.initialBalance + totalIn - totalOut
    };
  });

  // Currently viewing fund account
  const activeFund = calculatedFundBalances[fundPageIndex] || calculatedFundBalances[0] || { name: 'Chưa có', balance: 0, type: 'cash' };

  // Helper to format currency in VND
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Top Section: Dashboard title & Period range */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Thống kê</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Thống kê kinh doanh của bạn</p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs">
          <Calendar className="w-4 h-4 text-[#0a8251]" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs text-gray-700 dark:text-gray-300 bg-transparent border-none focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-gray-400">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-xs text-gray-700 dark:text-gray-300 bg-transparent border-none focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Tabs Selection (Mocking Tab Layout in Screenshot) */}
      <div className="border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex gap-6">
          <button className="border-b-2 border-[#0a8251] pb-3 text-sm font-bold text-[#0a8251] transition">
            Thông tin kinh doanh
          </button>
          <button className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition flex items-center gap-1.5">
            <span>Tin tức</span>
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">21</span>
          </button>
        </div>
      </div>

      {/* Bottom Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Business & Revenue analytics (Width 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Business Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-[#eaf4f0] flex items-center justify-center text-[#0a8251] mb-3">
              <Building className="w-8 h-8" />
            </div>
            <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded-md border border-yellow-100 uppercase tracking-wide">
              Hộ kinh doanh
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-1.5">
              {businessProfile.name}
            </h2>
            <p className="text-xs text-gray-400 mt-1">MST: {businessProfile.mst}</p>
          </div>

          {/* Revenue Analysis Card - "Theo doanh thu" */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Theo doanh thu</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Các chỉ tiêu chính kỳ này</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setRevenuePage(1)}
                  disabled={revenuePage === 1}
                  className="p-1 rounded bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:bg-slate-800 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{revenuePage}/2</span>
                <button 
                  onClick={() => setRevenuePage(2)}
                  disabled={revenuePage === 2}
                  className="p-1 rounded bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:bg-slate-800 disabled:opacity-40 transition"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {revenuePage === 1 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Doanh thu bán hàng</span>
                  <span className="text-gray-900 dark:text-white font-bold">{formatVND(grossSalesRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Các khoản giảm trừ</span>
                  <span className="text-gray-900 dark:text-white font-bold text-red-500">-{formatVND(totalDiscounts)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs bg-gray-50 dark:bg-slate-900/50/50 px-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-bold">Doanh thu thuần</span>
                  <span className="text-[#0a8251] font-extrabold">{formatVND(netRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Giá vốn hàng bán</span>
                  <span className="text-gray-900 dark:text-white font-bold">{formatVND(costOfGoodsSold)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs bg-[#eaf4f0]/30 px-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-bold">Lợi nhuận gộp</span>
                  <span className="text-[#0a8251] font-bold">{formatVND(grossProfit)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Chi phí quản lý phát sinh</span>
                  <span className="text-gray-900 dark:text-white font-bold text-amber-600">-{formatVND(operatingExpenses)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs bg-[#eaf4f0]/40 px-2 rounded">
                  <span className="text-gray-800 dark:text-gray-200 font-extrabold">Lợi nhuận trước thuế</span>
                  <span className="text-emerald-700 font-extrabold">{formatVND(netProfitBeforeTax)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Thuế GTGT đầu ra ước tính</span>
                  <span className="text-gray-900 dark:text-white font-bold">{formatVND(totalVat)}</span>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-[10px] text-blue-800 leading-relaxed mt-2">
                  <strong>Thông tin hỗ trợ:</strong> Các thông số này được kết xuất trực tiếp từ hóa đơn bán ra và chi phí vận hành ghi nhận trong hệ thống sổ sách.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Greetings, Fund summaries, Accounts (Width 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Greeting Banner */}
          <div className="bg-[#eaf4f0] rounded-xl p-5 border border-green-100 flex gap-4 items-start shadow-xs">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 text-[#0a8251] flex items-center justify-center shrink-0 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">Chào {businessProfile.representative},</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Chúc bạn một ngày mới tràn đầy năng lượng. Cùng trải nghiệm để tận hưởng những tính năng tuyệt vời của Fintab nhé!
              </p>
            </div>
          </div>

          {/* Sổ quỹ & Tài khoản Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Funds Balance Summary (Số quỹ) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs p-5 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Số quỹ</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setFundPageIndex(prev => Math.max(0, prev - 1))}
                      disabled={fundPageIndex === 0}
                      className="p-1 rounded bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:bg-slate-800 disabled:opacity-40 transition"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      {fundPageIndex + 1}/{calculatedFundBalances.length}
                    </span>
                    <button 
                      onClick={() => setFundPageIndex(prev => Math.min(calculatedFundBalances.length - 1, prev + 1))}
                      disabled={fundPageIndex === calculatedFundBalances.length - 1}
                      className="p-1 rounded bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:bg-slate-800 disabled:opacity-40 transition"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0a8251] bg-[#eaf4f0] px-2 py-0.5 rounded">
                    {activeFund.name}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2">Số dư cuối kỳ</p>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white">{formatVND(activeFund.balance)}</p>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3 mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#0a8251]" />
                    <span>Tiền vào</span>
                  </div>
                  <span className="font-bold text-[#0a8251]">{formatVND(totalMoneyIn)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-red-500" />
                    <span>Tiền ra</span>
                  </div>
                  <span className="font-bold text-red-500">{formatVND(totalMoneyOut)}</span>
                </div>
              </div>
            </div>

            {/* Tài khoản Ngân hàng List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs p-5 flex flex-col min-h-[220px]">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-3 block">Danh sách tài khoản ngân hàng</span>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] pr-1">
                {calculatedFundBalances.filter(acc => acc.type === 'bank').map((acc) => (
                  <div key={acc.id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50/50 border border-gray-100 dark:border-slate-800/50 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{acc.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{acc.accountNumber || 'Không có số'}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0a8251]">{formatVND(acc.balance)}</span>
                  </div>
                ))}
                {calculatedFundBalances.filter(acc => acc.type === 'bank').length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <DollarSign className="w-8 h-8 opacity-30 mb-1" />
                    <span className="text-xs">Trống</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics (Khách hàng, Đơn bán, Chi phí hoạt động) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs p-5">
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wider">Chi phí vận hành theo khoản mục</h3>
            <div className="space-y-3">
              {filteredTxs.filter(tx => tx.type === 'chi' && tx.category !== 'Giá vốn mua hàng' && !tx.refId).slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                  <div className="space-y-0.5">
                    <p className="font-bold text-gray-800 dark:text-gray-200">{tx.notes || tx.category}</p>
                    <p className="text-[10px] text-gray-400">{tx.date}</p>
                  </div>
                  <span className="font-bold text-red-500">-{formatVND(tx.amount)}</span>
                </div>
              ))}
              {filteredTxs.filter(tx => tx.type === 'chi' && tx.category !== 'Giá vốn mua hàng' && !tx.refId).length === 0 && (
                <div className="text-center py-6 text-gray-400 text-xs">
                  Không phát sinh chi phí vận hành nào trong kỳ lựa chọn.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
