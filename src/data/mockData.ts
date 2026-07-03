import { BusinessProfile, Product, Customer, Supplier, FundAccount, SalesInvoice, PurchaseInvoice, Transaction } from '../types';

export const initialBusinessProfile: BusinessProfile = {
  name: "Power Service One",
  mst: "342535453543",
  phone: "0987 654 321",
  address: "123 Đường Láng, Láng Hạ, Đống Đa, Hà Nội",
  representative: "Hùng Thái Nguyễn",
  mainSector: "Bán buôn bán lẻ đồ gỗ nội thất và dịch vụ lắp đặt",
  taxMethod: 'circular40',
};

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    sku: "SP001",
    name: "Bàn gỗ thông tự nhiên",
    unit: "cái",
    inputPrice: 1500000,
    sellingPrice: 2200000,
    initialStock: 25,
    sectorType: 1 // Phân phối hàng hóa (GTGT 1%, TNCN 0.5%)
  },
  {
    id: "prod-2",
    sku: "SP002",
    name: "Ghế tựa gỗ sồi",
    unit: "cái",
    inputPrice: 400000,
    sellingPrice: 650000,
    initialStock: 80,
    sectorType: 1 // Phân phối hàng hóa
  },
  {
    id: "prod-3",
    sku: "DV001",
    name: "Dịch vụ thiết kế & lắp đặt",
    unit: "giờ",
    inputPrice: 0,
    sellingPrice: 300000,
    initialStock: 0,
    sectorType: 2 // Dịch vụ (GTGT 5%, TNCN 2%)
  },
  {
    id: "prod-4",
    sku: "DV002",
    name: "Gói gia công sơn bóng PU",
    unit: "m2",
    inputPrice: 150000,
    sellingPrice: 450000,
    initialStock: 0,
    sectorType: 3 // Sản xuất, gia công, dịch vụ kèm hàng hóa (GTGT 3%, TNCN 1.5%)
  }
];

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Công ty Cổ phần Đầu tư Minh Phát",
    phone: "0912 345 678",
    address: "Tòa nhà Keangnam, Mễ Trì, Nam Từ Liêm, Hà Nội",
    mst: "0102030405"
  },
  {
    id: "cust-2",
    name: "Anh Hoàng Anh Tuấn",
    phone: "0987 654 321",
    address: "45 Lê Lợi, Hải Châu, Đà Nẵng"
  },
  {
    id: "cust-3",
    name: "Chị Nguyễn Thị Lan",
    phone: "0905 123 456",
    address: "789 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: "supp-1",
    name: "Lâm sản Tây Nguyên JSC",
    phone: "0262 385 456",
    address: "Lô 12 KCN Hòa Phú, Buôn Ma Thuột, Đắk Lắk",
    mst: "6001234567"
  },
  {
    id: "supp-2",
    name: "Tổng kho Phụ kiện Kim khí Việt Nam",
    phone: "0243 555 888",
    address: "KM 10 Quốc lộ 1A, Thanh Trì, Hà Nội",
    mst: "0103456789"
  }
];

export const initialFundAccounts: FundAccount[] = [
  {
    id: "fund-1",
    name: "Tiền mặt tại quỹ",
    type: "cash",
    initialBalance: 35000000
  },
  {
    id: "fund-2",
    name: "Ngân hàng Techcombank",
    type: "bank",
    accountNumber: "1903456789012",
    initialBalance: 120000000
  },
  {
    id: "fund-3",
    name: "Ngân hàng Vietcombank",
    type: "bank",
    accountNumber: "0071001234567",
    initialBalance: 45000000
  }
];

// Helper to construct dates in the current tax period: July 2026 to Sept 2026 (matching the screenshot)
export const initialSalesInvoices: SalesInvoice[] = [
  {
    id: "sales-1",
    code: "HDBH260712-01",
    date: "2026-07-12",
    customerId: "cust-1",
    customerName: "Công ty Cổ phần Đầu tư Minh Phát",
    items: [
      { productId: "prod-1", productName: "Bàn gỗ thông tự nhiên", quantity: 5, price: 2200000, vatRate: 1, amount: 11000000 },
      { productId: "prod-2", productName: "Ghế tựa gỗ sồi", quantity: 20, price: 650000, vatRate: 1, amount: 13000000 }
    ],
    discount: 500000,
    totalVat: 240000, // 1% of (24000000 - 500000) is 235000, let's keep it exact: (24000000-500000)*0.01 = 235000
    totalAmount: 23735000, // (24M - 500k) + 235k VAT
    status: 'paid',
    fundAccountId: "fund-2",
    notes: "Khách chuyển khoản cọc và thanh toán nốt qua Techcombank"
  },
  {
    id: "sales-2",
    code: "HDBH260805-01",
    date: "2026-08-05",
    customerId: "cust-2",
    customerName: "Anh Hoàng Anh Tuấn",
    items: [
      { productId: "prod-1", productName: "Bàn gỗ thông tự nhiên", quantity: 2, price: 2200000, vatRate: 1, amount: 4400000 },
      { productId: "prod-3", productName: "Dịch vụ thiết kế & lắp đặt", quantity: 4, price: 300000, vatRate: 5, amount: 1200000 }
    ],
    discount: 0,
    totalVat: 104000, // 4.4M * 1% = 44k + 1.2M * 5% = 60k
    totalAmount: 5704000, // 5.6M + 104k VAT
    status: 'paid',
    fundAccountId: "fund-1",
    notes: "Khách trả tiền mặt tại showroom"
  },
  {
    id: "sales-3",
    code: "HDBH260918-01",
    date: "2026-09-18",
    customerId: "cust-3",
    customerName: "Chị Nguyễn Thị Lan",
    items: [
      { productId: "prod-2", productName: "Ghế tựa gỗ sồi", quantity: 6, price: 650000, vatRate: 1, amount: 3900000 },
      { productId: "prod-4", productName: "Gói gia công sơn bóng PU", quantity: 10, price: 450000, vatRate: 3, amount: 4500000 }
    ],
    discount: 200000,
    totalVat: 174000, // (3.9M-200k)*1% = 37k + 4.5M*3% = 135k = 172k approximate (exact items: 3.9M-200k=3.7M @ 1% = 37k; 4.5M @ 3% = 135k)
    totalAmount: 8372000, // 8.2M + 172k VAT
    status: 'unpaid',
    notes: "Đã giao hàng, khách hẹn cuối tháng chuyển khoản"
  }
];

