import { useState } from 'react';
import { 
  Scale, 
  Wallet, 
  Warehouse, 
  CheckCircle2, 
  Info,
  Edit 
} from 'lucide-react';
import { Product, FundAccount } from '../types';

interface SoDuTabProps {
  products: Product[];
  fundAccounts: FundAccount[];
  onUpdateProductStock: (id: string, stock: number) => void;
  onUpdateFundBalance: (id: string, balance: number) => void;
}

export default function SoDuTab({
  products,
  fundAccounts,
  onUpdateProductStock,
  onUpdateFundBalance
}: SoDuTabProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editType, setEditType] = useState<'product' | 'fund' | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handleStartEdit = (id: string, currentVal: number, type: 'product' | 'fund') => {
    setEditingItemId(id);
    setEditType(type);
    setEditValue(currentVal);
  };

  const handleSave = (id: string) => {
    if (editType === 'product') {
      onUpdateProductStock(id, editValue);
    } else if (editType === 'fund') {
      onUpdateFundBalance(id, editValue);
    }
    setEditingItemId(null);
    setEditType(null);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Số Dư Đầu Kỳ</h1>
        <p className="text-xs text-gray-500 mt-0.5">Thiết lập trạng thái tài chính và số lượng vật tư tồn kho ban đầu khi bắt đầu hạch toán</p>
      </div>

      {/* Info Warning Card */}
      <div className="bg-[#eaf4f0]/60 border border-green-100 rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-[#0a8251] shrink-0 mt-0.5" />
        <div className="text-xs text-gray-700 leading-relaxed">
          <strong>Lưu ý hạch toán chứng từ:</strong> Số dư đầu kỳ nên được nhập một lần duy nhất vào đầu chu kỳ kinh doanh (ví dụ Ngày 01/07/2026). Tất cả các báo cáo doanh số, nhập kho, tồn kho, và sổ quỹ tiếp theo sẽ được cộng dồn lũy kế tự động dựa trên mốc số dư ban đầu này.
        </div>
      </div>

      {/* Grid: 2 columns - left: Funds, right: Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Funds Balances */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Wallet className="w-5 h-5 text-[#0a8251]" />
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Số dư tiền & Tài khoản ban đầu</h3>
          </div>

          <div className="space-y-3">
            {fundAccounts.map((fa) => {
              const isEditing = editingItemId === fa.id && editType === 'fund';
              return (
                <div key={fa.id} className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800">{fa.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono font-medium">{fa.type === 'cash' ? 'Ngăn kéo két tiền mặt' : `STK: ${fa.accountNumber}`}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-28 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-right font-extrabold outline-none focus:ring-1 focus:ring-[#0a8251]"
                        />
                        <button
                          onClick={() => handleSave(fa.id)}
                          className="p-1 bg-[#0a8251] text-white rounded hover:bg-[#075f3b] transition text-[10px] font-bold px-2"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-extrabold text-gray-900">{formatVND(fa.initialBalance)}</span>
                        <button
                          onClick={() => handleStartEdit(fa.id, fa.initialBalance, 'fund')}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#0a8251] transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Stocks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Warehouse className="w-5 h-5 text-amber-600" />
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Số dư hàng tồn kho ban đầu</h3>
          </div>

          <div className="space-y-3">
            {products.map((p) => {
              const isEditing = editingItemId === p.id && editType === 'product';
              return (
                <div key={p.id} className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono font-medium">SKU: {p.sku} | Đơn vị: {p.unit}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-20 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-center font-bold outline-none focus:ring-1 focus:ring-[#0a8251]"
                        />
                        <button
                          onClick={() => handleSave(p.id)}
                          className="p-1 bg-[#0a8251] text-white rounded hover:bg-[#075f3b] transition text-[10px] font-bold px-2"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-gray-700">{p.initialStock} {p.unit}</span>
                        <button
                          onClick={() => handleStartEdit(p.id, p.initialStock, 'product')}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-amber-600 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
