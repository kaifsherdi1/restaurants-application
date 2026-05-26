'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, Star, ArrowRight, ChevronDown, Zap, Shield, Smartphone } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { RESTAURANTS, CATEGORIES } from '@/lib/mockData'

const HERO_PHRASES = ['Biryani', 'Burgers', 'Pizza', 'Momos', 'Waffles', 'Dosas']

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Cycle hero phrases
  useEffect(() => {
    const timer = setInterval(() => setPhraseIndex(i => (i + 1) % HERO_PHRASES.length), 2500)
    return () => clearInterval(timer)
  }, [])

  const featuredRestaurants = RESTAURANTS.filter(r => r.isFeatured).slice(0, 6)
  const allRestaurants = RESTAURANTS.slice(0, 8)

  const stats = [
    { value: '500+', label: 'Restaurants' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '25+', label: 'Cities' },
    { value: '4.8★', label: 'App Rating' },
  ]

  const features = [
    { icon: Zap, title: 'Instant WhatsApp Orders', desc: 'One click sends your complete order to the restaurant on WhatsApp. No payment gateway hassle.' },
    { icon: Shield, title: 'Verified Restaurants', desc: 'All restaurants are verified with FSSAI license. Eat safe, eat fresh.' },
    { icon: Smartphone, title: 'Mobile-First Experience', desc: 'Designed for Indian users. Works perfectly on any device, even on 2G.' },
  ]

  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]" />
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl float-1" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl float-2" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-brand-600/8 rounded-full blur-3xl float-3" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            Now in 25+ Indian cities
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight"
          >
            Order Your
            <br />
            <span className="relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40, rotateX: 90 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="gradient-text inline-block"
                >
                  {HERO_PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="text-white">via WhatsApp</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Browse local restaurants, build your cart, and send your order directly via WhatsApp — no payment, no signup needed!
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex gap-2 p-2 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl">
              <div className="flex items-center gap-2 px-3 flex-1">
                <Search size={18} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search restaurants, dishes..."
                  className="bg-transparent text-white placeholder:text-slate-500 focus:outline-none w-full text-base"
                  onKeyDown={e => e.key === 'Enter' && window.location.assign(`/search?q=${search}`)}
                />
              </div>
              <Link
                href={`/search?q=${search}`}
                className="btn-brand flex-shrink-0 flex items-center gap-2 px-5 py-3 text-sm"
              >
                Search <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['Biryani 🍛', 'Burger 🍔', 'Pizza 🍕', 'Momos 🥟', 'Coffee ☕'].map(tag => (
                <button
                  key={tag}
                  onClick={() => window.location.assign(`/search?q=${tag.split(' ')[0]}`)}
                  className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs hover:bg-brand-500/20 hover:border-brand-500/50 hover:text-brand-400 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-4">
                <div className="text-2xl font-black text-brand-400 font-display">{stat.value}</div>
                <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-1"
        >
          <span className="text-xs">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── CUISINE CATEGORIES ──────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-header">What's on your mind?</h2>
            <p className="text-slate-400 text-sm">Browse by cuisine type</p>
          </div>
          <Link href="/restaurants" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/restaurants?cuisine=${cat.name}`} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/[0.08] group-hover:border-brand-500/50 transition-all duration-300 shadow-card group-hover:shadow-glow">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-slate-400 group-hover:text-brand-400 text-xs font-medium text-center transition-colors duration-200 leading-tight">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED RESTAURANTS ─────────────────────────────────── */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-header">Featured Restaurants</h2>
            <p className="text-slate-400 text-sm">Curated picks just for you</p>
          </div>
          <Link href="/restaurants?featured=true" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredRestaurants.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="section-header text-3xl md:text-4xl">How FoodRush works</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">Order in 3 simple steps — no account needed</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

          {[
            { step: '01', emoji: '🔍', title: 'Find Restaurants', desc: 'Browse nearby restaurants, filter by cuisine, rating, or delivery time.' },
            { step: '02', emoji: '🛒', title: 'Build Your Cart', desc: 'Add your favourite dishes, customize them, and review your order.' },
            { step: '03', emoji: '💬', title: 'Order on WhatsApp', desc: 'Click the WhatsApp button — your order lands directly in the restaurant\'s chat. Done!' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card p-7 text-center relative"
            >
              <div className="text-5xl mb-4">{step.emoji}</div>
              <div className="text-xs font-bold text-brand-400 tracking-widest mb-2">STEP {step.step}</div>
              <h3 className="font-display font-bold text-white text-lg mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ALL RESTAURANTS ──────────────────────────────────────── */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-header">All Restaurants</h2>
            <p className="text-slate-400 text-sm">{RESTAURANTS.length} restaurants available</p>
          </div>
          <Link href="/restaurants" className="btn-outline text-sm px-4 py-2">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {allRestaurants.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-7 group hover:border-brand-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-all duration-300">
                <f.icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-orange-700 p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4">
              Own a restaurant? 🍽️
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
              List your restaurant for free, manage your menu, and start receiving WhatsApp orders today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register?role=restaurant_owner" className="px-8 py-4 bg-white text-brand-600 font-bold rounded-2xl hover:bg-orange-50 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                List Your Restaurant Free
              </Link>
              <Link href="/restaurants" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                Browse Restaurants
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
