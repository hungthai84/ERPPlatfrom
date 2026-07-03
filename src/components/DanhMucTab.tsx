import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Users, 
  ShoppingBag, 
  UserCheck, 
  Wallet, 
  X, 
  CheckCircle2, 
  FolderPlus 
} from 'lucide-react';
import { Product, Customer, Supplier, FundAccount, SectorType } from '../types';

interface DanhMucTabProps {
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  fundAccounts: FundAccount[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onAddCustomer: (cust: Omit<Customer, 'id'>) => void;
  onAddSupplier: (supp: Omit<Supplier, 'id'>) => void;
  onAddFundAccount: (fa: Omit<FundAccount, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteCustomer: (id: string) => void;
  onDeleteSupplier: (id: string) => void;
  onDeleteFundAccount: (id: string) => void;
}

type SubTabType = 'products' | 'customers' | 'suppliers' | 'funds';

export default function DanhMucTab({
  products,
  customers,
  suppliers,
  fundAccounts,
  onAddProduct,
  onAddCustomer,
  onAddSupplier,
  onAddFundAccount,
  onDeleteProduct,
  onDeleteCustomer,
  onDeleteSupplier,
  onDeleteFundAccount
}: DanhMucTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states - Products
  const [prodSku, setProdSku] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodUnit, setProdUnit] = useState('cái');
  const [prodInputPrice, setProdInputPrice] = useState<number | ''>('');
  const [prodSellingPrice, setProdSellingPrice] = useState<number | ''>('');
  const [prodSectorType, setProdSectorType] = useState<SectorType>(1);

  // Form states - Contacts (Customer/Supplier)
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactMst, setContactMst] = useState('');

  // Form states - Funds
  const [fundName, setFundName] = useState('');
  const [fundType, setFundType] = useState<'cash' | 'bank'>('cash');
  const [fundAccountNumber, setFundAccountNumber] = useState('');
  const [fundInitialBalance, setFundInitialBalance] = useState<number | ''>('');

  // Auto-generate SKUs or Code when opening modal
  const handleOpenAddModal = () => {
    // Clear all fields
    setProdSku(`SP${String(products.length + 1).padStart(3, '0')}`);
    setProdName('');
    setProdInputPrice('');
    setProdSellingPrice('');
    setProdSectorType(1);

    setContactName('');
    setContactPhone('');
    setContactAddress('');
    setContactMst('');

    setFundName('');
    setFundType('cash');
    setFundAccountNumber('');
    setFundInitialBalance('');

    setShowAddModal(true);
  };

