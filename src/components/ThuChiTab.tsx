import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  SlidersHorizontal, 
  X, 
  Check, 
  Filter 
} from 'lucide-react';
import { Transaction, FundAccount, TransactionType } from '../types';

interface ThuChiTabProps {
  transactions: Transaction[];
  fundAccounts: FundAccount[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function ThuChiTab({
  transactions,
  fundAccounts,
  onAddTransaction,
  onDeleteTransaction
}: ThuChiTabProps) {
  // Modal visibility
  const [showSlipModal, setShowSlipModal] = useState(false);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'thu' | 'chi'>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Form states
  const [formType, setFormType] = useState<TransactionType>('thu');
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>('');
  const [formDate, setFormDate] = useState('2026-07-03');
  const [formAccount, setFormAccount] = useState(fundAccounts[0]?.id || '');
  const [formContactName, setFormContactName] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Default Categories for quick selection
  const thuCategories = [
    'Doanh thu bán hàng',
    'Thu hồi công nợ',
    'Chênh lệch kiểm kê thừa',
    'Thu nhập tài chính khác'
  ];

  const chiCategories = [
    'Chi phí thuê mặt bằng',
    'Chi phí điện, nước, internet',
    'Chi lương nhân sự',
    'Mua sắm trang thiết bị',
    'Chi trả nhà cung cấp',
    'Chi phí dịch vụ khác'
  ];

  // Set default category when formType changes
  const handleTypeChange = (type: TransactionType) => {
    setFormType(type);
    setFormCategory(type === 'thu' ? thuCategories[0] : chiCategories[0]);
  };

  const handleOpenModal = () => {
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormType('thu');
    setFormCategory(thuCategories[0]);
    setFormAmount('');
    setFormContactName('');
    setFormNotes('');
    if (fundAccounts.length > 0) {
      setFormAccount(fundAccounts[0].id);
    }
    setShowSlipModal(true);
  };

  // Submit slip
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || formAmount <= 0 || !formCategory || !formAccount) {
      alert('Vui lòng điền đầy đủ số tiền, hạng mục thu/chi và tài khoản quỹ!');
      return;
    }

    onAddTransaction({
      type: formType,
      category: formCategory,
      amount: Number(formAmount),
      date: formDate,
      contactName: formContactName || undefined,
      fundAccountId: formAccount,
      notes: formNotes || `${formType === 'thu' ? 'Phiếu thu' : 'Phiếu chi'} - ${formCategory}`
    });

    setShowSlipModal(false);
  };

  // Filter logic
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.contactName && tx.contactName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesAccount = filterAccount === 'all' || tx.fundAccountId === filterAccount;

