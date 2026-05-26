'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChefHat, Mail, Lock, User, Phone, ArrowRight, Store } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'restaurant_owner' ? 'owner' : 'customer'

  const [role, setRole] = useState<'customer' | 'owner'>(defaultRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || (role === 'owner' && !restaurantName)) {
      return toast.error('Please fill in all required fields')
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(
        role === 'owner'
          ? 'Restaurant registered successfully! Redirecting...'
          : 'Account created successfully! Redirecting...'
      )
      router.push('/')
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-[#09090f] flex items-center justify-center relative px-4 overflow-hidden py-12">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-orange-600 rounded-xl flex items-center justify-center shadow-glow">
              <ChefHat size={22} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Food<span className="gradient-text">Rush</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm text-center">Join India's most efficient WhatsApp-based food platform</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border border-white/[0.08]"
        >
          {/* Role selector tabs */}
          <div className="flex gap-2 p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl mb-6">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                role === 'customer'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              👤 Customer
            </button>
            <button
              onClick={() => setRole('owner')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                role === 'owner'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              🍽️ Restaurant Partner
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {role === 'owner' && (
              <div>
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Restaurant Name *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Store size={16} />
                  </span>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={e => setRestaurantName(e.target.value)}
                    placeholder="e.g. Burger Singh"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                {role === 'owner' ? "Owner's Full Name *" : 'Full Name *'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kabir Singh"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                Password *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full btn-brand py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer info */}
        <p className="text-slate-500 text-xs text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
