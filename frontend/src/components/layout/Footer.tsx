import Link from 'next/link'
import { ChefHat, Instagram, Twitter, Facebook, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0e0e16] border-t border-white/[0.06] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ChefHat size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Food<span className="gradient-text">Rush</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              India's smartest food ordering platform. Browse menus and order directly via WhatsApp — no app download needed.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map(item => (
                <li key={item}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* For Restaurants */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Restaurants</h3>
            <ul className="space-y-3">
              {['Partner With Us', 'Restaurant Dashboard', 'Pricing Plans', 'Analytics', 'Support'].map(item => (
                <li key={item}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map(item => (
                <li key={item}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2025 FoodRush. All rights reserved.</p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-500 fill-red-500" /> for India's food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
