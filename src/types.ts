export interface BusinessProfile {
  name: string;
  mst: string;
  phone: string;
  address: string;
  representative: string;
  mainSector: string;
  taxMethod: 'circular40' | 'flat';
  email?: string;
}

export type SectorType = 1 | 2 | 3 | 4;

export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  inputPrice: number;
  sellingPrice: number;
  initialStock: number;
  sectorType: SectorType; // Maps to Circular 40/2021 sectors
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  mst?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  mst?: string;
}

export interface FundAccount {
  id: string;
  name: string;
  type: 'cash' | 'bank';
  accountNumber?: string;
  initialBalance: number;
}

export type TransactionType = 'thu' | 'chi';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  contactId?: string; // customer or supplier ID
  contactName?: string;
  fundAccountId: string;
  notes: string;
  refId?: string; // Links to sales or purchase invoice
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  vatRate: number; // e.g. 1 for 1%
  amount: number;
}

export interface SalesInvoice {
  id: string;
  code: string;
  date: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  discount: number;
  totalVat: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'draft';
  fundAccountId?: string;
  notes?: string;
}

export interface PurchaseInvoice {
  id: string;
  code: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: InvoiceItem[];
  discount: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'draft';
  fundAccountId?: string;
  notes?: string;
}
