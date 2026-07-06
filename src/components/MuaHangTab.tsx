import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  FileCheck, 
  X, 
  CheckCircle2, 
  Clock, 
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { PurchaseInvoice, Supplier, Product, FundAccount, InvoiceItem } from '../types';

interface MuaHangTabProps {
  purchaseInvoices: PurchaseInvoice[];
  suppliers: Supplier[];
  products: Product[];
  fundAccounts: FundAccount[];
  onAddPurchaseInvoice: (invoice: Omit<PurchaseInvoice, 'id'>) => void;
  onUpdatePurchaseStatus: (id: string, status: 'paid' | 'unpaid', fundAccountId?: string) => void;
  onDeletePurchaseInvoice: (id: string) => void;
}

export default function MuaHangTab({
  purchaseInvoices,
  suppliers,
  products,
  fundAccounts,
  onAddPurchaseInvoice,
  onUpdatePurchaseStatus,
  onDeletePurchaseInvoice
}: MuaHangTabProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [purchaseDate, setPurchaseDate] = useState('2026-07-03');
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [discount, setDiscount] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(true);
  const [formFundAccountId, setFormFundAccountId] = useState(fundAccounts[0]?.id || '');
  const [formNotes, setFormNotes] = useState('');

  // Selected items in purchase order
  const [items, setItems] = useState<Omit<InvoiceItem, 'productName' | 'amount' | 'vatRate'>[]>([
    { productId: products[0]?.id || '', quantity: 10, price: products[0]?.inputPrice || 0 }
  ]);

  const handleAddItemRow = () => {
    const firstProd = products[0];
    if (!firstProd) return;
    setItems([
      ...items,
      { productId: firstProd.id, quantity: 10, price: firstProd.inputPrice }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleRowProductChange = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    const newItems = [...items];
    newItems[index] = {
      productId: prodId,
      quantity: 10,
      price: prod.inputPrice
    };
    setItems(newItems);
  };

  const handleRowFieldChange = (index: number, field: 'quantity' | 'price', value: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const handleOpenCreation = () => {
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    if (suppliers.length > 0) setSelectedSupplierId(suppliers[0].id);
    setDiscount(0);
    setIsPaid(true);
    setFormNotes('');
    if (fundAccounts.length > 0) setFormFundAccountId(fundAccounts[0].id);
    
    if (products.length > 0) {
      setItems([{
        productId: products[0].id,
        quantity: 10,
        price: products[0].inputPrice
      }]);
    }
    setShowPurchaseModal(true);
  };

  // Compute live subtotal of form
  let formSubtotal = 0;
  const computedPurchaseItems: InvoiceItem[] = items.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const prodName = prod ? prod.name : 'Vật tư lạ';
    const amount = item.quantity * item.price;
    formSubtotal += amount;

    return {
      productId: item.productId,
      productName: prodName,
      quantity: item.quantity,
      price: item.price,
      vatRate: 0, // Purchases are recorded gross or tax exempt for simplicity
      amount: amount
    };
  });

  const formGrandTotal = Math.max(0, formSubtotal - discount);

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert('Vui lòng chọn nhà cung cấp!');
      return;
    }

    const supp = suppliers.find(s => s.id === selectedSupplierId);
    if (!supp) return;

    // Build Purchase Code, e.g. HDMH260703-01
    const dateFormatted = purchaseDate.replace(/-/g, '').substring(2);
    const dayCount = purchaseInvoices.filter(inv => inv.date === purchaseDate).length + 1;
    const purchaseCode = `HDMH${dateFormatted}-${String(dayCount).padStart(2, '0')}`;

    onAddPurchaseInvoice({
      code: purchaseCode,
      date: purchaseDate,
      supplierId: selectedSupplierId,
      supplierName: supp.name,
      items: computedPurchaseItems,
      discount: discount,
      totalAmount: Math.round(formGrandTotal),
      status: isPaid ? 'paid' : 'unpaid',
      fundAccountId: isPaid ? formFundAccountId : undefined,
      notes: formNotes || `Nhập hàng từ nhà cung cấp ${supp.name}`
    });

    setShowPurchaseModal(false);
  };

  const handlePayUnpaidInvoice = (inv: PurchaseInvoice) => {
    const accId = prompt(`Chọn Tài khoản trả tiền:\n${fundAccounts.map((fa, i) => `${i + 1}. ${fa.name}`).join('\n')}\nNhập số thứ tự:`, '1');
    if (!accId) return;
    const index = parseInt(accId) - 1;
    const selectedAcc = fundAccounts[index];
    if (selectedAcc) {
      onUpdatePurchaseStatus(inv.id, 'paid', selectedAcc.id);
      alert('Ghi nhận chi quỹ thành công!');
    } else {
      alert('Lựa chọn không hợp lệ!');
    }
  };

  const filteredPurchases = purchaseInvoices.filter(inv => {
    return (
      inv.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.notes && inv.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50 dark:bg-slate-900/50/50 min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Mua hàng & Nhập kho</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Quản lý hóa đơn mua gỗ thô, vật tư phụ kiện và công nợ nhà cung cấp</p>
        </div>

        <button
          id="btn-add-purchase-invoice"
          onClick={handleOpenCreation}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi nhận đơn mua hàng</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs flex items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn mua, nhà cung cấp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition outline-none"
          />
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          Đã ghi nhận <span className="text-amber-600 font-bold">{filteredPurchases.length}</span> đơn mua hàng
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800/50">
                <th className="py-3.5 px-4">Số chứng từ mua</th>
                <th className="py-3.5 px-4">Ngày mua</th>
                <th className="py-3.5 px-4">Nhà cung cấp vật tư</th>
                <th className="py-3.5 px-4">Chi tiết mặt hàng nhập</th>
                <th className="py-3.5 px-4 text-right">Tổng thanh toán</th>
                <th className="py-3.5 px-4 text-center">Trạng thái quỹ</th>
                <th className="py-3.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPurchases.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:bg-slate-900/50/50 transition">
                  <td className="py-3 px-4 font-bold text-amber-700 whitespace-nowrap">{inv.code}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">{inv.supplierName}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    <span className="font-medium">
                      {inv.items.map(item => `${item.productName} (x${item.quantity})`).join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-extrabold whitespace-nowrap">
                    {formatVND(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {inv.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#0a8251]">
                        <CheckCircle2 className="w-3 h-3 text-[#0a8251]" />
                        Đã chi tiền
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-amber-700">
                        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                        Chưa trả tiền (Nợ NCC)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {inv.status === 'unpaid' && (
                        <button
                          onClick={() => handlePayUnpaidInvoice(inv)}
                          className="p-1.5 text-amber-600 hover:text-white rounded-md hover:bg-amber-600 transition"
                          title="Thanh toán nợ cho nhà cung cấp"
                        >
                          <Wallet className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa chứng từ nhập hàng này? Hàng hóa tương ứng sẽ bị giảm khỏi tồn kho và số quỹ chi ra sẽ được hoàn lại.')) {
                            onDeletePurchaseInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                        title="Xóa đơn nhập hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    Chưa ghi nhận đơn mua vật liệu thô nào. Nhấp "Ghi nhận đơn mua hàng" để nhập chuyến gỗ đầu tiên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-amber-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-100" />
                <span className="font-bold text-sm">Ghi Nhận Hóa Đơn Mua Hàng & Nhập Kho Vật Tư</span>
              </div>
              <button onClick={() => setShowPurchaseModal(false)} className="hover:bg-white dark:bg-slate-900/20 p-1 rounded text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll form body */}
            <form onSubmit={handleCreatePurchase} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Nhà cung cấp vật tư *</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  >
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Ngày lập đơn mua *</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Items Table Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Danh sách vật liệu thô nhập vào</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-100 dark:bg-slate-800 text-[11px] font-bold text-amber-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm dòng nhập hàng</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-800/50 relative group">
                      {/* Product selector dropdown */}
                      <div className="flex-1 min-w-[220px]">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">Tên vật tư hàng hóa nhập</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleRowProductChange(index, e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-amber-600 outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>[{p.sku}] - {p.name} (Định mức đầu vào: {formatVND(p.inputPrice)} / {p.unit})</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="w-24">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">Số lượng mua</label>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          required
                          onChange={(e) => handleRowFieldChange(index, 'quantity', Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-600 outline-none text-center"
                        />
                      </div>

                      {/* Input Unit Price */}
                      <div className="w-32">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">Đơn giá nhập xưởng (đ)</label>
                        <input
                          type="number"
                          value={item.price}
                          min={0}
                          required
                          onChange={(e) => handleRowFieldChange(index, 'price', Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-600 outline-none text-right"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="w-36 text-right">
                        <span className="text-[10px] text-gray-400 font-bold block mb-1">Thành tiền</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white block pt-0.5">{formatVND(item.quantity * item.price)}</span>
                      </div>

                      {/* Remove item button */}
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

              {/* Lower Section: payment option, discounts, totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  {/* Payment */}
                  <div className="bg-gray-50 dark:bg-slate-900/50/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 space-y-3">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block">Giao dịch chi trả & quỹ</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="formPurIsPaid"
                          checked={isPaid}
                          onChange={() => setIsPaid(true)}
                          className="text-amber-600 focus:ring-0"
                        />
                        <span>Trả tiền ngay (Tạo Phiếu Chi)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="formPurIsPaid"
                          checked={!isPaid}
                          onChange={() => setIsPaid(false)}
                          className="text-amber-600 focus:ring-0"
                        />
                        <span>Ghi nhận Nợ phải trả NCC</span>
                      </label>
                    </div>

                    {isPaid && (
                      <div className="pt-2 animate-in fade-in duration-150">
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">Tài khoản chi tiền</label>
                        <select
                          value={formFundAccountId}
                          onChange={(e) => setFormFundAccountId(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-600 outline-none"
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
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Ghi chú giao nhận vật liệu</label>
                    <textarea
                      placeholder="Ghi chú thêm về chuyến gỗ hoặc chứng từ đính kèm..."
                      rows={2.5}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:bg-white dark:bg-slate-900 focus:ring-1 focus:ring-amber-600 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Totals Box */}
                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-xs space-y-3 font-medium">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide block border-b pb-2">Tóm tắt đơn mua</span>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Tổng tiền hàng nhập xưởng:</span>
                    <span className="text-gray-900 dark:text-white font-bold">{formatVND(formSubtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Giảm giá của nhà cung cấp (đ):</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-32 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md px-2 py-0.5 text-right font-bold text-red-500 outline-none"
                    />
                  </div>

                  <div className="border-t pt-2.5 flex justify-between items-center text-sm font-extrabold text-gray-900 dark:text-white bg-white dark:bg-slate-900/40 p-2.5 rounded-lg border">
                    <span className="text-gray-800 dark:text-gray-200">Tổng tiền phải trả:</span>
                    <span className="text-xl text-amber-700">{formatVND(formGrandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-5 py-2 border border-gray-200 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-gray-50 dark:bg-slate-900/50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Xác nhận Nhập kho & Ghi sổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
