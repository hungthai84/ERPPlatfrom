import { useState } from 'react';
import { 
  Layers, 
  Search, 
  ArrowRightLeft, 
  FileText, 
  Download, 
  BookOpen 
} from 'lucide-react';
import { Transaction, SalesInvoice, PurchaseInvoice, FundAccount } from '../types';

interface TongHopTabProps {
  transactions: Transaction[];
  salesInvoices: SalesInvoice[];
  purchaseInvoices: PurchaseInvoice[];
  fundAccounts: FundAccount[];
}

export default function TongHopTab({
  transactions,
  salesInvoices,
  purchaseInvoices,
  fundAccounts
}: TongHopTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sổ nhật ký chung - aggregate all events chronologically
  const journalEntries: {
    id: string;
    date: string;
    docNo: string;
    description: string;
    partner: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
  }[] = [];

  // 1. Process Sales Invoices
  salesInvoices.forEach(inv => {
    // Debit Fund or Accounts Receivable (Phải thu khách hàng - 131)
    const debitAcc = inv.status === 'paid' ? '111/112 (Tiền mặt/Ngân hàng)' : '131 (Phải thu Khách hàng)';
    
    journalEntries.push({
      id: `je-sales-${inv.id}`,
      date: inv.date,
      docNo: inv.code,
      description: `Ghi nhận doanh thu bán hàng lẻ theo hóa đơn ${inv.code}`,
      partner: inv.customerName,
      debitAccount: debitAcc,
      creditAccount: '511 (Doanh thu bán hàng)',
      amount: inv.totalAmount - inv.totalVat
    });

    // Tax portion
    if (inv.totalVat > 0) {
      journalEntries.push({
        id: `je-sales-vat-${inv.id}`,
        date: inv.date,
        docNo: inv.code,
        description: `Thuế GTGT phải nộp tính trên doanh thu bán lẻ`,
        partner: inv.customerName,
        debitAccount: debitAcc,
        creditAccount: '3331 (Thuế GTGT phải nộp)',
        amount: inv.totalVat
      });
    }
  });

  // 2. Process Purchase Invoices
  purchaseInvoices.forEach(inv => {
    // Credit Fund or Accounts Payable (Phải trả người bán - 331)
    const creditAcc = inv.status === 'paid' ? '111/112 (Tiền mặt/Ngân hàng)' : '331 (Phải trả Người bán)';
    
    journalEntries.push({
      id: `je-pur-${inv.id}`,
      date: inv.date,
      docNo: inv.code,
      description: `Nhập kho nguyên vật liệu hàng hóa gỗ từ ${inv.supplierName}`,
      partner: inv.supplierName,
      debitAccount: '156 (Hàng hóa tồn kho)',
      creditAccount: creditAcc,
      amount: inv.totalAmount
    });
  });

  // 3. Process General cashbook entries (Expenses not linked to invoices)
  transactions.forEach(tx => {
    if (tx.refId) return; // Skip linked payments to prevent double counting since invoices already register their journals above!

    const faName = fundAccounts.find(fa => fa.id === tx.fundAccountId)?.name || 'Quỹ tiền';
    const cashAccCode = faName.includes('mặt') ? '111 (Tiền mặt)' : '112 (Tiền gửi ngân hàng)';

    if (tx.type === 'thu') {
      journalEntries.push({
        id: `je-tx-${tx.id}`,
        date: tx.date,
        docNo: `PT-${tx.id.substring(3, 8).toUpperCase()}`,
        description: tx.notes || `Nhận tiền quỹ: ${tx.category}`,
        partner: tx.contactName || 'Khách vãng lai',
        debitAccount: cashAccCode,
        creditAccount: '711 (Thu nhập khác)',
        amount: tx.amount
      });
    } else {
      journalEntries.push({
        id: `je-tx-${tx.id}`,
        date: tx.date,
        docNo: `PC-${tx.id.substring(3, 8).toUpperCase()}`,
        description: tx.notes || `Chi hoạt động: ${tx.category}`,
        partner: tx.contactName || 'Người nhận tiền',
        debitAccount: '642 (Chi phí quản lý kinh doanh)',
        creditAccount: cashAccCode,
        amount: tx.amount
      });
    }
  });

  // Sort chronologically (newest first)
  const sortedEntries = journalEntries.sort((a, b) => b.date.localeCompare(a.date));

  const filteredEntries = sortedEntries.filter(entry => {
    return (
      entry.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.partner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Sổ Nhật Ký Chung</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Sổ kế toán tổng hợp ghi chép toàn bộ nghiệp vụ theo trình tự thời gian</p>
        </div>

        {/* Action triggers */}
        <button
          onClick={() => alert('Đã kết xuất dữ liệu Sổ Nhật Ký Chung ra file Excel mẫu thành công!')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#eaf4f0] text-[#0a8251] text-xs font-bold rounded-xl hover:bg-green-100 transition shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Xuất File Sổ Kế Toán</span>
        </button>
      </div>

      {/* Info Notice card */}
      <div className="bg-[#eaf4f0]/50 border border-green-100 rounded-xl p-4 flex gap-3 items-start">
        <BookOpen className="w-5 h-5 text-[#0a8251] shrink-0 mt-0.5" />
        <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Thông tư 88/2021/TT-BTC:</strong> Sổ Nhật ký chung là tài liệu nộp nòng cốt bắt buộc đối với hộ kinh doanh nộp thuế theo phương pháp kê khai. Hệ thống Fintab tự động định khoản Nợ/Có (Debits/Credits) dựa trên các giao dịch thực tế của bạn mà không yêu cầu kiến thức kế toán chuyên sâu.
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs flex items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo số chứng từ, đối tác hoặc nội dung hạch toán..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none transition"
          />
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          Lũy kế có <span className="text-[#0a8251] font-bold">{filteredEntries.length}</span> bút toán kế toán
        </div>
      </div>

      {/* Journal entries tables */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800/50">
                <th className="py-3.5 px-4">Ngày ghi nhận</th>
                <th className="py-3.5 px-4">Số hiệu chứng từ</th>
                <th className="py-3.5 px-4">Diễn giải nội dung hạch toán</th>
                <th className="py-3.5 px-4">Tác nhân đối tác</th>
                <th className="py-3.5 px-4">Tài khoản Nợ (Debit)</th>
                <th className="py-3.5 px-4">Tài khoản Có (Credit)</th>
                <th className="py-3.5 px-4 text-right">Số tiền phát sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredEntries.map((je, idx) => (
                <tr key={je.id || idx} className="hover:bg-gray-50 dark:bg-slate-900/50/50 transition">
                  <td className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{je.date}</td>
                  <td className="py-3 px-4 font-bold text-[#0a8251] whitespace-nowrap">{je.docNo}</td>
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{je.description}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{je.partner}</td>
                  <td className="py-3 px-4 text-blue-700 font-mono font-bold whitespace-nowrap">{je.debitAccount}</td>
                  <td className="py-3 px-4 text-amber-700 font-mono font-bold whitespace-nowrap">{je.creditAccount}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatVND(je.amount)}
                  </td>
                </tr>
              ))}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    Chưa phát sinh hoạt động hạch toán nào trong Nhật Ký Chung.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
