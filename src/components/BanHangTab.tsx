import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  FileText, 
  X, 
  CheckCircle2, 
  Eye, 
  Clock, 
  Wallet,
  AlertCircle 
} from 'lucide-react';
import { SalesInvoice, Customer, Product, FundAccount, InvoiceItem, BusinessProfile } from '../types';

interface BanHangTabProps {
  salesInvoices: SalesInvoice[];
  customers: Customer[];
  products: Product[];
  fundAccounts: FundAccount[];
  businessProfile: BusinessProfile;
  onAddSalesInvoice: (invoice: Omit<SalesInvoice, 'id'>) => void;
  onUpdateInvoiceStatus: (id: string, status: 'paid' | 'unpaid', fundAccountId?: string) => void;
  onDeleteSalesInvoice: (id: string) => void;
}

export default function BanHangTab({
  salesInvoices,
  customers,
  products,
  fundAccounts,
  businessProfile,
  onAddSalesInvoice,
  onUpdateInvoiceStatus,
  onDeleteSalesInvoice
}: BanHangTabProps) {
  // UI States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Invoice creation state
  const [invoiceDate, setInvoiceDate] = useState('2026-07-03');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [discount, setDiscount] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(true);
  const [formFundAccountId, setFormFundAccountId] = useState(fundAccounts[0]?.id || '');
  const [formNotes, setFormNotes] = useState('');

  // Items in invoice
  const [items, setItems] = useState<Omit<InvoiceItem, 'productName' | 'amount'>[]>([
    { productId: products[0]?.id || '', quantity: 1, price: products[0]?.sellingPrice || 0, vatRate: getVatRateByProductSector(products[0]?.sectorType || 1) }
  ]);

  // Helper to get VAT Rate from product sector
  function getVatRateByProductSector(sectorType: number): number {
    if (sectorType === 1) return 1; // Hàng hóa: 1%
    if (sectorType === 2) return 5; // Dịch vụ: 5%
    if (sectorType === 3) return 3; // Sản xuất/gia công: 3%
    if (sectorType === 4) return 2; // Khác: 2%
    return 0;
  }

  // Handle adding an item row
  const handleAddItemRow = () => {
    const firstProd = products[0];
    if (!firstProd) return;
    setItems([
      ...items,
      { 
        productId: firstProd.id, 
        quantity: 1, 
        price: firstProd.sellingPrice, 
        vatRate: getVatRateByProductSector(firstProd.sectorType) 
      }
    ]);
  };

  // Handle removing an item row
  const handleRemoveItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle product selection change in a row
  const handleRowProductChange = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    const newItems = [...items];
    newItems[index] = {
      productId: prodId,
      quantity: 1,
      price: prod.sellingPrice,
      vatRate: getVatRateByProductSector(prod.sectorType)
    };
    setItems(newItems);
  };

  // Handle general row field updates (quantity, price)
  const handleRowFieldChange = (index: number, field: 'quantity' | 'price', value: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  // Open creation modal
  const handleOpenCreation = () => {
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    if (customers.length > 0) setSelectedCustomerId(customers[0].id);
    setDiscount(0);
    setIsPaid(true);
    setFormNotes('');
    if (fundAccounts.length > 0) setFormFundAccountId(fundAccounts[0].id);
    
    // Seed with one clean item
    if (products.length > 0) {
      setItems([{
        productId: products[0].id,
        quantity: 1,
        price: products[0].sellingPrice,
        vatRate: getVatRateByProductSector(products[0].sectorType)
      }]);
    }
    setShowInvoiceModal(true);
  };

  // Live total calculations of form
  let formSubtotal = 0;
  let formTotalVat = 0;
  const computedInvoiceItems: InvoiceItem[] = items.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const prodName = prod ? prod.name : 'Vật tư lạ';
    const amount = item.quantity * item.price;
    formSubtotal += amount;
    
    // VAT computation on a per-item basis
    const vatAmount = amount * (item.vatRate / 100);
    formTotalVat += vatAmount;

    return {
      productId: item.productId,
      productName: prodName,
      quantity: item.quantity,
      price: item.price,
      vatRate: item.vatRate,
      amount: amount
    };
  });

  // Total invoice is (subtotal - discount) + VAT
  const formGrandTotal = Math.max(0, formSubtotal - discount) + formTotalVat;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Vui lòng chọn khách hàng!');
      return;
    }

    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    // Build Invoice code based on date, e.g. HDBH260703-01
    const dateFormatted = invoiceDate.replace(/-/g, '').substring(2); // Yymmdd
    const dayCount = salesInvoices.filter(inv => inv.date === invoiceDate).length + 1;
    const invoiceCode = `HDBH${dateFormatted}-${String(dayCount).padStart(2, '0')}`;

    onAddSalesInvoice({
      code: invoiceCode,
      date: invoiceDate,
      customerId: selectedCustomerId,
      customerName: cust.name,
      items: computedInvoiceItems,
      discount: discount,
      totalVat: Math.round(formTotalVat),
      totalAmount: Math.round(formGrandTotal),
      status: isPaid ? 'paid' : 'unpaid',
      fundAccountId: isPaid ? formFundAccountId : undefined,
      notes: formNotes || `Bán hàng cho ${cust.name}`
    });

    setShowInvoiceModal(false);
  };

  // Invoice list filters
  const filteredInvoices = salesInvoices.filter(inv => {
    return (
      inv.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.notes && inv.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleViewDetails = (inv: SalesInvoice) => {
    setSelectedInvoice(inv);
    setShowDetailModal(true);
  };

  const handlePayUnpaidInvoice = (inv: SalesInvoice) => {
    const accId = prompt(`Chọn Tài khoản nhận tiền:\n${fundAccounts.map((fa, i) => `${i + 1}. ${fa.name}`).join('\n')}\nNhập số thứ tự:`, '1');
    if (!accId) return;
    const index = parseInt(accId) - 1;
    const selectedAcc = fundAccounts[index];
    if (selectedAcc) {
      onUpdateInvoiceStatus(inv.id, 'paid', selectedAcc.id);
      alert('Ghi nhận thanh toán và lập phiếu thu thành công!');
    } else {
      alert('Lựa chọn không hợp lệ!');
    }
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Hóa đơn bán hàng</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Xử lý đơn xuất hàng, bán lẻ và quản lý công nợ khách hàng</p>
        </div>

        <button
          id="btn-add-sales-invoice"
          onClick={handleOpenCreation}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Lập hóa đơn mới</span>
        </button>
      </div>

      {/* Invoice Filter Options */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs flex items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo số hóa đơn, tên khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] focus:border-[#0a8251] transition outline-none"
          />
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          Tìm thấy <span className="text-[#0a8251] font-bold">{filteredInvoices.length}</span> hóa đơn xuất lẻ
        </div>
      </div>

      {/* Sales Invoice List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800/50">
                <th className="py-3.5 px-4">Mã số hóa đơn</th>
                <th className="py-3.5 px-4">Ngày xuất</th>
                <th className="py-3.5 px-4">Đối tượng khách hàng</th>
                <th className="py-3.5 px-4 text-right">Tổng GTGT đầu ra</th>
                <th className="py-3.5 px-4 text-right">Thành tiền thanh toán</th>
                <th className="py-3.5 px-4 text-center">Trạng thái quỹ</th>
                <th className="py-3.5 px-4 text-center">Xem / Xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:bg-slate-900/50/50 transition">
                  <td className="py-3 px-4 font-bold text-[#0a8251] whitespace-nowrap">{inv.code}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">{inv.customerName}</td>
                  <td className="py-3 px-4 text-right text-purple-600 font-bold whitespace-nowrap">
                    {formatVND(inv.totalVat)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-extrabold whitespace-nowrap">
                    {formatVND(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {inv.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#0a8251]">
                        <CheckCircle2 className="w-3 h-3 text-[#0a8251]" />
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-amber-700">
                        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                        Chưa thu tiền (Nợ)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetails(inv)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-[#0a8251] rounded-md hover:bg-gray-50 dark:bg-slate-900/50 transition"
                        title="Xem chi tiết hóa đơn lẻ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {inv.status === 'unpaid' && (
                        <button
                          onClick={() => handlePayUnpaidInvoice(inv)}
                          className="p-1 text-amber-600 hover:text-white rounded-md hover:bg-amber-600 transition"
                          title="Ghi nhận thanh toán và thu tiền"
                        >
                          <Wallet className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa hóa đơn này? Hàng hóa sẽ được hoàn lại kho và dòng tiền tương ứng sẽ bị loại bỏ.')) {
                            onDeleteSalesInvoice(inv.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                        title="Xóa hóa đơn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    Chưa phát sinh hóa đơn bán lẻ nào. Nhấp "Lập hóa đơn mới" để ghi nhận đơn hàng đầu tiên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Creation Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-[#0a8251] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-100" />
                <span className="font-bold text-sm">Lập Hóa Đơn Bán Hàng Lẻ (Chứng Từ Bán Ra)</span>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="hover:bg-white dark:bg-slate-900/20 p-1 rounded text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Form Scroll Area */}
            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer & General Metadata info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Khách hàng phát sinh *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                    required
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Ngày lập hóa đơn *</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Nhóm ngành nghề thuế</label>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-[11px] text-blue-800 leading-tight">
                    Tính toán thuế suất tự động theo TT40/2021/TT-BTC dựa trên từng vật tư.
                  </div>
                </div>
              </div>

              {/* Items Line selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Chi tiết vật tư, hàng hóa xuất bán</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-100 dark:bg-slate-800 text-[11px] font-bold text-[#0a8251] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm dòng vật tư</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-800/50 relative group">
                      {/* Product Selector */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">Tên vật tư hàng hóa</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleRowProductChange(index, e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#0a8251] outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>[{p.sku}] - {p.name} ({formatVND(p.sellingPrice)} / {p.unit})</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="w-24">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">Số lượng</label>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          required
                          onChange={(e) => handleRowFieldChange(index, 'quantity', Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0a8251] outline-none text-center"
                        />
                      </div>

                      {/* Selling Price */}
                      <div className="w-32">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">Đơn giá bán (đ)</label>
                        <input
                          type="number"
                          value={item.price}
                          min={0}
                          required
                          onChange={(e) => handleRowFieldChange(index, 'price', Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0a8251] outline-none text-right"
                        />
                      </div>

                      {/* Tax category indicator */}
                      <div className="w-28 text-center bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 py-1.5 rounded-md">
                        <span className="text-[10px] text-gray-400 font-bold block">Thuế suất GTGT</span>
                        <span className="text-[11px] font-extrabold text-purple-600">{item.vatRate}%</span>
                      </div>

                      {/* Subtotal */}
                      <div className="w-32 text-right">
                        <span className="text-[10px] text-gray-400 font-bold block mb-1">Thành tiền trước thuế</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white block pt-0.5">{formatVND(item.quantity * item.price)}</span>
                      </div>

                      {/* Remove Row Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(index)}
                        disabled={items.length === 1}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-white dark:bg-slate-900 disabled:opacity-30 self-end md:self-center transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount, Payments, Notes & calculations details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  {/* Payment option */}
                  <div className="bg-gray-50 dark:bg-slate-900/50/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 space-y-3">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide block">Trạng thái dòng tiền & quỹ</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="formIsPaid"
                          checked={isPaid}
                          onChange={() => setIsPaid(true)}
                          className="text-[#0a8251] focus:ring-0"
                        />
                        <span>Khách trả ngay (Ghi nhận Phiếu Thu)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="formIsPaid"
                          checked={!isPaid}
                          onChange={() => setIsPaid(false)}
                          className="text-[#0a8251] focus:ring-0"
                        />
                        <span>Khách mua nợ (Ghi nhận Công Nợ)</span>
                      </label>
                    </div>

                    {isPaid && (
                      <div className="pt-2 animate-in fade-in duration-150">
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">Tài khoản quỹ nhận tiền</label>
                        <select
                          value={formFundAccountId}
                          onChange={(e) => setFormFundAccountId(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#0a8251] outline-none"
                        >
                          {fundAccounts.map(fa => (
                            <option key={fa.id} value={fa.id}>{fa.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Ghi chú, điều khoản giao hàng</label>
                    <textarea
                      placeholder="Thông tin thêm..."
                      rows={2.5}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0a8251] outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Totals Table Calculations */}
                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-xs space-y-3 font-medium">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide block border-b pb-2">Tóm tắt thanh toán</span>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Cộng tiền hàng trước thuế:</span>
                    <span className="text-gray-900 dark:text-white font-bold">{formatVND(formSubtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Chiết khấu / Giảm giá (đ):</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-32 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2 py-0.5 text-right font-bold text-red-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center py-1 text-purple-700">
                    <span className="font-semibold">Thuế GTGT đầu ra (phân bổ theo nhóm mặt hàng):</span>
                    <span className="font-bold">{formatVND(formTotalVat)}</span>
                  </div>

                  <div className="border-t pt-2.5 flex justify-between items-center text-sm font-extrabold text-gray-900 dark:text-white bg-white dark:bg-slate-900/40 p-2.5 rounded-lg border">
                    <span className="text-gray-800 dark:text-gray-200">Tổng cộng tiền thanh toán:</span>
                    <span className="text-xl text-[#0a8251]">{formatVND(formGrandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t shrink-0">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-5 py-2 border border-gray-200 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-gray-50 dark:bg-slate-900/50 transition"
                >
                  Đóng lại
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white text-xs font-bold rounded-lg transition"
                >
                  Xác nhận & Ghi sổ hóa đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Printable Layout Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal action bar */}
            <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-3 border-b flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Mã hóa đơn: {selectedInvoice.code}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="px-3 py-1 bg-[#eaf4f0] text-[#0a8251] text-[11px] font-bold rounded hover:bg-green-100 transition"
                >
                  In hóa đơn
                </button>
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-800 transition">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Invoce paper body */}
            <div className="p-8 space-y-6 bg-white dark:bg-slate-900 font-sans text-xs select-text">
              {/* Shop info / header */}
              <div className="flex justify-between border-b pb-5">
                <div>
                  <h4 className="font-extrabold text-[#0a8251] text-base uppercase">Hộ Kinh Doanh Power Service One</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Mã số thuế: 342535453543</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Địa chỉ: 123 Đường Láng, Láng Hạ, Đống Đa, Hà Nội</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">SĐT: 0987 654 321</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-widest">HÓA ĐƠN BÁN LẺ</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono font-bold">Số: {selectedInvoice.code}</p>
                  <p className="text-[11px] text-gray-400">Ngày lập: {selectedInvoice.date}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-1">
                <p className="font-bold text-gray-900 dark:text-white text-xs">THÔNG TIN KHÁCH HÀNG:</p>
                <p className="text-gray-700 dark:text-gray-300">Tên đơn vị/Người mua: <strong className="text-gray-900 dark:text-white">{selectedInvoice.customerName}</strong></p>
                {customers.find(c => c.id === selectedInvoice.customerId)?.address && (
                  <p className="text-gray-500 dark:text-gray-400">Địa chỉ: {customers.find(c => c.id === selectedInvoice.customerId)?.address}</p>
                )}
                {customers.find(c => c.id === selectedInvoice.customerId)?.phone && (
                  <p className="text-gray-500 dark:text-gray-400">Số điện thoại liên hệ: {customers.find(c => c.id === selectedInvoice.customerId)?.phone}</p>
                )}
              </div>

              {/* Grid List Products */}
              <table className="w-full text-left border-collapse border border-gray-100 dark:border-slate-800/50 mt-4">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-slate-800/50">
                    <th className="py-2.5 px-3 border border-gray-100 dark:border-slate-800/50">STT</th>
                    <th className="py-2.5 px-3 border border-gray-100 dark:border-slate-800/50">Tên vật tư hàng hóa</th>
                    <th className="py-2.5 px-3 border border-gray-100 dark:border-slate-800/50 text-center">Số lượng</th>
                    <th className="py-2.5 px-3 border border-gray-100 dark:border-slate-800/50 text-right">Đơn giá bán</th>
                    <th className="py-2.5 px-3 border border-gray-100 dark:border-slate-800/50 text-center">Thuế GTGT</th>
                    <th className="py-2.5 px-3 border border-gray-100 dark:border-slate-800/50 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:bg-slate-900/50/20">
                      <td className="py-2 px-3 border border-gray-100 dark:border-slate-800/50 text-center">{index + 1}</td>
                      <td className="py-2 px-3 border border-gray-100 dark:border-slate-800/50 font-semibold text-gray-900 dark:text-white">{item.productName}</td>
                      <td className="py-2 px-3 border border-gray-100 dark:border-slate-800/50 text-center font-bold">{item.quantity}</td>
                      <td className="py-2 px-3 border border-gray-100 dark:border-slate-800/50 text-right">{formatVND(item.price)}</td>
                      <td className="py-2 px-3 border border-gray-100 dark:border-slate-800/50 text-center font-bold text-purple-600">{item.vatRate}%</td>
                      <td className="py-2 px-3 border border-gray-100 dark:border-slate-800/50 text-right font-extrabold">{formatVND(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paper Summaries */}
              <div className="w-full flex justify-end">
                <div className="w-72 space-y-2 text-[11px] border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Tổng cộng tiền hàng:</span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {formatVND(selectedInvoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0))}
                    </span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span className="font-medium">Chiết khấu:</span>
                      <span className="font-bold">-{formatVND(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-purple-600">
                    <span className="font-medium">Thuế GTGT hàng bán lẻ:</span>
                    <span className="font-bold">{formatVND(selectedInvoice.totalVat)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-xs font-extrabold text-[#0a8251] bg-[#eaf4f0]/30 p-2 rounded">
                    <span>Tổng tiền thanh toán:</span>
                    <span className="text-sm font-extrabold">{formatVND(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 text-center pt-8 border-t border-dashed">
                <div className="space-y-12">
                  <p className="font-bold text-gray-600 dark:text-gray-400">NGƯỜI MUA HÀNG</p>
                  <p className="text-gray-400 text-[10px] italic">(Ký, ghi rõ họ tên)</p>
                </div>
                <div className="space-y-12">
                  <p className="font-bold text-gray-900 dark:text-white uppercase">Đại Diện Hộ Kinh Doanh</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200 pt-6">{businessProfile.representative}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
