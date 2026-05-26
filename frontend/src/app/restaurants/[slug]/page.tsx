'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Star, Clock, MapPin, Phone, Info, BadgeCheck, Share2, Heart, Plus, Minus, ShoppingCart } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { RESTAURANTS, MENU_ITEMS } from '@/lib/mockData'
import toast from 'react-hot-toast'

export default function RestaurantPage() {
  const { slug } = useParams()
  const restaurant = RESTAURANTS.find(r => r.slug === slug) || RESTAURANTS[0]
  const menuItems = MENU_ITEMS[restaurant.id] || MENU_ITEMS['1']

  const [cart, setCart] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState('menu')
  const [vegOnly, setVegOnly] = useState(false)

  const filteredItems = vegOnly ? menuItems.filter((i: any) => i.isVeg) : menuItems

  const addToCart = (item: any) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('cart') || '{"items":[]}')
    const idx = existing.items.findIndex((i: any) => i.menuItemId === item.id)
    if (idx >= 0) existing.items[idx].quantity++
    else existing.items.push({
      menuItemId: item.id, name: item.name,
      price: item.price, discountedPrice: item.discountedPrice,
      quantity: 1, isVeg: item.isVeg, image: item.image
    })
    existing.restaurantId = restaurant.id
    existing.restaurantName = restaurant.name
    existing.restaurantWhatsapp = restaurant.whatsappNumber
    localStorage.setItem('cart', JSON.stringify(existing))
    window.dispatchEvent(new Event('cart-updated'))
    toast.success(`${item.name} added to cart`)
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const n = { ...prev }
      if (n[itemId] > 1) n[itemId]-- 
      else delete n[itemId]
      return n
    })
    const existing = JSON.parse(localStorage.getItem('cart') || '{"items":[]}')
    const idx = existing.items.findIndex((i: any) => i.menuItemId === itemId)
    if (idx >= 0) {
      if (existing.items[idx].quantity > 1) existing.items[idx].quantity--
      else existing.items.splice(idx, 1)
      localStorage.setItem('cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('cart-updated'))
    }
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)

  // Load existing cart
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      const c = JSON.parse(stored)
      const counts: Record<string, number> = {}
      c.items?.forEach((i: any) => { counts[i.menuItemId] = i.quantity })
      setCart(counts)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />

      {/* Cover */}
      <div className="relative h-72 md:h-96 mt-16 overflow-hidden">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/40 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-10 pb-20">
        {/* Restaurant info card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
          <div className="flex gap-4 items-start">
            <img src={restaurant.logo} alt="logo" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-black text-2xl md:text-3xl text-white">{restaurant.name}</h1>
                {restaurant.isVerified && <BadgeCheck size={20} className="text-brand-400" />}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${restaurant.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {restaurant.isOpen ? '● Open' : '● Closed'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{restaurant.cuisines?.join(' • ')}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold text-sm">{restaurant.averageRating}</span>
                  <span className="text-slate-400 text-xs">({restaurant.totalReviews?.toLocaleString('en-IN')} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Clock size={14} />
                  <span>{restaurant.deliveryTime?.min}-{restaurant.deliveryTime?.max} min</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <MapPin size={14} />
                  <span>{restaurant.address?.city}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-red-400 transition-colors">
                <Heart size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-brand-400 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Info pills */}
          <div className="flex gap-3 mt-5 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
              Min Order: ₹{restaurant.minimumOrder}
            </span>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-medium ${restaurant.deliveryFee === 0 ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-white/[0.04] border border-white/[0.08] text-slate-300'}`}>
              {restaurant.deliveryFee === 0 ? '🎉 Free Delivery' : `Delivery: ₹${restaurant.deliveryFee}`}
            </span>
            {restaurant.tags?.map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs">{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Veg filter */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-white">Menu</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${vegOnly ? 'bg-green-500' : 'bg-white/20'}`}
              onClick={() => setVegOnly(!vegOnly)}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${vegOnly ? 'left-6' : 'left-1'}`} />
            </div>
            <span className="text-sm font-medium text-slate-300">Veg only</span>
          </label>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredItems.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex gap-4"
            >
              {/* Veg/NonVeg badge */}
              <div className={`flex-shrink-0 self-start mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  {item.isBestSeller && (
                    <span className="px-2 py-0.5 bg-brand-500/20 border border-brand-500/30 text-brand-400 text-[10px] font-bold rounded-full">BESTSELLER</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {item.discountedPrice && (
                      <span className="text-slate-500 text-sm line-through">₹{item.price}</span>
                    )}
                    <span className="text-white font-bold">₹{item.discountedPrice || item.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock size={11} />
                    <span>{item.preparationTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star size={11} className="fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>

              {/* Food image + Add button */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-24 h-20 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {cart[item.id] ? (
                  <div className="flex items-center gap-2 bg-brand-500 rounded-xl px-2 py-1">
                    <button onClick={() => removeFromCart(item.id)} className="text-white"><Minus size={14} /></button>
                    <span className="text-white font-bold text-sm w-4 text-center">{cart[item.id]}</span>
                    <button onClick={() => addToCart(item)} className="text-white"><Plus size={14} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-xl text-sm font-semibold hover:bg-brand-500 hover:text-white transition-all duration-200"
                  >
                    <Plus size={14} /> Add
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <a href="/cart" className="flex items-center gap-4 px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow-glow-lg transition-all duration-200 hover:scale-[1.02]">
              <ShoppingCart size={20} />
              <span className="font-bold">{totalItems} item{totalItems > 1 ? 's' : ''} in cart</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-lg font-semibold text-sm">View Cart →</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
