'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { RESTAURANTS } from '@/lib/mockData'

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = RESTAURANTS.filter(r =>
    !query || r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.cuisines.some((c: string) => c.toLowerCase().includes(query.toLowerCase())) ||
    r.address.city.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.1] focus-within:border-brand-500/50 transition-all duration-200 text-lg">
          <Search size={22} className="text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search restaurants, dishes, cuisines..."
            className="bg-transparent text-white placeholder:text-slate-500 focus:outline-none flex-1"
          />
          {query && <button onClick={() => setQuery('')}><X size={20} className="text-slate-400" /></button>}
        </div>
      </div>

      {query && (
        <p className="text-slate-400 text-sm mb-6">{results.length} results for "<span className="text-white">{query}</span>"</p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((r, i) => <RestaurantCard key={r.id} restaurant={r} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-white font-bold text-xl mb-2">No results found</h3>
          <p className="text-slate-400">Try a different search term</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />
      <Suspense fallback={<div className="pt-24 text-center text-slate-400">Loading...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  )
}
