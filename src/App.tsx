import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import ThuChiTab from './components/ThuChiTab';
import BanHangTab from './components/BanHangTab';
import MuaHangTab from './components/MuaHangTab';
import KhoTab from './components/KhoTab';
import TongHopTab from './components/TongHopTab';
import DanhMucTab from './components/DanhMucTab';
import ThueTab from './components/ThueTab';
import BaoCaoTab from './components/BaoCaoTab';
import SoDuTab from './components/SoDuTab';
import CauHinhTab from './components/CauHinhTab';

import { 
  initialBusinessProfile, 
  initialProducts, 
  initialCustomers, 
  initialSuppliers, 
  initialFundAccounts, 
  initialSalesInvoices, 
  initialPurchaseInvoices, 
  initialTransactions 
} from './data/mockData';

import { 
  BusinessProfile, 
  Product, 
  Customer, 
  Supplier, 
  FundAccount, 
  SalesInvoice, 
  PurchaseInvoice, 
  Transaction 
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Preference states for wallpaper and card opacity
  const [bgType, setBgType] = useState<string>(() => localStorage.getItem('fintab_bgType') || 'color');
  const [bgValue, setBgValue] = useState<string>(() => localStorage.getItem('fintab_bgValue') || '#e5e7eb');
  const [opacity, setOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('fintab_opacity');
    return saved ? parseInt(saved, 10) : 95;
  });

  // Core application states
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(initialBusinessProfile);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [fundAccounts, setFundAccounts] = useState<FundAccount[]>(initialFundAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(initialSalesInvoices);
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(initialPurchaseInvoices);

  // --- 1. Transaction Mutators (Thu / Chi) ---
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...newTxData,
      id: newId
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update the balance in fund accounts
    setFundAccounts(prev => prev.map(fa => {
      if (fa.id === newTx.fundAccountId) {
        const adjust = newTx.type === 'thu' ? newTx.amount : -newTx.amount;
        return {
          ...fa,
          initialBalance: fa.initialBalance + adjust
        };
      }
      return fa;
    }));
  };

  const handleDeleteTransaction = (txId: string) => {
    const targetTx = transactions.find(t => t.id === txId);
    if (!targetTx) return;

    setTransactions(prev => prev.filter(t => t.id !== txId));

    // Reverse the balance impact in fund accounts
    setFundAccounts(prev => prev.map(fa => {
      if (fa.id === targetTx.fundAccountId) {
        const reverseAdjust = targetTx.type === 'thu' ? -targetTx.amount : targetTx.amount;
        return {
          ...fa,
          initialBalance: fa.initialBalance + reverseAdjust
        };
      }
      return fa;
    }));
  };

  // --- 2. Sales Invoice Mutators (Bán Hàng) ---
  const handleAddSalesInvoice = (newInvData: Omit<SalesInvoice, 'id'>) => {
    const newId = `sales-${Date.now()}`;
    const newInv: SalesInvoice = {
      ...newInvData,
      id: newId
    };

    setSalesInvoices(prev => [newInv, ...prev]);

    // If already paid, trigger immediate corresponding 'thu' transaction in fund book
    if (newInv.status === 'paid' && newInv.fundAccountId) {
      const newTx: Transaction = {
        id: `tx-sales-${Date.now()}`,
        type: 'thu',
        category: 'Doanh thu bán hàng',
        amount: newInv.totalAmount,
        date: newInv.date,
        contactId: newInv.customerId,
        contactName: newInv.customerName,
        fundAccountId: newInv.fundAccountId,
        notes: `Thu tiền hóa đơn ${newInv.code}`,
        refId: newId
      };

      setTransactions(prev => [newTx, ...prev]);

      // Update fund balances
      setFundAccounts(prev => prev.map(fa => {
        if (fa.id === newInv.fundAccountId) {
          return {
            ...fa,
            initialBalance: fa.initialBalance + newInv.totalAmount
          };
        }
        return fa;
      }));
    }
  };

  const handleDeleteSalesInvoice = (invId: string) => {
    const targetInv = salesInvoices.find(i => i.id === invId);
    if (!targetInv) return;

    setSalesInvoices(prev => prev.filter(i => i.id !== invId));

    // If paid, find and delete the associated 'thu' transaction & reverse funds
    if (targetInv.status === 'paid') {
      const linkedTx = transactions.find(t => t.refId === invId);
      if (linkedTx) {
        setTransactions(prev => prev.filter(t => t.refId !== invId));
        
        setFundAccounts(prev => prev.map(fa => {
          if (fa.id === linkedTx.fundAccountId) {
            return {
              ...fa,
              initialBalance: fa.initialBalance - linkedTx.amount
            };
          }
          return fa;
        }));
      }
    }
  };

  const handleUpdateInvoiceStatus = (id: string, status: 'paid' | 'unpaid', fundAccountId?: string) => {
    setSalesInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return { ...inv, status, fundAccountId };
      }
      return inv;
    }));

    if (status === 'paid' && fundAccountId) {
      const inv = salesInvoices.find(i => i.id === id);
      if (inv) {
        // Create matching cash receipt
        const newTx: Transaction = {
          id: `tx-sales-${Date.now()}`,
          type: 'thu',
          category: 'Doanh thu bán hàng',
          amount: inv.totalAmount,
          date: inv.date,
          contactId: inv.customerId,
          contactName: inv.customerName,
          fundAccountId: fundAccountId,
          notes: `Thu tiền hóa đơn ${inv.code}`,
          refId: inv.id
        };
        setTransactions(prev => [newTx, ...prev]);

        // Add to fund account
        setFundAccounts(prev => prev.map(fa => {
          if (fa.id === fundAccountId) {
            return {
              ...fa,
              initialBalance: fa.initialBalance + inv.totalAmount
            };
          }
          return fa;
        }));
      }
    }
  };

  // --- 3. Purchase Invoice Mutators (Mua Hàng) ---
  const handleAddPurchaseInvoice = (newInvData: Omit<PurchaseInvoice, 'id'>) => {
    const newId = `pur-${Date.now()}`;
    const newInv: PurchaseInvoice = {
      ...newInvData,
      id: newId
    };

    setPurchaseInvoices(prev => [newInv, ...prev]);

    // If paid, trigger immediate corresponding 'chi' transaction in fund book
    if (newInv.status === 'paid' && newInv.fundAccountId) {
      const newTx: Transaction = {
        id: `tx-pur-${Date.now()}`,
        type: 'chi',
        category: 'Giá vốn mua hàng',
        amount: newInv.totalAmount,
        date: newInv.date,
        contactId: newInv.supplierId,
        contactName: newInv.supplierName,
        fundAccountId: newInv.fundAccountId,
        notes: `Chi thanh toán hóa đơn ${newInv.code}`,
        refId: newId
      };

      setTransactions(prev => [newTx, ...prev]);

      // Update fund balances
      setFundAccounts(prev => prev.map(fa => {
        if (fa.id === newInv.fundAccountId) {
          return {
            ...fa,
            initialBalance: fa.initialBalance - newInv.totalAmount
          };
        }
        return fa;
      }));
    }
  };

  const handleUpdatePurchaseStatus = (id: string, status: 'paid' | 'unpaid', fundAccountId?: string) => {
    setPurchaseInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return { ...inv, status, fundAccountId };
      }
      return inv;
    }));

    if (status === 'paid' && fundAccountId) {
      const inv = purchaseInvoices.find(i => i.id === id);
      if (inv) {
        // Create matching cash outflow payment
        const newTx: Transaction = {
          id: `tx-pur-${Date.now()}`,
          type: 'chi',
          category: 'Giá vốn mua hàng',
          amount: inv.totalAmount,
          date: inv.date,
          contactId: inv.supplierId,
          contactName: inv.supplierName,
          fundAccountId: fundAccountId,
          notes: `Chi thanh toán công nợ mua hàng ${inv.code}`,
          refId: inv.id
        };
        setTransactions(prev => [newTx, ...prev]);

        // Deduct from fund account balance
        setFundAccounts(prev => prev.map(fa => {
          if (fa.id === fundAccountId) {
            return {
              ...fa,
              initialBalance: fa.initialBalance - inv.totalAmount
            };
          }
          return fa;
        }));
      }
    }
  };

  const handleDeletePurchaseInvoice = (invId: string) => {
    const targetInv = purchaseInvoices.find(i => i.id === invId);
    if (!targetInv) return;

    setPurchaseInvoices(prev => prev.filter(i => i.id !== invId));

    // If paid, delete linked cash transaction & reverse funds
    if (targetInv.status === 'paid') {
      const linkedTx = transactions.find(t => t.refId === invId);
      if (linkedTx) {
        setTransactions(prev => prev.filter(t => t.refId !== invId));

        setFundAccounts(prev => prev.map(fa => {
          if (fa.id === linkedTx.fundAccountId) {
            return {
              ...fa,
              initialBalance: fa.initialBalance + linkedTx.amount
            };
          }
          return fa;
        }));
      }
    }
  };

  // --- 4. Balance Settings Mutators (Số Dư Đầu Kỳ & Kho) ---
  const handleUpdateProductStock = (id: string, initialStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, initialStock };
      }
      return p;
    }));
  };

  const handleUpdateFundBalance = (id: string, initialBalance: number) => {
    setFundAccounts(prev => prev.map(fa => {
      if (fa.id === id) {
        return { ...fa, initialBalance };
      }
      return fa;
    }));
  };

  // --- 5. Registries Mutators (Danh Mục) ---
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    setProducts(prev => [...prev, { ...newProd, id: newId }]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddCustomer = (newCust: Omit<Customer, 'id'>) => {
    const newId = `cust-${Date.now()}`;
    setCustomers(prev => [...prev, { ...newCust, id: newId }]);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const handleAddSupplier = (newSupp: Omit<Supplier, 'id'>) => {
    const newId = `supp-${Date.now()}`;
    setSuppliers(prev => [...prev, { ...newSupp, id: newId }]);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const handleAddFundAccount = (newFa: Omit<FundAccount, 'id'>) => {
    const newId = `fund-${Date.now()}`;
    setFundAccounts(prev => [...prev, { ...newFa, id: newId }]);
  };

  const handleDeleteFundAccount = (id: string) => {
    setFundAccounts(prev => prev.filter(fa => fa.id !== id));
  };

  // --- 6. Configuration Mutators (Cấu Hình) ---
  const handleUpdateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  // Switch tab rendering controller
  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewTab 
            businessProfile={businessProfile}
            transactions={transactions}
            salesInvoices={salesInvoices}
            purchaseInvoices={purchaseInvoices}
            fundAccounts={fundAccounts}
            products={products}
          />
        );
      case 'thuchi':
        return (
          <ThuChiTab 
            transactions={transactions}
            fundAccounts={fundAccounts}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'banhang':
        return (
          <BanHangTab 
            salesInvoices={salesInvoices}
            customers={customers}
            products={products}
            fundAccounts={fundAccounts}
            businessProfile={businessProfile}
            onAddSalesInvoice={handleAddSalesInvoice}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onDeleteSalesInvoice={handleDeleteSalesInvoice}
          />
        );
      case 'muahang':
        return (
          <MuaHangTab 
            purchaseInvoices={purchaseInvoices}
            suppliers={suppliers}
            products={products}
            fundAccounts={fundAccounts}
            onAddPurchaseInvoice={handleAddPurchaseInvoice}
            onUpdatePurchaseStatus={handleUpdatePurchaseStatus}
            onDeletePurchaseInvoice={handleDeletePurchaseInvoice}
          />
        );
      case 'kho':
        return (
          <KhoTab 
            products={products}
            salesInvoices={salesInvoices}
            purchaseInvoices={purchaseInvoices}
            onUpdateProductStock={handleUpdateProductStock}
          />
        );
      case 'tonghop':
        return (
          <TongHopTab 
            transactions={transactions}
            salesInvoices={salesInvoices}
            purchaseInvoices={purchaseInvoices}
            fundAccounts={fundAccounts}
          />
        );
      case 'danhmuc':
        return (
          <DanhMucTab 
            products={products}
            customers={customers}
            suppliers={suppliers}
            fundAccounts={fundAccounts}
            onAddProduct={handleAddProduct}
            onAddCustomer={handleAddCustomer}
            onAddSupplier={handleAddSupplier}
            onAddFundAccount={handleAddFundAccount}
            onDeleteProduct={handleDeleteProduct}
            onDeleteCustomer={handleDeleteCustomer}
            onDeleteSupplier={handleDeleteSupplier}
            onDeleteFundAccount={handleDeleteFundAccount}
          />
        );
      case 'thue':
        return (
          <ThueTab 
            salesInvoices={salesInvoices}
            products={products}
            businessProfile={businessProfile}
          />
        );
      case 'baocao':
        return (
          <BaoCaoTab 
            transactions={transactions}
            salesInvoices={salesInvoices}
            purchaseInvoices={purchaseInvoices}
            products={products}
          />
        );
      case 'sodu':
        return (
          <SoDuTab 
            products={products}
            fundAccounts={fundAccounts}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateFundBalance={handleUpdateFundBalance}
          />
        );
      case 'settings':
        return (
          <CauHinhTab 
            businessProfile={businessProfile}
            onUpdateBusinessProfile={handleUpdateBusinessProfile}
            bgType={bgType}
            setBgType={(type) => {
              setBgType(type);
              localStorage.setItem('fintab_bgType', type);
            }}
            bgValue={bgValue}
            setBgValue={(val) => {
              setBgValue(val);
              localStorage.setItem('fintab_bgValue', val);
            }}
            opacity={opacity}
            setOpacity={(op) => {
              setOpacity(op);
              localStorage.setItem('fintab_opacity', String(op));
            }}
          />
        );
      default:
        return (
          <div className="p-12 text-center text-xs text-gray-500">
            Chức năng đang được cập nhật phát triển...
          </div>
        );
    }
  };

  const renderBackground = () => {
    switch (bgType) {
      case 'image':
        return (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out" 
            style={{ backgroundImage: `url(${bgValue})` }}
          />
        );
      case 'video':
        return (
          <video 
            key={bgValue}
            src={bgValue}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out z-0"
          />
        );
      case 'gradient': {
        const isDynamic = bgValue.includes('linear-gradient(-45deg');
        return (
          <div 
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${isDynamic ? 'animate-gradient' : ''}`}
            style={{ 
              background: bgValue,
              backgroundSize: isDynamic ? '400% 400%' : 'cover'
            }}
          />
        );
      }
      case 'pattern': {
        if (bgValue === 'orbiting-planets') {
          return (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center overflow-hidden transition-all duration-700"
              style={{ backgroundImage: `url('https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')` }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full border border-white/10 animate-[spin_40s_linear_infinite]" />
              <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border border-white/10 animate-[spin_80s_linear_infinite]" />
            </div>
          );
        } else if (bgValue === 'dotted-pattern') {
          return (
            <div 
              className="absolute inset-0 w-full h-full transition-all duration-700"
              style={{ 
                backgroundImage: 'radial-gradient(circle at 25% 25%, #a3b1c6 15%, transparent 15%), radial-gradient(circle at 75% 75%, #a3b1c6 15%, transparent 15%)',
                backgroundSize: '10px 10px',
                backgroundColor: '#e0e7ed'
              }}
            />
          );
        } else if (bgValue === 'dark-dotted-pattern') {
          return (
            <div 
              className="absolute inset-0 w-full h-full transition-all duration-700"
              style={{ 
                backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
                backgroundSize: '11px 11px',
                backgroundColor: '#1d1f20'
              }}
            />
          );
        }
        return null;
      }
      case 'color':
      default:
        return (
          <div 
            className="absolute inset-0 w-full h-full transition-all duration-700" 
            style={{ backgroundColor: bgValue || '#e5e7eb' }}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Wallpaper Layer */}
      {renderBackground()}

      {/* Main Container Card with 3D shadow and 15px frame padding */}
      <div className="p-[15px] h-screen box-border relative z-10 flex items-center justify-center">
        <div 
          className="flex w-full h-full rounded-[10px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3),_0_8px_25px_rgba(0,0,0,0.15)] border-[3px] backdrop-blur-md transition-all duration-500"
          style={{ 
            animation: 'colorChange 60s infinite',
            backgroundColor: `rgba(250, 250, 250, ${opacity / 100})`
          }}
        >
          {/* Navigation Sidebar */}
          <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

          {/* Main Layout Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <Header 
              businessProfile={businessProfile}
              onChangeProfile={handleUpdateBusinessProfile}
            />
            
            {/* Scrollable Tab panel */}
            <main className="flex-1 overflow-y-auto">
              {renderTabContent()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
