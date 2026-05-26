'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      return toast.error('Please fill in all required fields.')
    }

    setIsPending(true)

    // Simulate API request
    setTimeout(() => {
      setIsPending(false)
      setIsSubmitted(true)
      toast.success('Message sent successfully!')
    }, 1500)
  }

  const contactDetails = [
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 74831 92591',
      desc: 'Mon - Sat: 9 AM to 6 PM',
      href: 'tel:+917483192591',
    },
    {
      icon: Mail,
      title: 'Email Us',
      value: 'support@foodrush.in',
      desc: 'We reply within 24 hours',
      href: 'mailto:support@foodrush.in',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123, Tech Boulevard, Sector 62',
      desc: 'Noida, Uttar Pradesh - 201301',
      href: 'https://maps.google.com',
    },
  ]

  return (
    <main className="min-h-screen bg-[#09090f]">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.12),transparent)] pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6"
          >
            <HelpCircle size={14} />
            <span>Support & Inquiries</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-black text-4xl sm:text-5xl text-white mb-4"
          >
            We'd Love to <span className="gradient-text">Hear From You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            Have a question, feedback, or want to list your restaurant? Get in touch with our team, and we'll get back to you shortly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Contact info cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactDetails.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.icon === MapPin ? '_blank' : undefined}
                rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -3, border: '1px solid rgba(249, 115, 22, 0.2)' }}
                className="glass-card p-6 flex gap-5 items-start border border-white/[0.04] cursor-pointer block"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-1">{item.title}</h3>
                  <p className="text-white font-bold text-base mb-1">{item.value}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6 sm:p-10 border border-white/[0.04]"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-slate-400 text-xs font-semibold mb-2 block">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-semibold mb-2 block">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="e.g. john@example.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-xs font-semibold mb-2 block">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="How can we help you?"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-xs font-semibold mb-2 block">Message *</label>
                      <textarea
                        required
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows={5}
                        className="input-field resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isPending}
                      className="btn-brand w-full justify-center gap-2 py-3.5 text-base font-semibold"
                    >
                      {isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="inline-flex w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 items-center justify-center text-green-400 mb-2">
                      <CheckCircle size={32} />
                    </div>
                    <h2 className="font-display font-bold text-2xl text-white">Thank you, {name}!</h2>
                    <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                      Your message has been sent. Our team will review your message and reach out to you at <span className="text-brand-400 font-semibold">{email}</span> if needed.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false)
                        setName('')
                        setEmail('')
                        setSubject('')
                        setMessage('')
                      }}
                      className="btn-outline px-6 py-2.5 text-sm"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
