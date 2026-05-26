'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChefHat, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      return toast.error('Please fill in all fields')
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Successfully signed in!')
      router.push('/')
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-[#09090f] flex items-center justify-center relative px-4 overflow-hidden">
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
          <p className="text-slate-400 text-sm text-center">Sign in to your restaurant dashboard or customer account</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border border-white/[0.08]"
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 block">
                Email Address
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
              <div className="flex justify-between items-center mb-2">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block">
                  Password
                </label>
                <a href="#" className="text-brand-400 hover:text-brand-300 text-xs transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              className="w-full btn-brand py-3 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Social login divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative bg-[#13131d] px-3 text-slate-500 text-xs uppercase tracking-wider">
              Demo Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setEmail('owner@burger-singh.com')
                setPassword('password123')
                toast.success('Filled with Owner credentials')
              }}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-brand-500/50 hover:bg-brand-500/5 text-slate-300 hover:text-brand-400 font-semibold text-xs transition-all duration-200"
            >
              🔑 Restaurant Owner
            </button>
            <button
              onClick={() => {
                setEmail('customer@foodrush.com')
                setPassword('password123')
                toast.success('Filled with Customer credentials')
              }}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-brand-500/50 hover:bg-brand-500/5 text-slate-300 hover:text-brand-400 font-semibold text-xs transition-all duration-200"
            >
              👤 Customer Demo
            </button>
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="text-slate-500 text-xs text-center mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  )
}
