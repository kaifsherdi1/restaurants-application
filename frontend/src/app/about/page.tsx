'use client'
import { motion } from 'framer-motion'
import { ChefHat, Users, Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  const stats = [
    { value: '500+', label: 'Local Restaurant Partners' },
    { value: '50,000+', label: 'Delighted Customers' },
    { value: '25+', label: 'Cities Across India' },
    { value: '1.2M+', label: 'WhatsApp Orders Delivered' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Zero Commissions',
      desc: 'We believe local restaurants should keep 100% of their earnings. FoodRush connects customers directly to kitchens, keeping local businesses profitable.',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Partners',
      desc: 'Every restaurant listed on our platform is verified and compliant with FSSAI standards. Eat clean, eat local, eat with peace of mind.',
    },
    {
      icon: Users,
      title: 'Community First',
      desc: 'Our platform is designed around supporting small food vendors, home kitchens, and established local eateries alike.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6"
          >
            <ChefHat size={14} />
            <span>Our Journey</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight"
          >
            Connecting Hungry Hearts
            <br />
            With Delectable <span className="gradient-text">Local Flavors</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            FoodRush is India's fastest-growing WhatsApp food ordering platform. We bypass the complexity of traditional apps, letting you place direct orders via chat in seconds.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, border: '1px solid rgba(249, 115, 22, 0.2)' }}
              className="glass-card p-6 text-center border border-white/[0.04]"
            >
              <div className="text-3xl sm:text-4xl font-black text-brand-400 font-display mb-1">{stat.value}</div>
              <div className="text-slate-400 text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story / Values Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-header text-left text-3xl font-black mb-6">Revolutionizing food delivery for local economies</h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Traditional food aggregator platforms charge up to 30% commission from local restaurants and inflate menu prices for consumers. We believed there was a better way.
            </p>
            <p className="text-slate-400 leading-relaxed">
              By utilizing the ubiquitous power of WhatsApp, FoodRush builds a direct highway between you and your local restaurants. Your cart is sent directly to the vendor's WhatsApp chat, keeping interactions clear, operations simple, and commissions at absolute zero.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[320px] rounded-3xl overflow-hidden border border-white/[0.08]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-[#302b63]/40 mix-blend-overlay z-10" />
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant kitchen"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Our Values Grid */}
        <div className="text-center mb-12">
          <h2 className="section-header text-2xl sm:text-3xl font-black mb-2">Our Core Values</h2>
          <p className="text-slate-400 text-sm">The principles guiding FoodRush's mission</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card p-8 hover:border-brand-500/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                <v.icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-3">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-orange-700 p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white mb-4">
              Hungry? Let's find your next meal
            </h2>
            <p className="text-orange-100 text-base mb-8">
              Explore your city's finest restaurants and place order directly on WhatsApp.
            </p>
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-2xl hover:bg-orange-50 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
            >
              Explore Restaurants <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