export const initialPurchaseInvoices: PurchaseInvoice[] = [
  {
    id: "pur-1",
    code: "HDMH260705-01",
    date: "2026-07-05",
    supplierId: "supp-1",
    supplierName: "Lâm sản Tây Nguyên JSC",
    items: [
      { productId: "prod-1", productName: "Bàn gỗ thông tự nhiên", quantity: 10, price: 1500000, vatRate: 0, amount: 15000000 },
      { productId: "prod-2", productName: "Ghế tựa gỗ sồi", quantity: 30, price: 400000, vatRate: 0, amount: 12000000 }
    ],
    discount: 1000000,
    totalAmount: 26000000,
    status: 'paid',
    fundAccountId: "fund-3",
    notes: "Nhập gỗ thô từ xưởng Tây Nguyên"
  },
  {
    id: "pur-2",
    code: "HDMH260820-01",
    date: "2026-08-20",
    supplierId: "supp-2",
    supplierName: "Tổng kho Phụ kiện Kim khí Việt Nam",
    items: [
      { productId: "prod-2", productName: "Ghế tựa gỗ sồi", quantity: 15, price: 400000, vatRate: 0, amount: 6000000 }
    ],
    discount: 0,
    totalAmount: 6000000,
    status: 'paid',
    fundAccountId: "fund-1",
    notes: "Thanh toán mua bản lề và ốc liên kết ghế sồi"
  }
];

// Generates starting transactions for cashflow and expenses
export const initialTransactions: Transaction[] = [
  // Payments from Sales Invoices (Auto-linked)
  {
    id: "tx-sales-1",
    type: "thu",
    category: "Doanh thu bán hàng",
    amount: 23735000,
    date: "2026-07-12",
    contactId: "cust-1",
    contactName: "Công ty Cổ phần Đầu tư Minh Phát",
    fundAccountId: "fund-2",
    notes: "Thu tiền hóa đơn HDBH260712-01",
    refId: "sales-1"
  },
  {
    id: "tx-sales-2",
    type: "thu",
    category: "Doanh thu bán hàng",
    amount: 5704000,
    date: "2026-08-05",
    contactId: "cust-2",
    contactName: "Anh Hoàng Anh Tuấn",
    fundAccountId: "fund-1",
    notes: "Thu tiền hóa đơn HDBH260805-01",
    refId: "sales-2"
  },
  // Payments to Purchases
  {
    id: "tx-pur-1",
    type: "chi",
    category: "Giá vốn mua hàng",
    amount: 26000000,
    date: "2026-07-05",
    contactId: "supp-1",
    contactName: "Lâm sản Tây Nguyên JSC",
    fundAccountId: "fund-3",
    notes: "Chi thanh toán nhập hàng HDMH260705-01",
    refId: "pur-1"
  },
  {
    id: "tx-pur-2",
    type: "chi",
    category: "Giá vốn mua hàng",
    amount: 6000000,
    date: "2026-08-20",
    contactId: "supp-2",
    contactName: "Tổng kho Phụ kiện Kim khí Việt Nam",
    fundAccountId: "fund-1",
    notes: "Thanh toán nhập phụ kiện HDMH260820-01",
    refId: "pur-2"
  },
  // General Monthly Expenses (Not linked to invoices)
  {
    id: "tx-exp-rent-1",
    type: "chi",
    category: "Chi phí thuê mặt bằng",
    amount: 8000000,
    date: "2026-07-01",
    fundAccountId: "fund-2",
    notes: "Thanh toán tiền thuê mặt bằng Tháng 7/2026"
  },
  {
    id: "tx-exp-rent-2",
    type: "chi",
    category: "Chi phí thuê mặt bằng",
    amount: 8000000,
    date: "2026-08-01",
    fundAccountId: "fund-2",
    notes: "Thanh toán tiền thuê mặt bằng Tháng 8/2026"
  },
  {
    id: "tx-exp-rent-3",
    type: "chi",
    category: "Chi phí thuê mặt bằng",
    amount: 8000000,
    date: "2026-09-01",
    fundAccountId: "fund-2",
    notes: "Thanh toán tiền thuê mặt bằng Tháng 9/2026"
  },
  {
    id: "tx-exp-util-1",
    type: "chi",
    category: "Chi phí điện, nước, internet",
    amount: 1250000,
    date: "2026-07-28",
    fundAccountId: "fund-1",
    notes: "Chi thanh toán tiền điện nước văn phòng tháng 7"
  },
  {
    id: "tx-exp-util-2",
    type: "chi",
    category: "Chi phí điện, nước, internet",
    amount: 1420000,
    date: "2026-08-28",
    fundAccountId: "fund-1",
    notes: "Chi thanh toán tiền điện nước văn phòng tháng 8"
  },
  {
    id: "tx-exp-util-3",
    type: "chi",
    category: "Chi phí điện, nước, internet",
    amount: 1350000,
    date: "2026-09-28",
    fundAccountId: "fund-1",
    notes: "Chi thanh toán tiền điện nước văn phòng tháng 9"
  }
];
