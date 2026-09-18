// Servio Multi-Tenant SaaS Hospitality Platform - Shared Domain Types

export type Currency = 'KES' | 'USD' | 'EUR';

// Security Domains & Roles
export type PlatformAdminRole =
  | 'SAAS_SUPER_ADMIN'
  | 'PLATFORM_SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'PLATFORM_SUPPORT'
  | 'PLATFORM_FINANCE'
  | 'PLATFORM_AUDITOR';

export type HotelierRole =
  | 'HOTEL_OWNER'
  | 'GENERAL_MANAGER'
  | 'HOTEL_MANAGER'
  | 'RECEPTIONIST'
  | 'HOUSEKEEPER'
  | 'RESTAURANT_MANAGER'
  | 'WAITER'
  | 'CASHIER'
  | 'CHEF'
  | 'KITCHEN_STAFF'
  | 'STOREKEEPER'
  | 'INVENTORY_MANAGER'
  | 'ACCOUNTANT'
  | 'AUDITOR';

export type UserRole = PlatformAdminRole | HotelierRole | 'SUPER_ADMIN';

// Central Tenant Model Schema
export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'ARCHIVED';

export interface Tenant {
  id: string; // UUID / Primary Key
  tenant_code: string; // e.g., "TNT-NBO-01"
  hotel_name: string;
  legal_name: string;
  slug: string; // e.g. "servio-nairobi"
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  county: string;
  country: string; // Default: 'Kenya'
  timezone: string; // Default: 'Africa/Nairobi'
  currency: Currency; // Default: 'KES'
  logo_url: string;
  logo_storage_key?: string;
  favicon_url?: string;
  primary_color?: string; // e.g. '#059669'
  secondary_color?: string; // e.g. '#1e293b'
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  account_status: AccountStatus;
  rooms_count: number;
  monthly_fee: number; // KES
  created_at: string;
  updated_at: string;
  suspended_at?: string;
  deleted_at?: string;

  // Backwards compatibility properties
  name?: string;
  status?: AccountStatus;
  logoUrl?: string;
}

// Deprecated alias for backwards compatibility
export type HotelierProperty = Tenant;

export interface User {
  id: string;
  tenant_id: string; // Tenant Isolation key
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  propertyId?: string;
  created_at?: string;
}

export type AuthDomain = 'PLATFORM_ADMIN' | 'HOTELIER';

export interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
  authDomain: AuthDomain | null;
  activeTenant: Tenant | null;
}

// HOTEL PMS (Tenant-scoped)
export type RoomStatus = 'CLEAN' | 'DIRTY' | 'INSPECTED' | 'OUT_OF_SERVICE';
export type OccupancyStatus = 'VACANT' | 'OCCUPIED';

export interface RoomType {
  id: string;
  tenant_id?: string;
  code: string;
  name: string;
  baseRate: number;
  capacity: number;
  description: string;
}

export interface Room {
  id: string;
  tenant_id?: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  floor: number;
  status: RoomStatus;
  occupancyStatus: OccupancyStatus;
  currentGuestName?: string;
  currentReservationId?: string;
  assignedHousekeeper?: string;
  nightlyRate: number;
}

export type ReservationStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Reservation {
  id: string;
  tenant_id?: string;
  reservationNumber: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string; // ISO YYYY-MM-DD
  checkOutDate: string; // ISO YYYY-MM-DD
  status: ReservationStatus;
  adultsCount: number;
  childrenCount: number;
  totalAmount: number;
  depositPaid: number;
  specialRequests?: string;
  folioId?: string;
}

export interface Guest {
  id: string;
  tenant_id?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  idPassportNumber?: string;
  idNumber?: string;
  idType?: string;
  nationality: string;
  totalStays: number;
  totalSpent: number;
  vipStatus?: boolean;
  isVip?: boolean;
  documentsCount?: number;
  notes?: string;
}

// RESTAURANT & POS (Tenant-scoped)
export interface MenuItem {
  id: string;
  tenant_id?: string;
  code: string;
  name: string;
  category?: 'APPETIZER' | 'MAIN' | 'DESSERT' | 'BEVERAGE' | 'ALCOHOL' | 'BREAKFAST' | string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  recipeCost?: number;
  description: string;
  imageUrl?: string;
  isAvailable: boolean;
  kitchenStation?: 'HOT_KITCHEN' | 'COLD_KITCHEN' | 'BAR' | 'PASTRY' | string;
  modifiers?: any;
  variants?: any;
  taxRate?: number;
}

export type OrderStatus = 'PENDING' | 'IN_KITCHEN' | 'SENT_TO_KITCHEN' | 'READY' | 'SERVED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
export type OrderSource = 'TABLE' | 'ROOM_SERVICE' | 'TAKEAWAY' | 'BAR';

export interface PosOrderItem {
  id?: string;
  menuItemId?: string;
  menuItemName?: string;
  name?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  selectedVariant?: string;
}

