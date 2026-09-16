// Servio Tablet POS Register Component

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Trash2,
  Phone,
  BedDouble,
  CreditCard,
  Send,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';
import { MenuItem, PosOrder, PosOrderItem, Room, KdsTicket } from '../../types';

interface PosViewProps {
  menuItems: MenuItem[];
  rooms: Room[];
  onAddPosOrder: (order: PosOrder) => void;
  onAddKdsTicket: (ticket: KdsTicket) => void;
}

export const PosView: React.FC<PosViewProps> = ({
  menuItems,
  rooms,
  onAddPosOrder,
  onAddKdsTicket,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<PosOrderItem[]>([]);

  // Order Details
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'ROOM_SERVICE'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('204');
  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CASH' | 'ROOM_CHARGE'>('ROOM_CHARGE');

  // Modifier Modal
  const [activeItemForMod, setActiveItemForMod] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedMods, setSelectedMods] = useState<string[]>([]);

  const [checkoutSuccess, setCheckoutSuccess] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'cat-mains', label: 'Main Courses' },
    { id: 'cat-starters', label: 'Starters & Sides' },
    { id: 'cat-drinks', label: 'Beverages & Bar' },
    { id: 'cat-coffee', label: 'Coffee & Breakfast' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSelectItem = (item: MenuItem) => {
    if (item.modifiers || item.variants) {
      setActiveItemForMod(item);
      setSelectedVariant(item.variants ? item.variants[0].name : '');
      setSelectedMods([]);
    } else {
      addToCartDirect(item, item.price, undefined, []);
    }
  };

  const addToCartDirect = (
    item: MenuItem,
    price: number,
    variant?: string,
    modifiers?: string[]
  ) => {
    const existingIndex = cart.findIndex(
      (c) => c.menuItemId === item.id && c.selectedVariant === variant
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * price;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: `item-${Date.now()}-${Math.random()}`,
          menuItemId: item.id,
          menuItemName: item.name,
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
          selectedVariant: variant,
          selectedModifiers: modifiers,
        },
      ]);
    }
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice }
              : null;
          }
          return item;
        })
        .filter(Boolean) as PosOrderItem[]
    );
  };

  const subtotal = cart.reduce((acc, i) => acc + i.totalPrice, 0);
  const taxAmount = Math.round(subtotal * 0.16);
  const totalAmount = subtotal;

  const handleCheckoutOrder = () => {
    if (cart.length === 0) return;

    const orderNum = `POS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: PosOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      outletName: orderType === 'ROOM_SERVICE' ? 'Room Service' : 'Main Restaurant',
      orderType,
      tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
      roomNumber: orderType === 'ROOM_SERVICE' ? selectedRoomNumber : undefined,
      waiterName: 'Samuel Odhiambo',
      status: 'SENT_TO_KITCHEN',
      items: cart,
      subtotal,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    onAddPosOrder(newOrder);

    // Also send KDS Ticket to kitchen
    const newTicket: KdsTicket = {
      id: `kds-${Date.now()}`,
      ticketNumber: `KDS-${Math.floor(100 + Math.random() * 900)}`,
      orderId: newOrder.id,
      orderNumber: orderNum,
      orderType,
      locationInfo:
        orderType === 'ROOM_SERVICE'
          ? `ROOM ${selectedRoomNumber}`
          : `${tableNumber}`,
      stationName: 'Hot Kitchen Station',
      status: 'NEW',
      items: cart.map((c) => ({
        id: c.id,
        name: c.menuItemName,
        quantity: c.quantity,
        modifiers: c.selectedModifiers,
      })),
      createdAt: new Date().toISOString(),
      elapsedMinutes: 0,
      priority: orderType === 'ROOM_SERVICE' ? 'VIP' : 'NORMAL',
    };

    onAddKdsTicket(newTicket);

    setCheckoutSuccess(
      `Order ${orderNum} sent to Kitchen KDS & billed via ${paymentMethod.replace('_', ' ')}!`
    );
    setCart([]);
    setTimeout(() => setCheckoutSuccess(''), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)] animate-in fade-in duration-200">
      {/* Left 2 Cols: Category Tabs & Menu Item Grid */}
      <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
        {/* Category Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick item lookup or code..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium shadow-2xs"
          />
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="h-28 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-xs font-bold">
                    {item.code}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{item.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-800">
                  {item.price.toLocaleString()} KES
                </span>
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Plus size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Col: Active Order Register Cart Drawer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-amber-400" />
            <span className="font-bold text-sm tracking-wide">POS Register</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Order #POS-2026-NEW</span>
        </div>

        {/* Order Mode Selector */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 shrink-0">
          <button
            onClick={() => setOrderType('DINE_IN')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              orderType === 'DINE_IN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Dine-In
          </button>
          <button
            onClick={() => setOrderType('ROOM_SERVICE')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              orderType === 'ROOM_SERVICE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Room Service
          </button>
          <button
            onClick={() => setOrderType('TAKEAWAY')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              orderType === 'TAKEAWAY'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Takeaway
          </button>
        </div>

        {/* Location / Table or Room Selector */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white text-xs shrink-0 flex items-center justify-between">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Location:</span>
          {orderType === 'DINE_IN' && (
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg outline-none"
            >
              <option value="Table 1">Table 1</option>
              <option value="Table 2">Table 2</option>
              <option value="Table 4">Table 4</option>
              <option value="Table 8">Table 8</option>
            </select>
          )}

          {orderType === 'ROOM_SERVICE' && (
            <select
              value={selectedRoomNumber}
              onChange={(e) => setSelectedRoomNumber(e.target.value)}
              className="font-bold text-slate-800 bg-amber-100 px-2 py-1 rounded-lg outline-none"
            >
              {rooms
                .filter((r) => r.occupancyStatus === 'OCCUPIED')
                .map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} ({r.currentGuestName})
                  </option>
                ))}
            </select>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {checkoutSuccess && (
            <div className="p-3 bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} /> {checkoutSuccess}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <UtensilsCrossed size={32} />
              <p className="text-xs">No items added to register yet.</p>
            </div>
          ) : (
            cart.map((cartItem) => (
              <div
                key={cartItem.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">{cartItem.menuItemName}</h5>
                  <span className="text-[10px] text-slate-500">
                    {cartItem.unitPrice.toLocaleString()} KES each
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(cartItem.id, -1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-bold text-xs px-1">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.id, 1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-extrabold text-xs text-slate-800 w-16 text-right">
                    {cartItem.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Type Tabs & Footer Totals */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{subtotal.toLocaleString()} KES</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>VAT (16% inclusive):</span>
              <span>{taxAmount.toLocaleString()} KES</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-base text-slate-900">
              <span>Total Amount:</span>
              <span className="text-emerald-600">{totalAmount.toLocaleString()} KES</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('ROOM_CHARGE')}
              className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                paymentMethod === 'ROOM_CHARGE'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Charge Room
            </button>
            <button
              onClick={() => setPaymentMethod('MPESA')}
              className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                paymentMethod === 'MPESA'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              M-Pesa STK
            </button>
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                paymentMethod === 'CASH'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Cash / Card
            </button>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handleCheckoutOrder}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
          >
            <Send size={16} /> Send to Kitchen & Post Charge
          </button>
        </div>
      </div>
    </div>
  );
};
