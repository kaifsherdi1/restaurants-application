'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, ChefHat, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      const cart = JSON.parse(stored)
      setCartCount(cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0)
    }
    const handleCartUpdate = () => {
      const stored = localStorage.getItem('cart')
      if (stored) {
        const cart = JSON.parse(stored)
        setCartCount(cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0)
      }
    }
    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/search', label: 'Explore' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#09090f]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-orange-600 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <ChefHat size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Food<span className="gradient-text">Rush</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:border-brand-500/50 transition-all duration-200 text-sm">
              <Search size={15} />
              <span>Search food...</span>
            </Link>

            <Link href="/cart" className="relative p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-brand-400 hover:border-brand-500/50 transition-all duration-200">
              <ShoppingCart size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link href="/login" className="hidden md:block px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow">
              Sign In
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#13131d]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-slate-300 hover:text-white font-medium border-b border-white/[0.06] last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block mt-4 btn-brand text-center">
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