export interface PosOrder {
  id: string;
  tenant_id?: string;
  orderNumber: string;
  orderSource?: OrderSource;
  orderType?: string;
  tableNumber?: string;
  roomNumber?: string;
  guestName?: string;
  guestFolioId?: string;
  outletName?: string;
  items: PosOrderItem[];
  subtotal: number;
  tax?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO
  waiterName: string;
}

// KITCHEN KDS (Tenant-scoped)
export type KdsStatus = 'QUEUED' | 'NEW' | 'PREPARING' | 'COOKING' | 'PLATED' | 'READY' | 'COMPLETED';

export interface KdsTicket {
  id: string;
  tenant_id?: string;
  ticketNumber: string;
  orderId: string;
  orderNumber?: string;
  orderSource?: OrderSource;
  orderType?: string;
  tableOrRoom?: string;
  locationInfo?: string;
  stationName?: string;
  station?: 'HOT_KITCHEN' | 'COLD_KITCHEN' | 'BAR' | 'PASTRY' | string;
  items: PosOrderItem[];
  status: KdsStatus;
  orderTime?: string;
  createdAt?: string;
  elapsedMinutes?: number;
  priority?: string;
  notes?: string;
}

// INVENTORY & PANTRY (Tenant-scoped)
export interface InventoryItem {
  id: string;
  tenant_id?: string;
  itemCode?: string;
  sku?: string;
  name: string;
  category: 'DRY_GOODS' | 'MEAT_POULTRY' | 'DAIRY' | 'PRODUCE' | 'BEVERAGES' | 'SPIRITS' | 'CLEANING' | string;
  unit?: 'KG' | 'LITRES' | 'UNITS' | 'PACKS' | 'BOTTLES' | 'GRAMS' | string;
  uom?: string;
  location?: string;
  expiryDate?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  supplierName?: string;
  lastRestocked: string;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  inventoryItemName?: string;
  name?: string;
  quantity?: number;
  quantityRequired?: number;
  unit?: string;
  uom?: string;
  costPerUnit: number;
  totalCost?: number;
}

export interface Recipe {
  id: string;
  tenant_id?: string;
  menuItemId: string;
  menuItemName: string;
  portionYield?: number;
  ingredients: RecipeIngredient[];
  totalCost?: number;
  totalIngredientCost?: number;
  targetSellingPrice?: number;
  sellingPrice?: number;
  foodCostPercentage: number;
  grossMargin?: number;
}

export interface Supplier {
  id: string;
  tenant_id?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category?: string;
  categories?: string[];
  taxId?: string;
  leadTimeDays?: number;
  paymentTerms?: string;
}

export interface PurchaseOrderItem {
  inventoryItemId: string;
  name: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  tenant_id?: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'CANCELLED' | 'ISSUED' | 'COMPLETED';
  items: PurchaseOrderItem[];
  totalAmount: number;
}

// FINANCE & GUEST FOLIOS (Tenant-scoped)
export interface FolioItem {
  id: string;
  date: string;
  description: string;
  category: 'ROOM_CHARGE' | 'RESTAURANT' | 'LAUNDRY' | 'MINIBAR' | 'TAX' | 'PAYMENT' | string;
  amount: number;
  referenceId?: string;
}

export interface GuestFolio {
  id: string;
  tenant_id?: string;
  folioNumber: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  reservationId: string;
  status: 'OPEN' | 'SETTLED' | 'CLOSED';
  items: FolioItem[];
  totalCharges: number;
  totalPayments: number;
  balance: number;
}

export interface Payment {
  id: string;
  tenant_id?: string;
  receiptNumber: string;
  folioId?: string;
  orderId?: string;
  guestName?: string;
  roomNumber?: string;
  amount: number;
  currency?: string;
  method: 'CASH' | 'MPESA' | 'CARD' | 'BANK_TRANSFER';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  providerReference?: string;
  timestamp?: string;
  createdAt?: string;
}

export interface Expense {
  id: string;
  tenant_id?: string;
  expenseNumber: string;
  category: 'UTILITIES' | 'SALARIES' | 'MAINTENANCE' | 'FOOD_BEVERAGE' | 'MARKETING' | 'SOFTWARE' | string;
  description: string;
  amount: number;
  expenseDate: string;
  approvedBy: string;
}

export interface AuditLogItem {
  id: string;
  tenant_id?: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  details: string;
  ipAddress: string;
}

export type ActiveTab =
  | 'saas-admin'
  | 'dashboard'
  | 'reservations'
  | 'calendar'
  | 'rooms'
  | 'guests'
  | 'checkin-checkout'
  | 'housekeeping'
  | 'pos'
  | 'orders'
  | 'tables'
  | 'menu'
  | 'room-service'
  | 'kds'
  | 'pantry'
  | 'ingredients'
  | 'recipes'
  | 'suppliers'
  | 'purchasing'
  | 'wastage'
  | 'payments'
  | 'folios'
  | 'invoices'
  | 'receipts'
  | 'expenses'
  | 'reports'
  | 'staff'
  | 'audit-logs'
  | 'settings';
