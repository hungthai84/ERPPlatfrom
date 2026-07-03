import { useState } from 'react';
import { 
  Warehouse, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  Edit, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { Product, SalesInvoice, PurchaseInvoice } from '../types';

interface KhoTabProps {
  products: Product[];
  salesInvoices: SalesInvoice[];
  purchaseInvoices: PurchaseInvoice[];
  onUpdateProductStock: (id: string, initialStock: number) => void;
}

export default function KhoTab({
  products,
  salesInvoices,
  purchaseInvoices,
  onUpdateProductStock
}: KhoTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Filter products by query
  const filteredProducts = products.filter(p => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate dynamics for each product in the warehouse
  const getProductStockSummary = (p: Product) => {
    // 1. Stock In (from purchase invoices)
    let stockIn = 0;
    purchaseInvoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.productId === p.id) {
          stockIn += item.quantity;
        }
      });
    });

    // 2. Stock Out (from sales invoices)
    let stockOut = 0;
    salesInvoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.productId === p.id) {
          stockOut += item.quantity;
        }
      });
    });

    // 3. Current Stock
    const currentStock = p.initialStock + stockIn - stockOut;

    // 4. Value of inventory (based on input cost)
    const inventoryValue = currentStock * p.inputPrice;

    return {
      stockIn,
      stockOut,
      currentStock,
      inventoryValue
    };
  };

  // Quick total calculations
  let grandTotalInventoryValue = 0;
  let totalStockUnits = 0;
  let criticalStockCount = 0;

  products.forEach(p => {
    const summary = getProductStockSummary(p);
    grandTotalInventoryValue += summary.inventoryValue;
    totalStockUnits += summary.currentStock;
    if (summary.currentStock < 5) {
      criticalStockCount++;
    }
  });

  const handleStartEditing = (p: Product) => {
    setEditingProductId(p.id);
    setTempStockValue(p.initialStock);
  };

  const handleSaveInitialStock = (pId: string) => {
    onUpdateProductStock(pId, tempStockValue);
    setEditingProductId(null);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sổ kho & Tồn kho</h1>
        <p className="text-xs text-gray-500 mt-0.5">Giám sát số dư nhập, xuất và giá trị tồn kho của các dòng vật tư sản phẩm</p>
      </div>

      {/* Grid Quick Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total value */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng giá trị tồn kho (Giá vốn)</span>
            <p className="text-lg font-extrabold text-[#0a8251] mt-1">{formatVND(grandTotalInventoryValue)}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-green-50 text-[#0a8251] flex items-center justify-center">
            <Warehouse className="w-5 h-5" />
          </div>
        </div>

        {/* Total units */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng số lượng sản phẩm lưu kho</span>
            <p className="text-lg font-extrabold text-blue-600 mt-1">{totalStockUnits} đơn vị</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Warning stocks */}
        <div className="bg-white p-4 rounded-xl border border-[#fee2e2] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Sản phẩm sắp hết hàng (&lt; 5 chiếc)</span>
            <p className="text-lg font-extrabold text-red-500 mt-1">{criticalStockCount} mặt hàng</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo SKU hoặc tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-[#0a8251] focus:border-[#0a8251] transition outline-none"
          />
        </div>
        <div className="text-[11px] text-gray-500 font-medium">
          Hiển thị <span className="text-[#0a8251] font-bold">{filteredProducts.length}</span> danh mục sản phẩm kho
        </div>
      </div>

      {/* Stock Ledger Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-4">Mã SKU</th>
                <th className="py-3.5 px-4">Tên hàng hóa / vật tư</th>
                <th className="py-3.5 px-4">Đơn vị</th>
                <th className="py-3.5 px-4 text-center">Tồn đầu kỳ</th>
                <th className="py-3.5 px-4 text-center bg-green-50/40 text-emerald-800">Nhập trong kỳ (+)</th>
                <th className="py-3.5 px-4 text-center bg-red-50/40 text-red-800">Xuất trong kỳ (-)</th>
                <th className="py-3.5 px-4 text-center">Tồn cuối kỳ</th>
                <th className="py-3.5 px-4 text-right">Giá trị tồn kho</th>
                <th className="py-3.5 px-4 text-center">Hiệu chỉnh đầu kỳ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredProducts.map((p) => {
                const summary = getProductStockSummary(p);
                const isEditing = editingProductId === p.id;
                const isCritical = summary.currentStock < 5;

                return (
                  <tr key={p.id} className={`hover:bg-gray-50/50 transition ${isCritical ? 'bg-red-50/10' : ''}`}>
                    <td className="py-3 px-4 font-mono font-bold text-gray-600 whitespace-nowrap">{p.sku}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3 px-4 text-gray-500 font-medium">{p.unit}</td>
                    
                    {/* Initial Stock (with edit capabilities inline) */}
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempStockValue}
                          onChange={(e) => setTempStockValue(Number(e.target.value))}
                          className="w-16 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-center text-xs focus:ring-1 focus:ring-[#0a8251] outline-none"
                        />
                      ) : (
                        <span className="font-bold text-gray-700">{p.initialStock}</span>
                      )}
                    </td>

                    {/* Stock In */}
                    <td className="py-3 px-4 text-center bg-green-50/10 font-bold text-[#0a8251]">
                      {summary.stockIn > 0 ? `+${summary.stockIn}` : '0'}
                    </td>

                    {/* Stock Out */}
                    <td className="py-3 px-4 text-center bg-red-50/10 font-bold text-red-500">
                      {summary.stockOut > 0 ? `-${summary.stockOut}` : '0'}
                    </td>

                    {/* Current Stock */}
                    <td className="py-3 px-4 text-center font-extrabold">
                      <span className={isCritical ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 font-bold border border-red-200' : 'text-gray-900'}>
                        {summary.currentStock}
                        {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>}
                      </span>
                    </td>

                    {/* Financial Value of Item */}
                    <td className="py-3 px-4 text-right font-extrabold text-gray-800 whitespace-nowrap">
                      {formatVND(summary.inventoryValue)}
                    </td>

                    {/* Edit stock triggers */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveInitialStock(p.id)}
                          className="p-1 text-white bg-[#0a8251] rounded hover:bg-[#075f3b] transition"
                          title="Lưu số lượng tồn"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEditing(p)}
                          className="p-1 text-[#0a8251] hover:bg-[#eaf4f0] rounded transition"
                          title="Hiệu chỉnh số dư tồn đầu kỳ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 text-xs">
                    Mục hàng hóa trống. Hãy vào tab "Danh mục" để khai báo thêm sản phẩm mới.
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