    return matchesSearch && matchesType && matchesAccount;
  });

  // Calculate quick stats of current list
  const totalIn = filteredTransactions
    .filter(tx => tx.type === 'thu')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = filteredTransactions
    .filter(tx => tx.type === 'chi')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Tab Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Sổ quỹ & Thu chi</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Quản lý dòng tiền mặt và ngân hàng của hộ kinh doanh</p>
        </div>

        <button
          id="btn-add-tx"
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Lập phiếu Thu / Chi</span>
        </button>
      </div>

      {/* Financial Overview Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng Thu (Lọc)</span>
            <p className="text-lg font-extrabold text-[#0a8251] mt-1">{formatVND(totalIn)}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-green-50 text-[#0a8251] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng Chi (Lọc)</span>
            <p className="text-lg font-extrabold text-red-500 mt-1">{formatVND(totalOut)}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dòng tiền thuần (Lọc)</span>
            <p className={`text-lg font-extrabold mt-1 ${totalIn - totalOut >= 0 ? 'text-[#0a8251]' : 'text-red-500'}`}>
              {formatVND(totalIn - totalOut)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục, người nhận, ghi chú..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] focus:border-[#0a8251] transition outline-none"
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap gap-3 items-center">
          {/* Group Filter */}
          <div className="flex bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${filterType === 'all' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('thu')}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${filterType === 'thu' ? 'bg-white dark:bg-slate-900 text-[#0a8251] shadow-xs' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Thu
            </button>
            <button
              onClick={() => setFilterType('chi')}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${filterType === 'chi' ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Chi
            </button>
          </div>

          {/* Account Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="text-xs bg-transparent border-none text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer py-0 font-medium"
            >
              <option value="all">Mọi tài khoản quỹ</option>
              {fundAccounts.map(fa => (
                <option key={fa.id} value={fa.id}>{fa.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800/50">
                <th className="py-3.5 px-4">Ngày ghi nhận</th>
                <th className="py-3.5 px-4">Phân loại</th>
                <th className="py-3.5 px-4">Khoản mục / Hạng mục</th>
                <th className="py-3.5 px-4 text-right">Số tiền</th>
                <th className="py-3.5 px-4">Quỹ tài chính</th>
                <th className="py-3.5 px-4">Đối tượng tác nhân</th>
                <th className="py-3.5 px-4">Diễn giải / Ghi chú</th>
                <th className="py-3.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredTransactions.map((tx) => {
                const faName = fundAccounts.find(fa => fa.id === tx.fundAccountId)?.name || 'Chưa liên kết';
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:bg-slate-900/50/50 transition">
                    <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {tx.type === 'thu' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#0a8251]">
                          THU (Tiền vào)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-500">
                          CHI (Tiền ra)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{tx.category}</td>
                    <td className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${tx.type === 'thu' ? 'text-[#0a8251]' : 'text-red-500'}`}>
                      {tx.type === 'thu' ? '+' : '-'}{formatVND(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{faName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap font-medium">{tx.contactName || 'Không xác định'}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={tx.notes}>{tx.notes}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn xóa phiếu hạch toán này? Số quỹ sẽ tự động hoàn lại tương ứng.')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Xóa phiếu hạch toán"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                    Không tìm thấy chứng từ thu chi nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Modal Form */}
      {showSlipModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-[#0a8251] text-white flex items-center justify-between">
              <span className="font-bold text-sm">Lập Phiếu Chứng Từ Thu / Chi</span>
              <button onClick={() => setShowSlipModal(false)} className="hover:bg-white dark:bg-slate-900/20 p-1 rounded text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type selector toggle button */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Loại chứng từ</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('thu')}
                    className={`py-2 text-xs font-bold rounded-md transition ${formType === 'thu' ? 'bg-[#0a8251] text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    Phiếu Thu (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('chi')}
                    className={`py-2 text-xs font-bold rounded-md transition ${formType === 'chi' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    Phiếu Chi (-)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Số tiền (đ) *</label>
                <input
                  type="number"
                  placeholder="Nhập số tiền..."
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Ngày ghi nhận sổ *</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                />
              </div>

              {/* Category Hạng Mục */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Hạng mục thu chi *</label>
                <div className="flex gap-2">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                  >
                    {(formType === 'thu' ? thuCategories : chiCategories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">-- Nhập hạng mục khác --</option>
                  </select>
                </div>
                {formCategory === 'custom' && (
                  <input
                    type="text"
                    placeholder="Nhập hạng mục tùy chỉnh mới..."
                    required
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs mt-2 focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                  />
                )}
              </div>

              {/* Fund account */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Tài khoản quỹ nhận/chi *</label>
                <select
                  value={formAccount}
                  onChange={(e) => setFormAccount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                >
                  {fundAccounts.map(fa => (
                    <option key={fa.id} value={fa.id}>{fa.name} ({fa.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng'})</option>
                  ))}
                </select>
              </div>

              {/* Partner Name (Contact) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Đối tượng phát sinh (Khách hàng / NCC)</label>
                <input
                  type="text"
                  placeholder="Tên đối tác hoặc cá nhân..."
                  value={formContactName}
                  onChange={(e) => setFormContactName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Diễn giải / Ghi chú</label>
                <textarea
                  placeholder="Nội dung chi tiết..."
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-gray-50 dark:bg-slate-900/50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition ${formType === 'thu' ? 'bg-[#0a8251] hover:bg-[#075f3b]' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Ghi Sổ Phiếu {formType === 'thu' ? 'Thu' : 'Chi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