  // Submit master items
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeSubTab === 'products') {
      if (!prodSku || !prodName || prodInputPrice === '' || prodSellingPrice === '') return;
      onAddProduct({
        sku: prodSku,
        name: prodName,
        unit: prodUnit,
        inputPrice: Number(prodInputPrice),
        sellingPrice: Number(prodSellingPrice),
        initialStock: 0,
        sectorType: prodSectorType
      });
    } else if (activeSubTab === 'customers') {
      if (!contactName) return;
      onAddCustomer({
        name: contactName,
        phone: contactPhone,
        address: contactAddress,
        mst: contactMst || undefined
      });
    } else if (activeSubTab === 'suppliers') {
      if (!contactName) return;
      onAddSupplier({
        name: contactName,
        phone: contactPhone,
        address: contactAddress,
        mst: contactMst || undefined
      });
    } else if (activeSubTab === 'funds') {
      if (!fundName || fundInitialBalance === '') return;
      onAddFundAccount({
        name: fundName,
        type: fundType,
        accountNumber: fundType === 'bank' ? fundAccountNumber : undefined,
        initialBalance: Number(fundInitialBalance)
      });
    }

    setShowAddModal(false);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Danh Mục Cơ Sở</h1>
          <p className="text-xs text-gray-500 mt-0.5">Khai báo cấu trúc danh sách sản phẩm, hồ sơ đối tác và hệ thống quỹ thu chi</p>
        </div>

        <button
          id="btn-add-registry"
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap border-b border-gray-200">
        <button
          onClick={() => { setActiveSubTab('products'); setSearchQuery(''); }}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap ${activeSubTab === 'products' ? 'border-[#0a8251] text-[#0a8251]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sản phẩm & Dịch vụ ({products.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('customers'); setSearchQuery(''); }}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap ${activeSubTab === 'customers' ? 'border-[#0a8251] text-[#0a8251]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Users className="w-4 h-4" />
          <span>Danh sách Khách hàng ({customers.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('suppliers'); setSearchQuery(''); }}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap ${activeSubTab === 'suppliers' ? 'border-[#0a8251] text-[#0a8251]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Nhà cung cấp vật tư ({suppliers.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('funds'); setSearchQuery(''); }}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap ${activeSubTab === 'funds' ? 'border-[#0a8251] text-[#0a8251]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Wallet className="w-4 h-4" />
          <span>Sổ quỹ & Tài khoản ngân hàng ({fundAccounts.length})</span>
        </button>
      </div>

      {/* Search Input Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'products' ? "Tìm theo mã SKU, tên vật tư..." :
              activeSubTab === 'funds' ? "Tìm tên tài khoản..." : "Tìm tên đối tác, số điện thoại..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none transition"
          />
        </div>
      </div>

      {/* Render Lists depending on Sub-Tab */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {activeSubTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-4">Tên vật liệu / sản phẩm</th>
                  <th className="py-3 px-4 text-center">Đơn vị tính</th>
                  <th className="py-3 px-4 text-right">Định mức mua vào (giá vốn)</th>
                  <th className="py-3 px-4 text-right">Giá bán đề xuất (chưa giảm)</th>
                  <th className="py-3 px-4 text-center">Phân loại biểu thuế TT40</th>
                  <th className="py-3 px-4 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {products.filter(p => p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => {
                  const sectorNames = [
                    '1. Phân phối hàng hóa (Thuế 1.5%)',
                    '2. Dịch vụ nội thất (Thuế 7%)',
                    '3. Sản xuất / Gia công (Thuế 4.5%)',
                    '4. Kinh doanh khác (Thuế 3%)'
                  ];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-700">{p.sku}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{p.name}</td>
                      <td className="py-3 px-4 text-center text-gray-500 font-medium">{p.unit}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-bold">{formatVND(p.inputPrice)}</td>
                      <td className="py-3 px-4 text-right text-[#0a8251] font-extrabold">{formatVND(p.sellingPrice)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                          {sectorNames[p.sectorType - 1]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm('Xóa sản phẩm này ra khỏi cơ sở dữ liệu? Sẽ không ảnh hưởng tới hóa đơn cũ nhưng không thể lập hóa đơn mới.')) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {(activeSubTab === 'customers' || activeSubTab === 'suppliers') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
                  <th className="py-3 px-4">Họ và tên / Tên Doanh nghiệp</th>
                  <th className="py-3 px-4">Số điện thoại liên hệ</th>
                  <th className="py-3 px-4">Địa chỉ giao dịch</th>
                  <th className="py-3 px-4">Mã số thuế (nếu có)</th>
                  <th className="py-3 px-4 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {(activeSubTab === 'customers' ? customers : suppliers)
                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone && c.phone.includes(searchQuery)))
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{c.name}</td>
                      <td className="py-3 px-4 font-mono text-gray-600 font-medium">{c.phone || 'Chưa cập nhật'}</td>
                      <td className="py-3 px-4 text-gray-500">{c.address || 'Chưa cập nhật'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-700">{c.mst || '--'}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm('Xóa đối tác này khỏi danh mục lưu trữ?')) {
                              if (activeSubTab === 'customers') onDeleteCustomer(c.id);
                              else onDeleteSupplier(c.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'funds' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
                  <th className="py-3 px-4">Tên tài khoản quỹ tài chính</th>
                  <th className="py-3 px-4">Loại hình</th>
                  <th className="py-3 px-4">Số tài khoản / Ký hiệu</th>
                  <th className="py-3 px-4 text-right">Số dư khởi tạo đầu kỳ</th>
                  <th className="py-3 px-4 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {fundAccounts.filter(fa => fa.name.toLowerCase().includes(searchQuery.toLowerCase())).map((fa) => (
                  <tr key={fa.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{fa.name}</td>
                    <td className="py-3 px-4 font-medium">
                      {fa.type === 'cash' ? (
                        <span className="bg-emerald-50 text-[#0a8251] px-2 py-0.5 rounded text-[10px] font-bold">Tiền mặt tại quỹ</span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Ngân hàng chuyển khoản</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 font-bold">{fa.accountNumber || 'Không có (Tiền mặt)'}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-extrabold">{formatVND(fa.initialBalance)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('Xóa tài khoản quỹ này? Hãy đảm bảo không còn chứng từ nào đang tham chiếu tới quỹ này.')) {
                            onDeleteFundAccount(fa.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Dialog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#0a8251] text-white flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <FolderPlus className="w-4.5 h-4.5" />
                Thêm danh mục {
                  activeSubTab === 'products' ? 'Sản phẩm mới' :
                  activeSubTab === 'customers' ? 'Khách hàng mới' :
                  activeSubTab === 'suppliers' ? 'Nhà cung cấp mới' : 'Tài khoản quỹ mới'
                }
              </span>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/20 rounded text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {/* Product addition fields */}
              {activeSubTab === 'products' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Mã SKU *</label>
                      <input
                        type="text"
                        required
                        value={prodSku}
                        onChange={(e) => setProdSku(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Đơn vị tính *</label>
                      <input
                        type="text"
                        required
                        value={prodUnit}
                        onChange={(e) => setProdUnit(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Tên vật tư / sản phẩm *</label>
                    <input
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Đơn giá mua (giá vốn) *</label>
                      <input
                        type="number"
                        placeholder="đ"
                        required
                        value={prodInputPrice}
                        onChange={(e) => setProdInputPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none text-right font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Đơn giá bán sỉ/lẻ *</label>
                      <input
                        type="number"
                        placeholder="đ"
                        required
                        value={prodSellingPrice}
                        onChange={(e) => setProdSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none text-right font-semibold text-[#0a8251]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Nhóm biểu phí thuế (Thông tư 40) *</label>
                    <select
                      value={prodSectorType}
                      onChange={(e) => setProdSectorType(Number(e.target.value) as SectorType)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                    >
                      <option value={1}>Nhóm 1: Phân phối, cung cấp gỗ, sản phẩm gỗ thô (Thuế 1.5%)</option>
                      <option value={2}>Nhóm 2: Dịch vụ, công lắp ráp nội thất (Thuế 7.0%)</option>
                      <option value={3}>Nhóm 3: Gia công, mộc, sản xuất đồ mỹ nghệ có bao thầu (Thuế 4.5%)</option>
                      <option value={4}>Nhóm 4: Các hoạt động thương mại khác (Thuế 3.0%)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Customers or Suppliers addition fields */}
              {(activeSubTab === 'customers' || activeSubTab === 'suppliers') && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Tên đối tác / Tên Đơn vị *</label>
                    <input
                      type="text"
                      placeholder="Nhập họ tên hoặc tên công ty..."
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại..."
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Địa chỉ liên lạc giao dịch</label>
                    <input
                      type="text"
                      placeholder="Nhập số nhà, tên đường, khu vực..."
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Mã số thuế doanh nghiệp (nếu có)</label>
                    <input
                      type="text"
                      placeholder="MST..."
                      value={contactMst}
                      onChange={(e) => setContactMst(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono"
                    />
                  </div>
                </>
              )}

              {/* Funds addition fields */}
              {activeSubTab === 'funds' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Tên tài khoản quỹ *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Két tiền showroom, Ngân hàng ACB..."
                      required
                      value={fundName}
                      onChange={(e) => setFundName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Phân loại quỹ *</label>
                    <select
                      value={fundType}
                      onChange={(e) => setFundType(e.target.value as 'cash' | 'bank')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none"
                    >
                      <option value="cash">Tiền mặt tại showroom</option>
                      <option value="bank">Tài khoản Ngân hàng chuyển khoản</option>
                    </select>
                  </div>

                  {fundType === 'bank' && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Số tài khoản ngân hàng *</label>
                      <input
                        type="text"
                        placeholder="Nhập số tài khoản..."
                        required
                        value={fundAccountNumber}
                        onChange={(e) => setFundAccountNumber(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none font-mono font-bold"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Số dư khởi đầu kỳ hạch toán (đ) *</label>
                    <input
                      type="number"
                      placeholder="Nhập số tiền..."
                      required
                      value={fundInitialBalance}
                      onChange={(e) => setFundInitialBalance(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] outline-none text-right font-extrabold"
                    />
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a8251] hover:bg-[#075f3b] text-white text-xs font-bold rounded-lg transition"
                >
                  Xác nhận lưu trữ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
