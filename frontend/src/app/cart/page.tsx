'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, MapPin, User, FileText, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface CartItem {
  menuItemId: string; name: string; price: number
  discountedPrice?: number; quantity: number; isVeg: boolean; image?: string
}

interface Cart {
  items: CartItem[]; restaurantId: string
  restaurantName: string; restaurantWhatsapp: string
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], restaurantId: '', restaurantName: '', restaurantWhatsapp: '' })
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      const items = prev.items.map(item =>
        item.menuItemId === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter(item => item.quantity > 0)
      const updated = { ...prev, items }
      localStorage.setItem('cart', JSON.stringify(updated))
      window.dispatchEvent(new Event('cart-updated'))
      return updated
    })
  }

  const removeItem = (id: string) => {
    setCart(prev => {
      const updated = { ...prev, items: prev.items.filter(i => i.menuItemId !== id) }
      localStorage.setItem('cart', JSON.stringify(updated))
      window.dispatchEvent(new Event('cart-updated'))
      return updated
    })
    toast.success('Item removed')
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0)
  const deliveryFee = orderType === 'pickup' ? 0 : 30
  const total = subtotal + deliveryFee

  const handleWhatsAppOrder = () => {
    if (!customerName.trim()) return toast.error('Please enter your name')
    if (orderType === 'delivery' && !address.trim()) return toast.error('Please enter delivery address')

    const itemsText = cart.items.map((item, i) =>
      `${i + 1}. ${item.quantity}x ${item.name} — ₹${((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}`
    ).join('\n')

    const message = `Hello ${cart.restaurantName} 👋

I would like to place an order:

${itemsText}

━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${subtotal.toLocaleString('en-IN')}
${deliveryFee > 0 ? `Delivery: ₹${deliveryFee}\n` : ''}*Total: ₹${total.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━

👤 Name: ${customerName}
${customerPhone ? `📱 Phone: ${customerPhone}\n` : ''}${orderType === 'delivery' ? `📍 Address: ${address}\n` : '🏃 Order Type: Self Pickup\n'}${instructions ? `📝 Note: ${instructions}\n` : ''}
Please confirm my order! 🙏`

    const cleanPhone = '7483192591'
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`

    // Clear cart
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('cart-updated'))
    window.open(url, '_blank')
    toast.success('🎉 Opening WhatsApp...')
  }

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-[#09090f]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl">🛒</motion.div>
          <h2 className="font-display font-bold text-2xl text-white">Your cart is empty</h2>
          <p className="text-slate-400 text-center">Browse restaurants and add your favourite items</p>
          <Link href="/restaurants" className="btn-brand">Browse Restaurants</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />
      <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link href="/restaurants" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm">
            <ArrowLeft size={16} /> Back to restaurants
          </Link>
          <h1 className="font-display font-black text-3xl text-white">Your Cart</h1>
          <p className="text-slate-400 text-sm mt-1">from <span className="text-brand-400 font-semibold">{cart.restaurantName}</span></p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.items.map((item, i) => (
                <motion.div
                  key={item.menuItemId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full m-auto mt-0.5 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{item.name}</p>
                    <p className="text-brand-400 font-bold text-sm mt-0.5">
                      ₹{(item.discountedPrice || item.price).toLocaleString('en-IN')} each
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-2 py-1">
                      <button onClick={() => updateQty(item.menuItemId, -1)} className="text-slate-300 hover:text-white transition-colors"><Minus size={14} /></button>
                      <span className="text-white font-bold w-5 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.menuItemId, 1)} className="text-slate-300 hover:text-white transition-colors"><Plus size={14} /></button>
                    </div>
                    <span className="text-white font-bold text-sm w-16 text-right">
                      ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button onClick={() => removeItem(item.menuItemId)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Delivery Details */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="font-display font-bold text-white">Order Details</h3>

              {/* Order type */}
              <div className="flex gap-3">
                {(['delivery', 'pickup'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 capitalize ${
                      orderType === type ? 'bg-brand-500/20 border-brand-500/50 text-brand-400' : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {type === 'delivery' ? '🚴 Delivery' : '🏃 Self Pickup'}
                  </button>
                ))}
              </div>

              <input
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Your name *"
                className="input-field"
              />
              <input
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="input-field"
              />
              {orderType === 'delivery' && (
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Full delivery address *"
                  rows={2}
                  className="input-field resize-none"
                />
              )}
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Special instructions (optional)"
                rows={2}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 sticky top-24">
              <h3 className="font-display font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-white/[0.08]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppOrder}
                className="whatsapp-btn w-full justify-center text-base font-bold"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp
              </motion.button>

              <p className="text-slate-500 text-xs text-center mt-3 leading-relaxed">
                This will open WhatsApp with your order details pre-filled. The restaurant will confirm your order directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
