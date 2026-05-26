'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, Star, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { RESTAURANTS, CATEGORIES, CITIES } from '@/lib/mockData'

const CUISINES = ['All', 'Biryani', 'Burgers', 'Pizza', 'South Indian', 'Chinese', 'Desserts', 'Cafe', 'BBQ', 'Momos']

export default function RestaurantsPage() {
  const [search, setSearch] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [onlyVeg, setOnlyVeg] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = [...RESTAURANTS]
    if (search) list = list.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisines.some((c: string) => c.toLowerCase().includes(search.toLowerCase()))
    )
    if (selectedCuisine !== 'All') list = list.filter(r => r.cuisines.includes(selectedCuisine))
    if (selectedCity !== 'All Cities') list = list.filter(r => r.address.city === selectedCity)
    if (onlyOpen) list = list.filter(r => r.isOpen)
    if (minRating > 0) list = list.filter(r => r.averageRating >= minRating)

    switch (sortBy) {
      case 'rating': list.sort((a, b) => b.averageRating - a.averageRating); break
      case 'delivery': list.sort((a, b) => a.deliveryTime.min - b.deliveryTime.min); break
      case 'min_order': list.sort((a, b) => a.minimumOrder - b.minimumOrder); break
    }
    return list
  }, [search, selectedCuisine, selectedCity, onlyOpen, minRating, sortBy])

  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />
      <div className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-6">
          <h1 className="font-display font-black text-4xl text-white mb-2">Restaurants</h1>
          <p className="text-slate-400">{filtered.length} restaurants available near you</p>
        </motion.div>

        {/* Search + Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] focus-within:border-brand-500/50 transition-all duration-200">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="bg-transparent text-white placeholder:text-slate-500 focus:outline-none w-full"
            />
            {search && <button onClick={() => setSearch('')}><X size={16} className="text-slate-400" /></button>}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-2xl border transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
              showFilters ? 'bg-brand-500/20 border-brand-500/50 text-brand-400' : 'bg-white/[0.05] border-white/[0.08] text-slate-300 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </motion.div>

        {/* Cuisine Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          {CUISINES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`cuisine-pill whitespace-nowrap flex-shrink-0 ${selectedCuisine === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* City */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">City</label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="input-field text-sm py-2"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Sort */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">Sort by</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field text-sm py-2">
                <option value="rating">Top Rated</option>
                <option value="delivery">Fastest Delivery</option>
                <option value="min_order">Lowest Min Order</option>
              </select>
            </div>
            {/* Min Rating */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">Min Rating: {minRating > 0 ? `${minRating}★` : 'Any'}</label>
              <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>
            {/* Toggles */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyOpen} onChange={e => setOnlyOpen(e.target.checked)} className="accent-brand-500 w-4 h-4" />
                <span className="text-slate-300 text-sm">Open Now</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-white font-bold text-xl mb-2">No restaurants found</h3>
            <p className="text-slate-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((r, i) => <RestaurantCard key={r.id} restaurant={r} index={i} />)}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
