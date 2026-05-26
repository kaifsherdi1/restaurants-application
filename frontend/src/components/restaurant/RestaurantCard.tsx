'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, MapPin, Zap, BadgeCheck } from 'lucide-react'

interface RestaurantCardProps {
  restaurant: any
  index?: number
}

export default function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const isOpen = restaurant.isOpen
  const rating = restaurant.averageRating?.toFixed(1) || '0.0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/restaurants/${restaurant.slug}`} className="block group">
        <div className="glass-card overflow-hidden card-hover cursor-pointer h-full">
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={restaurant.coverImage || `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop`}
              alt={restaurant.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {restaurant.isFeatured && (
                <span className="px-2 py-0.5 bg-brand-500 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
              )}
              {restaurant.subscriptionPlan === 'enterprise' && (
                <span className="px-2 py-0.5 bg-violet-600/90 text-white text-xs font-semibold rounded-full">
                  Enterprise
                </span>
              )}
              {restaurant.tags?.[0] && (
                <span className="px-2 py-0.5 bg-black/50 backdrop-blur text-white text-xs font-medium rounded-full">
                  {restaurant.tags[0]}
                </span>
              )}
            </div>

            {/* Open/Closed */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              isOpen ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isOpen ? '● Open' : '● Closed'}
            </div>

            {/* Logo */}
            <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 pt-7">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-white text-base group-hover:text-brand-400 transition-colors duration-200">
                  {restaurant.name}
                </h3>
                {restaurant.isVerified && (
                  <BadgeCheck size={15} className="text-brand-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-0.5 flex-shrink-0">
                <Star size={12} className="text-green-400 fill-green-400" />
                <span className="text-green-400 text-xs font-bold">{rating}</span>
              </div>
            </div>

            {/* Cuisines */}
            <p className="text-slate-400 text-xs mb-3 line-clamp-1">
              {restaurant.cuisines?.join(' • ')}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
              <MapPin size={11} />
              <span className="line-clamp-1">{restaurant.address?.city}</span>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-1">
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Clock size={12} />
                <span>{restaurant.deliveryTime?.min}-{restaurant.deliveryTime?.max} min</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Zap size={12} className="text-brand-400" />
                <span>Min ₹{restaurant.minimumOrder}</span>
              </div>
              <div className={`text-xs font-medium ${restaurant.deliveryFee === 0 ? 'text-green-400' : 'text-slate-400'}`}>
                {restaurant.deliveryFee === 0 ? 'Free delivery' : `₹${restaurant.deliveryFee} delivery`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
