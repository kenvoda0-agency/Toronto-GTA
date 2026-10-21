/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  DollarSign,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  Home,
  Building2,
  Brush,
  RotateCcw,
  Sparkle,
  Award,
  HeartHandshake,
  Check,
  Send,
  Zap
} from 'lucide-react';

/* ==========================================================================
   BUSINESS CONFIGURATION
   Easily replace these constants to customize for any cleaning company!
   ========================================================================== */
export const BUSINESS_CONFIG = {
  companyName: "BrightNest Cleaning",
  tagline: "Toronto & GTA's Most Trusted Cleaning Service",
  headline: "Come home to a spotless space you'll love.",
  phone: "(416) 555-0123",
  phoneRaw: "+14165550123",
  email: "hello@brightnest.ca",
  operatingHours: "Open 7 days, 8am – 9pm",
  locationBadge: "Serving Toronto & the entire GTA",
  rating: "4.9/5",
  reviewCount: "200+",
  happyClientsCount: "500+",
  yearsExperience: "8+",
  satisfactionGuarantee: "100%",
  whatsappMessage: "Hi BrightNest! I'd like to get a quote for cleaning services in the GTA."
};

export default function App() {
  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quote Calculator State
  const [service, setService] = useState<'regular' | 'deep' | 'move' | 'airbnb' | 'construction' | 'office'>('regular');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'bi-weekly' | 'weekly'>('bi-weekly');
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [calculatorTouched, setCalculatorTouched] = useState(false);

  // FAQ Accordion State (single open item)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Before/After Slider State (0 to 100 percentage)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Stats Counters Animation
  const [statsAnimated, setStatsAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Stats Section Counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Live Quote Price Calculation
  // Formula: base = 95 + bedrooms*25 + bathrooms*20
  // Multipliers:
  // Regular 1, Deep 1.6, Move 1.5, Airbnb 1.3, Post-Construction 1.8, Office 1.2
  // Frequency Discounts:
  // One time (1.0), Monthly -10% (0.90), Bi-weekly -15% (0.85), Weekly -20% (0.80)
  const serviceMultipliers: Record<string, { mult: number; label: string }> = {
    regular: { mult: 1.0, label: "Regular Clean" },
    deep: { mult: 1.6, label: "Deep Cleaning" },
    move: { mult: 1.5, label: "Move-In / Move-Out" },
    airbnb: { mult: 1.3, label: "Airbnb Turnover" },
    construction: { mult: 1.8, label: "Post-Construction" },
    office: { mult: 1.2, label: "Office & Commercial" },
  };

  const frequencyDiscounts: Record<string, { factor: number; discountPercent: number; label: string }> = {
    'one-time': { factor: 1.0, discountPercent: 0, label: "One time" },
    'monthly': { factor: 0.90, discountPercent: 10, label: "Monthly (Save 10%)" },
    'bi-weekly': { factor: 0.85, discountPercent: 15, label: "Bi-weekly (Save 15%)" },
    'weekly': { factor: 0.80, discountPercent: 20, label: "Weekly (Save 20%)" },
  };

  const basePrice = 95 + bedrooms * 25 + bathrooms * 20;
  const currentMultiplier = serviceMultipliers[service]?.mult || 1.0;
  const currentFrequency = frequencyDiscounts[frequency] || { factor: 1.0, discountPercent: 0 };
  const estimatedPrice = Math.round(basePrice * currentMultiplier * currentFrequency.factor);
  const fullPriceBeforeDiscount = Math.round(basePrice * currentMultiplier);
  const totalSavings = fullPriceBeforeDiscount - estimatedPrice;

  // Handle Quote Request Submit
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName.trim()) {
      showToast("⚠️ Please enter your full name");
      return;
    }
    if (!quotePhone.trim() || quotePhone.trim().length < 7) {
      showToast("⚠️ Please enter a valid Canadian phone number");
      return;
    }

    setQuoteSubmitted(true);
    showToast(`✅ Thanks ${quoteName.trim()}! We'll contact you within 1 hour.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5500);
  };

  // Before/After Slider Drag Handlers
  const handleMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Helper to scroll to quote calculator and pre-fill service
  const selectServiceAndScroll = (selectedService: 'regular' | 'deep' | 'move' | 'airbnb' | 'construction' | 'office') => {
    setService(selectedService);
    setCalculatorTouched(true);
    const element = document.getElementById('quote-calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbfa] text-[#0f2a2e] selection:bg-[#0e9f8e] selection:text-white">
      
      {/* ===================================================================
          1. TOP BAR
          Serving Toronto & GTA · Hours · Phone · Email
          =================================================================== */}
      <div className="bg-[#0f2a2e] text-white/90 text-xs md:text-sm py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0e9f8e] animate-pulse"></span>
            <span className="font-medium tracking-wide">
              {BUSINESS_CONFIG.locationBadge} · {BUSINESS_CONFIG.operatingHours}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs md:text-sm">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-[#ffb020] transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#0e9f8e]" />
              <span>{BUSINESS_CONFIG.phone}</span>
            </a>
            <span className="text-white/20 hidden sm:inline">|</span>
            <a
              href={`mailto:${BUSINESS_CONFIG.email}`}
              className="flex items-center gap-1.5 hover:text-[#ffb020] transition-colors font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-[#0e9f8e]" />
              <span>{BUSINESS_CONFIG.email}</span>
            </a>
            <span className="text-white/20 hidden md:inline">|</span>
            <a
              href="/brightnest-demo.html"
              download="brightnest-cleaning-demo.html"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#0e9f8e]/30 hover:bg-[#0e9f8e] text-teal-100 hover:text-white px-2.5 py-0.5 rounded-full text-xs font-bold transition-all"
              title="Download 100% self-contained single-file HTML"
            >
              <span>📄 Standalone HTML</span>
            </a>
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. STICKY HEADER
          Logo, Navigation, CTA, Hamburger Menu
          =================================================================== */}
      <header className="sticky top-0 z-40 header-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0e9f8e] to-[#25d3b6] flex items-center justify-center text-white shadow-md shadow-[#0e9f8e]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl tracking-tight text-[#0f2a2e] flex items-center gap-1">
                BrightNest
                <span className="text-[#0e9f8e]">.</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#0e9f8e] -mt-1">
                Cleaning Co. · Toronto
              </div>
            </div>
          </a>

          {/* Desktop Nav Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#0f2a2e]/85">
            <button onClick={() => scrollToSection('services')} className="hover:text-[#0e9f8e] transition-colors cursor-pointer">
              Services
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#0e9f8e] transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#0e9f8e] transition-colors cursor-pointer">
              How it works
            </button>
            <button onClick={() => scrollToSection('results')} className="hover:text-[#0e9f8e] transition-colors cursor-pointer">
              Results
            </button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-[#0e9f8e] transition-colors cursor-pointer">
              Reviews
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#0e9f8e] transition-colors cursor-pointer">
              FAQ
            </button>
          </nav>

          {/* Right Header Action */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="text-xs font-bold text-[#0f2a2e] hover:text-[#0e9f8e] px-3 py-2 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0e9f8e]" />
              <span className="hidden xl:inline">{BUSINESS_CONFIG.phone}</span>
            </a>
            <button
              onClick={() => scrollToSection('quote-calculator')}
              className="bg-[#0e9f8e] hover:bg-[#0a7a6d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#0e9f8e]/25 hover:shadow-lg hover:shadow-[#0e9f8e]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#0f2a2e] hover:bg-[#0e9f8e]/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#0e9f8e]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#0e9f8e]/20 px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4 text-base font-semibold text-[#0f2a2e]">
              <button
                onClick={() => scrollToSection('services')}
                className="text-left py-2 hover:text-[#0e9f8e] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Services</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-left py-2 hover:text-[#0e9f8e] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Pricing Plans</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left py-2 hover:text-[#0e9f8e] border-b border-slate-100 flex items-center justify-between"
              >
                <span>How It Works</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollToSection('results')}
                className="text-left py-2 hover:text-[#0e9f8e] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Before & After Results</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-left py-2 hover:text-[#0e9f8e] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Client Reviews</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left py-2 hover:text-[#0e9f8e] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Frequently Asked Questions</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="pt-3 flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection('quote-calculator')}
                  className="w-full bg-[#0e9f8e] hover:bg-[#0a7a6d] text-white py-3.5 rounded-xl font-bold text-center shadow-md shadow-[#0e9f8e]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Free Instant Quote</span>
                </button>
                <a
                  href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-[#0f2a2e] py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#0e9f8e]" />
                  <span>Call {BUSINESS_CONFIG.phone}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ===================================================================
          3. HERO SECTION (TWO COLUMNS)
          Left: Rating pill, big headline, guarantees, buttons, avatars
          Right: Floating Live Quote Calculator
          =================================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#0e9f8e]/15 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-0 -ml-40 w-80 h-80 rounded-full bg-[#ffb020]/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0e9f8e]/20 shadow-sm text-xs sm:text-sm font-semibold text-[#0f2a2e]">
                <span className="text-base">🏆</span>
                <span>Rated <strong className="text-[#0e9f8e]">4.9/5</strong> by 200+ GTA clients</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020]"></span>
                <span className="text-slate-500 font-normal hidden sm:inline">Bonded & Insured</span>
              </div>

              {/* Big Headline */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0f2a2e] tracking-tight leading-[1.12]">
                Come home to a{' '}
                <span className="text-[#0e9f8e] relative inline-block">
                  spotless space
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#ffb020]/60 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                you'll love.
              </h1>

              {/* Short Paragraph */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Reliable, flat-rate cleaning across Toronto and the GTA. Background-checked cleaners, pet- and kid-safe eco-friendly supplies, and our ironclad free re-clean guarantee if you’re not 100% delighted.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('quote-calculator')}
                  className="bg-[#0e9f8e] hover:bg-[#0a7a6d] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg shadow-[#0e9f8e]/30 hover:shadow-xl hover:shadow-[#0e9f8e]/40 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Get Instant Quote</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                  className="bg-white hover:bg-slate-50 text-[#0f2a2e] border-2 border-[#0e9f8e]/25 hover:border-[#0e9f8e] px-6 py-4 rounded-xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5"
                >
                  <Phone className="w-5 h-5 text-[#0e9f8e]" />
                  <span>Call {BUSINESS_CONFIG.phone}</span>
                </a>
              </div>

              {/* Trust Guarantees */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0" />
                  <span>100% Free Re-clean</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0" />
                  <span>Supplies Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0" />
                  <span>Vetted & Insured Staff</span>
                </div>
              </div>

              {/* Social Proof Avatar Stack */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60">
                <div className="flex -space-x-2.5">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold shadow">
                    SM
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow">
                    JL
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow">
                    JK
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow">
                    AR
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0e9f8e] flex items-center justify-center text-white text-xs font-bold shadow">
                    +500
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#ffb020]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ffb020]" />
                    ))}
                    <span className="font-extrabold text-xs text-[#0f2a2e] ml-1">4.9 / 5.0</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Trusted by 500+ homes & businesses in the GTA
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Floating Quote Calculator Card */}
            <div className="lg:col-span-5" id="quote-calculator">
              <div className={`card-nest p-6 sm:p-7 relative overflow-hidden transition-all duration-300 ${calculatorTouched ? 'ring-2 ring-[#0e9f8e]' : ''}`}>
                
                {/* Header of Quote Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0e9f8e]/10 text-[#0e9f8e]">
                      Instant Quote Calculator
                    </span>
                    <h3 className="font-heading font-extrabold text-xl text-[#0f2a2e] mt-1">
                      Customize Your Clean
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#0e9f8e]/10 flex items-center justify-center text-[#0e9f8e]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                {/* Form Controls */}
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  {/* Service Type Dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Service Type
                    </label>
                    <div className="relative">
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value as any)}
                        className="w-full bg-[#f4fbfa] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0f2a2e] focus:outline-none focus:ring-2 focus:ring-[#0e9f8e] appearance-none cursor-pointer"
                      >
                        <option value="regular">Regular Clean (Ongoing upkeep)</option>
                        <option value="deep">Deep Cleaning (Thorough scrub)</option>
                        <option value="move">Move-In / Move-Out Turnover</option>
                        <option value="airbnb">Airbnb Turnover & Linens</option>
                        <option value="construction">Post-Construction Detailing</option>
                        <option value="office">Office & Commercial</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Bedrooms & Bathrooms Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Bedrooms
                      </label>
                      <div className="relative">
                        <select
                          value={bedrooms}
                          onChange={(e) => setBedrooms(Number(e.target.value))}
                          className="w-full bg-[#f4fbfa] border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0f2a2e] focus:outline-none focus:ring-2 focus:ring-[#0e9f8e] appearance-none cursor-pointer"
                        >
                          <option value={1}>1 Bedroom / Studio</option>
                          <option value={2}>2 Bedrooms</option>
                          <option value={3}>3 Bedrooms</option>
                          <option value={4}>4 Bedrooms</option>
                          <option value={5}>5+ Bedrooms</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Bathrooms
                      </label>
                      <div className="relative">
                        <select
                          value={bathrooms}
                          onChange={(e) => setBathrooms(Number(e.target.value))}
                          className="w-full bg-[#f4fbfa] border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0f2a2e] focus:outline-none focus:ring-2 focus:ring-[#0e9f8e] appearance-none cursor-pointer"
                        >
                          <option value={1}>1 Bathroom</option>
                          <option value={2}>2 Bathrooms</option>
                          <option value={3}>3 Bathrooms</option>
                          <option value={4}>4+ Bathrooms</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Cleaning Frequency
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                      {(['one-time', 'monthly', 'bi-weekly', 'weekly'] as const).map((freqKey) => {
                        const item = frequencyDiscounts[freqKey];
                        const isSelected = frequency === freqKey;
                        return (
                          <button
                            type="button"
                            key={freqKey}
                            onClick={() => setFrequency(freqKey)}
                            className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#0e9f8e] text-white border-[#0e9f8e] shadow-sm'
                                : 'bg-[#f4fbfa] text-[#0f2a2e] border-slate-200 hover:border-[#0e9f8e]/50'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{freqKey === 'one-time' ? 'One-Time' : freqKey === 'bi-weekly' ? 'Bi-Weekly' : freqKey === 'monthly' ? 'Monthly' : 'Weekly'}</span>
                              {item.discountPercent > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#ffb020]/20 text-amber-700'}`}>
                                  -{item.discountPercent}%
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                              {freqKey === 'bi-weekly' ? 'Most popular' : freqKey === 'weekly' ? 'Best value' : freqKey === 'one-time' ? 'Standard rate' : 'Flexible upkeep'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Estimated Price Display */}
                  <div className="bg-gradient-to-r from-[#0f2a2e] to-[#164349] text-white p-4 rounded-2xl shadow-inner mt-4">
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>Estimated price (before tax)</span>
                      {totalSavings > 0 && (
                        <span className="bg-[#ffb020] text-[#0f2a2e] font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          You save ${totalSavings}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-heading font-extrabold text-4xl text-white tracking-tight">
                        ${estimatedPrice}
                      </span>
                      <span className="text-white/70 text-xs font-medium">
                        / clean
                      </span>
                      {totalSavings > 0 && (
                        <span className="line-through text-white/40 text-sm ml-2">
                          ${fullPriceBeforeDiscount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-teal-200/90 mt-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#25d3b6]" />
                      <span>Includes all supplies, equipment & travel in GTA</span>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      className="w-full bg-[#f4fbfa] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0f2a2e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e9f8e]"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g. 416-555-0123)"
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full bg-[#f4fbfa] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0f2a2e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e9f8e]"
                      required
                    />
                  </div>

                  {/* Request Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#ffb020] hover:bg-[#e59d18] text-[#0f2a2e] py-3.5 rounded-xl font-heading font-extrabold text-sm sm:text-base shadow-md shadow-[#ffb020]/30 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#0f2a2e]" />
                    <span>Request My Free Quote</span>
                  </button>

                  {/* Security / Privacy reassurance */}
                  <div className="text-center text-xs text-slate-500 font-medium">
                    🔒 Your info is never shared. We confirm within 1 hour.
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          4. DARK STATS BAND WITH ANIMATED COUNTERS ON SCROLL
          500+ Happy clients, 127 Five-star reviews, 8+ Years experience, 100% Satisfaction
          =================================================================== */}
      <section ref={statsRef} className="bg-[#0f2a2e] text-white py-12 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#0e9f8e_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* Stat 1 */}
            <div className="p-4">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-[#25d3b6] tracking-tight">
                {statsAnimated ? '500+' : '0+'}
              </div>
              <div className="text-sm font-semibold text-white/90 mt-1">Happy GTA Clients</div>
              <div className="text-xs text-white/50 mt-0.5">Homes, condos & commercial spaces</div>
            </div>

            {/* Stat 2 */}
            <div className="p-4 pt-8 lg:pt-4">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-[#ffb020] tracking-tight">
                {statsAnimated ? '127' : '0'}
              </div>
              <div className="text-sm font-semibold text-white/90 mt-1">Five-Star Reviews</div>
              <div className="text-xs text-white/50 mt-0.5">Google & Homestars verified</div>
            </div>

            {/* Stat 3 */}
            <div className="p-4 pt-8 lg:pt-4">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-[#25d3b6] tracking-tight">
                {statsAnimated ? '8+' : '0+'}
              </div>
              <div className="text-sm font-semibold text-white/90 mt-1">Years Experience</div>
              <div className="text-xs text-white/50 mt-0.5">Proudly Canadian family-founded</div>
            </div>

            {/* Stat 4 */}
            <div className="p-4 pt-8 lg:pt-4">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight flex items-center justify-center gap-1">
                <span>{statsAnimated ? '100%' : '0%'}</span>
              </div>
              <div className="text-sm font-semibold text-white/90 mt-1">Satisfaction Guarantee</div>
              <div className="text-xs text-white/50 mt-0.5">Free re-clean within 24 hours</div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          5. SERVICES SECTION (6 CARDS, 3 PER ROW)
          House, Deep, Move-in/out, Airbnb, Office, Carpet
          =================================================================== */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0e9f8e]/10 text-[#0e9f8e] mb-3">
              Comprehensive Cleaning Services
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0f2a2e] tracking-tight">
              Tailored cleaning for every space & schedule
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              From busy downtown Toronto condos to spacious suburban GTA estates and corporate offices, our trained teams deliver unmatched attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. House Cleaning */}
            <div className="card-nest p-7 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center mb-5 group-hover:bg-[#0e9f8e] group-hover:text-white transition-colors duration-300">
                  <Home className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0f2a2e] mb-2">
                  House & Condo Cleaning
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Routine ongoing maintenance for kitchens, bathrooms, living areas, and bedrooms. Keeps your home constantly fresh and inviting.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Countertops, sinks & stove wipe
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Vacuum carpets & mop hardwood
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Full bathroom sanitize & polish
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectServiceAndScroll('regular')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e9f8e] hover:text-[#0a7a6d] group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Deep Cleaning */}
            <div className="card-nest p-7 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#ffb020]/15 text-[#d98200] flex items-center justify-center mb-5 group-hover:bg-[#ffb020] group-hover:text-[#0f2a2e] transition-colors duration-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0f2a2e] mb-2">
                  Deep Cleaning
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Top-to-bottom scrub tackling built-up grease, grout lines, baseboards, door frames, and neglected hard-to-reach nooks.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Detailed baseboards & trim hand-wash
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Inside oven & microwave degreased
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Heavy soap scum & limescale removal
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectServiceAndScroll('deep')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e9f8e] hover:text-[#0a7a6d] group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. Move-In / Move-Out */}
            <div className="card-nest p-7 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center mb-5 group-hover:bg-[#0e9f8e] group-hover:text-white transition-colors duration-300">
                  <RotateCcw className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0f2a2e] mb-2">
                  Move-In / Move-Out
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Full vacancy turnaround designed for landlords, tenants, and realtors. Guarantees your rental deposit back or buyer satisfaction.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Empty cabinets & closets sanitized
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Inside fridge, freezer & range hood
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Walls spot-cleaned & light fixtures
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectServiceAndScroll('move')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e9f8e] hover:text-[#0a7a6d] group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4. Airbnb Turnover */}
            <div className="card-nest p-7 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center mb-5 group-hover:bg-[#0e9f8e] group-hover:text-white transition-colors duration-300">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0f2a2e] mb-2">
                  Airbnb & Short-Term Rental
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Hotel-standard turnovers between guests with fresh bed linens, towel staging, amenity restocks, and damage inspection reports.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Same-day turnover window guaranteed
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Linen laundry & hotel bed making
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Toiletries restocked & photo checklist
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectServiceAndScroll('airbnb')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e9f8e] hover:text-[#0a7a6d] group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5. Office & Commercial */}
            <div className="card-nest p-7 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center mb-5 group-hover:bg-[#0e9f8e] group-hover:text-white transition-colors duration-300">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0f2a2e] mb-2">
                  Office & Commercial
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Customized after-hours or daytime janitorial services for GTA tech startups, clinics, law offices, and retail boutiques.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Workstation sanitizing & boardrooms
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Restrooms & breakroom sanitization
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Trash recycling & floor buffing
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectServiceAndScroll('office')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e9f8e] hover:text-[#0a7a6d] group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 6. Carpet & Upholstery */}
            <div className="card-nest p-7 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center mb-5 group-hover:bg-[#0e9f8e] group-hover:text-white transition-colors duration-300">
                  <Brush className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0f2a2e] mb-2">
                  Carpet & Upholstery
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Commercial-grade hot water steam extraction that eliminates deep-seated dirt, tough wine stains, allergens, and stubborn pet dander.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Deep stain pre-treatment & lift
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Pet odor & bacteria enzymatic wash
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0e9f8e]" /> Fast drying times under 3 hours
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectServiceAndScroll('deep')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e9f8e] hover:text-[#0a7a6d] group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          6. PRICING (3 CARDS, MIDDLE ONE HIGHLIGHTED WITH "MOST POPULAR")
          Regular Clean from $120, Deep Clean from $199, Commercial Custom
          =================================================================== */}
      <section id="pricing" className="py-20 bg-[#f4fbfa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0e9f8e]/10 text-[#0e9f8e] mb-3">
              Transparent Flat Rates
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0f2a2e] tracking-tight">
              Honest, upfront pricing with zero surprises
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              No hidden travel fees, no hourly stress. You always know exactly what you pay before we arrive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Regular Clean */}
            <div className="card-nest p-8 flex flex-col justify-between bg-white relative">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Recurring Upkeep
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-[#0f2a2e]">
                  Regular Clean
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Best for weekly or bi-weekly home maintenance.
                </p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 font-semibold">from</span>
                    <span className="font-heading font-extrabold text-4xl text-[#0f2a2e]">$120</span>
                    <span className="text-slate-500 text-sm font-medium">/visit</span>
                  </div>
                  <div className="text-[11px] text-[#0e9f8e] font-semibold mt-1">
                    Based on standard 1-2 bed GTA condo
                  </div>
                </div>

                <div className="text-xs font-bold text-[#0f2a2e] uppercase tracking-wider mb-3">
                  What's included:
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Kitchen surfaces, exterior appliances & stove</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Full bathroom sanitized, glass & mirrors polished</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>All floors vacuumed and microfiber damp-mopped</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Dusting reachable surfaces & trash emptied</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Eco-friendly, kid & pet safe supplies included</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectServiceAndScroll('regular')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-[#0e9f8e] hover:text-white text-[#0f2a2e] transition-all cursor-pointer text-center"
              >
                Choose Regular Clean
              </button>
            </div>

            {/* Card 2: Deep Clean (MOST POPULAR) */}
            <div className="card-nest p-8 flex flex-col justify-between bg-white relative border-2 border-[#0e9f8e] shadow-xl shadow-[#0e9f8e]/15 lg:-translate-y-2">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ffb020] text-[#0f2a2e] px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 fill-[#0f2a2e]" />
                <span>MOST POPULAR</span>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0e9f8e] mb-2">
                  First-Time & Seasonal Reset
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-[#0f2a2e]">
                  Deep Clean
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Recommended for first visits & semi-annual refreshes.
                </p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 font-semibold">from</span>
                    <span className="font-heading font-extrabold text-4xl text-[#0e9f8e]">$199</span>
                    <span className="text-slate-500 text-sm font-medium">/visit</span>
                  </div>
                  <div className="text-[11px] text-[#0e9f8e] font-semibold mt-1">
                    Comprehensive multi-hour intensive scrub
                  </div>
                </div>

                <div className="text-xs font-bold text-[#0f2a2e] uppercase tracking-wider mb-3">
                  Everything in Regular, PLUS:
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span><strong>Baseboards & door frames</strong> hand-scrubbed</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span><strong>Inside oven & microwave</strong> baked grease removed</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Shower tile grout & heavy soap scum scrubbed</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Window sills, light switches & door knobs sanitized</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Under accessible light furniture and tight corners</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectServiceAndScroll('deep')}
                className="w-full py-4 px-4 rounded-xl font-heading font-extrabold text-sm sm:text-base bg-[#0e9f8e] hover:bg-[#0a7a6d] text-white shadow-lg shadow-[#0e9f8e]/30 transition-all cursor-pointer text-center"
              >
                Book Deep Clean
              </button>
            </div>

            {/* Card 3: Commercial */}
            <div className="card-nest p-8 flex flex-col justify-between bg-white relative">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Commercial & Facilities
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-[#0f2a2e]">
                  Commercial
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Offices, studios, retail, medical & tech hubs.
                </p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-extrabold text-3xl text-[#0f2a2e]">Custom Quote</span>
                  </div>
                  <div className="inline-block bg-[#0e9f8e]/10 text-[#0e9f8e] text-xs font-extrabold px-2.5 py-1 rounded-md mt-2">
                    🎁 FREE demo clean for new clients
                  </div>
                </div>

                <div className="text-xs font-bold text-[#0f2a2e] uppercase tracking-wider mb-3">
                  Tailored commercial benefits:
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Flexible evening, early morning or weekend hours</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>High-touch desks, conference rooms & hardware</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Employee kitchen, fridge & multi-stall restrooms</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>Dedicated account supervisor & monthly invoicing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0e9f8e] shrink-0 mt-0.5" />
                    <span>$5,000,000 commercial liability coverage</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectServiceAndScroll('office')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-[#0e9f8e] hover:text-white text-[#0f2a2e] transition-all cursor-pointer text-center"
              >
                Request Commercial Demo
              </button>
            </div>

          </div>

          {/* Sample Pricing Disclaimer */}
          <div className="text-center text-xs text-slate-500 mt-8">
            * Sample pricing for demonstration purposes. Exact rates depend on verified square footage, pets, and special add-ons.
          </div>

        </div>
      </section>

      {/* ===================================================================
          7. HOW IT WORKS (4 NUMBERED STEPS)
          1. Get a Quote -> 2. Book Online -> 3. We Clean -> 4. Enjoy!
          =================================================================== */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0e9f8e]/10 text-[#0e9f8e] mb-3">
              Simple 4-Step Process
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0f2a2e] tracking-tight">
              A pristine space in four effortless steps
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              No endless phone tag or vague quotes. We make professional cleaning as easy as ordering takeout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative card-nest p-6 text-center group">
              <div className="w-12 h-12 rounded-full bg-[#0e9f8e] text-white font-heading font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#0e9f8e]/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0f2a2e] mb-2">
                Get a Quote
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Choose your home size and preferred frequency. View your transparent flat rate instantly on our calculator.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative card-nest p-6 text-center group">
              <div className="w-12 h-12 rounded-full bg-[#0e9f8e] text-white font-heading font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#0e9f8e]/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0f2a2e] mb-2">
                Book Online
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Pick your preferred date and arrival window. Receive instant confirmation and cleaner ETA tracking by SMS.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative card-nest p-6 text-center group">
              <div className="w-12 h-12 rounded-full bg-[#0e9f8e] text-white font-heading font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#0e9f8e]/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0f2a2e] mb-2">
                We Clean
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Background-checked, insured cleaners arrive on time with hospital-grade eco-friendly supplies and a 50-point checklist.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative card-nest p-6 text-center group border-2 border-[#ffb020]/40">
              <div className="w-12 h-12 rounded-full bg-[#ffb020] text-[#0f2a2e] font-heading font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#ffb020]/30 group-hover:scale-110 transition-transform">
                4
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0f2a2e] mb-2">
                Enjoy!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-2">
                Come home to a sparkling, fresh space. Relax knowing our free re-clean guarantee has you fully covered.
              </p>
              <span className="inline-block bg-[#ffb020]/20 text-[#0f2a2e] text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                Not happy? Free re-clean!
              </span>
            </div>

          </div>

          {/* Quick Step CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => scrollToSection('quote-calculator')}
              className="inline-flex items-center gap-2 bg-[#0e9f8e] hover:bg-[#0a7a6d] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#0e9f8e]/25 hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Start with Step 1: Calculate Your Rate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ===================================================================
          8. RESULTS SECTION: INTERACTIVE BEFORE / AFTER SLIDER
          Pure CSS & SVG gradients slider with drag handle + benefits checklist
          =================================================================== */}
      <section id="results" className="py-20 bg-[#f4fbfa] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0e9f8e]/10 text-[#0e9f8e] mb-3">
              Visible Proof
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0f2a2e] tracking-tight">
              See the BrightNest difference
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Slide the handle left and right to inspect the before-and-after transformation of a GTA kitchen countertop & backsplash.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Interactive Before/After Slider (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white p-3 sm:p-4 rounded-[22px] shadow-lg border border-slate-200">
                
                {/* The Interactive Visual Container */}
                <div
                  ref={sliderContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize before-after-handle"
                >
                  
                  {/* AFTER VIEW (Background / Base Layer) - Gleaming, pristine, sparkling tile */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#e6f7f5] via-[#ffffff] to-[#d0f2ed] flex flex-col justify-between p-6">
                    {/* SVG Tile Pattern (Clean) */}
                    <svg className="absolute inset-0 w-full h-full opacity-30" width="100%" height="100%">
                      <defs>
                        <pattern id="clean-tiles" width="60" height="60" patternUnits="userSpaceOnUse">
                          <rect width="58" height="58" fill="#ffffff" stroke="#0e9f8e" strokeWidth="1" rx="4" />
                          <circle cx="29" cy="29" r="1.5" fill="#0e9f8e" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#clean-tiles)" />
                    </svg>

                    {/* Sparkling Highlights */}
                    <div className="absolute top-10 right-14 text-[#0e9f8e] animate-pulse">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-16 right-28 text-[#ffb020] animate-bounce">
                      <Sparkle className="w-6 h-6 fill-[#ffb020]" />
                    </div>
                    <div className="absolute top-1/2 right-1/4 text-[#25d3b6]">
                      <Sparkles className="w-5 h-5" />
                    </div>

                    {/* Clean Kitchen Graphic Elements */}
                    <div className="relative z-10 flex justify-end">
                      <span className="bg-[#0e9f8e] text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md tracking-wider">
                        ✨ AFTER (BrightNest Clean)
                      </span>
                    </div>

                    <div className="relative z-10 text-right">
                      <div className="inline-block bg-white/90 backdrop-blur px-3 py-2 rounded-xl border border-[#0e9f8e]/30 shadow-sm text-xs font-bold text-[#0f2a2e]">
                        💎 Polished stainless steel · Sanitized grout · Zero grease
                      </div>
                    </div>
                  </div>

                  {/* BEFORE VIEW (Foreground Layer, clipped by sliderPosition) - Grimy, stained pattern */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden bg-gradient-to-tr from-[#3a3227] via-[#4d4234] to-[#2c261e] text-amber-100 flex flex-col justify-between p-6"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    {/* SVG Messy Tile Pattern (Grimy) */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" width="100%" height="100%">
                      <defs>
                        <pattern id="messy-tiles" width="60" height="60" patternUnits="userSpaceOnUse">
                          <rect width="58" height="58" fill="#3a3227" stroke="#635442" strokeWidth="2" rx="2" />
                          <circle cx="15" cy="18" r="4" fill="#1f1a14" opacity="0.6" />
                          <circle cx="42" cy="38" r="6" fill="#282119" opacity="0.8" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#messy-tiles)" />
                    </svg>

                    {/* Coffee stains / dust blotches */}
                    <div className="absolute top-12 left-10 w-16 h-12 rounded-full bg-[#1e1710]/70 blur-sm"></div>
                    <div className="absolute bottom-12 left-24 w-24 h-16 rounded-full bg-[#2a1f14]/80 blur-md"></div>
                    <div className="absolute top-1/2 left-1/3 w-10 h-10 rounded-full bg-[#1b150f]/90 blur-sm"></div>

                    {/* Before Label */}
                    <div className="relative z-10 flex justify-start">
                      <span className="bg-slate-900/90 text-amber-200 font-extrabold text-xs px-3 py-1 rounded-full shadow tracking-wider border border-white/10">
                        ⚡ BEFORE
                      </span>
                    </div>

                    <div className="relative z-10 text-left">
                      <div className="inline-block bg-black/60 backdrop-blur px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold text-amber-200">
                        ☕ Spilled grease, limescale & heavy dust buildup
                      </div>
                    </div>
                  </div>

                  {/* Drag Handle Divider */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#0f2a2e] shadow-xl flex items-center justify-center font-bold text-xs border-2 border-[#0e9f8e]">
                      ⟷
                    </div>
                  </div>

                </div>

                {/* Slider helper hint */}
                <div className="text-center text-xs text-slate-500 font-medium pt-3 flex items-center justify-center gap-2">
                  <span>👈 Drag or swipe slider to compare Before & After 👉</span>
                </div>
              </div>
            </div>

            {/* Benefits Checklist (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e9f8e]">
                  The BrightNest Standard
                </span>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0f2a2e] mt-1">
                  Why GTA homeowners trust our team every day
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0f2a2e]">Background-Checked Cleaners</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Every technician completes rigorous criminal background checks, in-person interviews, and continuous skill verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0f2a2e]">Eco-Friendly, Pet & Kid-Safe</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Non-toxic, plant-based and fragrance-free cleaning agents that protect delicate lungs, paws, and hardwood finishes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0f2a2e]">100% Satisfaction Guarantee</h4>
                    <p className="text-xs text-slate-600 mt-0.5">If any corner doesn’t meet your expectations, notify us within 24 hours and we re-clean that area free of charge.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0f2a2e]">Same-Day & Weekend Availability</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Flexible 7-day scheduling throughout Toronto, York, Peel, Halton, and Durham with fast online dispatch.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('quote-calculator')}
                  className="bg-[#0e9f8e] hover:bg-[#0a7a6d] text-white px-8 py-4 rounded-xl font-heading font-extrabold text-sm shadow-md shadow-[#0e9f8e]/25 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Book My Clean Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ===================================================================
          9. REVIEWS SECTION
          3 testimonial cards: Sarah M., James L., Jennifer K.
          Heading: 4.9/5 from 200+ Google reviews
          =================================================================== */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#ffb020]/20 text-[#0f2a2e] mb-3">
              <Star className="w-3.5 h-3.5 fill-[#ffb020] text-[#ffb020]" />
              <span>Verified Client Feedback</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0f2a2e] tracking-tight">
              4.9/5 from 200+ Google reviews
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Real reviews from real homeowners, condo residents, and property managers across the GTA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1: Sarah M. – Toronto */}
            <div className="card-nest p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-1 text-[#ffb020] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffb020]" />
                  ))}
                  <span className="text-xs font-bold text-slate-400 ml-1">5.0</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "BrightNest transformed my condo after a messy kitchen renovation. The deep clean got rid of months of drywall dust in corners I couldn't even reach. Walking through the front door felt like checking into a luxury boutique hotel!"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0e9f8e] to-teal-400 text-white font-bold text-sm flex items-center justify-center">
                  SM
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f2a2e]">Sarah M.</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0e9f8e]" />
                    <span>Toronto (High Park)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2: James L. – Mississauga */}
            <div className="card-nest p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-1 text-[#ffb020] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffb020]" />
                  ))}
                  <span className="text-xs font-bold text-slate-400 ml-1">5.0</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "We have two golden retrievers, so our floors and upholstery get tested daily. We use BrightNest for bi-weekly visits. They are always on time, incredibly gentle with our dogs, and the flat-rate pricing means no awkward surprises."
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-sm flex items-center justify-center">
                  JL
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f2a2e]">James L.</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0e9f8e]" />
                    <span>Mississauga (Port Credit)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3: Jennifer K. – Markham */}
            <div className="card-nest p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-1 text-[#ffb020] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffb020]" />
                  ))}
                  <span className="text-xs font-bold text-slate-400 ml-1">5.0</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "Outstanding move-out clean! Our landlord did a complete walkthrough and gave us 100% of our deposit back on the spot. He specifically mentioned how spotless the inside of the oven and fridge were. Highly recommended!"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-bold text-sm flex items-center justify-center">
                  JK
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f2a2e]">Jennifer K.</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0e9f8e]" />
                    <span>Markham (Unionville)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Review badge link */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <span>Google Verified Reviews</span>
              <span className="text-[#0e9f8e]">✓</span>
              <span>Average response time under 15 minutes</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================
          10. FAQ ACCORDION (SMOOTH OPEN/CLOSE, ONLY ONE OPEN AT A TIME)
          =================================================================== */}
      <section id="faq" className="py-20 bg-[#f4fbfa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0e9f8e]/10 text-[#0e9f8e] mb-3">
              Got Questions?
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0f2a2e] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Everything you need to know about our Toronto & GTA cleaning services.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do you calculate pricing?",
                a: "Our pricing is transparent and flat-rate, calculated based on the number of bedrooms, bathrooms, service type (regular upkeep, deep clean, or move-out), and cleaning frequency. We do not bill unexpected overtime hours. The price you see on our calculator is your confirmed rate before standard HST."
              },
              {
                q: "Do I need to be home during the clean?",
                a: "No! Many of our clients are at work or running errands during their service. You can simply leave key access instructions (lockbox code, concierge key deposit, or smart keypad pin). Our cleaners are fully bonded, insured, and thoroughly background-checked."
              },
              {
                q: "Do you bring your own cleaning supplies and equipment?",
                a: "Yes! Our technicians arrive fully equipped with hospital-grade microfiber cloths, HEPA-filter vacuums, steam tools, and eco-friendly, non-toxic cleaning solutions that are completely safe for pets and children. If you prefer us to use a specific specialty product on antique wood or marble, simply let us know."
              },
              {
                q: "What if I'm not satisfied with the clean?",
                a: "We back every single job with our 100% Satisfaction Guarantee. If any area was overlooked or didn’t meet our strict quality checklist, notify us within 24 hours with a quick photo, and we will send a team back to re-clean that area free of charge."
              },
              {
                q: "How far in advance should I book?",
                a: "For regular upkeep, we recommend booking 2 to 3 days in advance to secure your preferred morning or afternoon window. For weekend slots, end-of-month move-outs, and deep cleans, 5 to 7 days notice is ideal. However, we also hold emergency same-day backup slots across Toronto!"
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="card-nest overflow-hidden border border-slate-200 transition-all bg-white"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-heading font-bold text-base sm:text-lg text-[#0f2a2e] flex items-center justify-between gap-4 cursor-pointer hover:text-[#0e9f8e] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full bg-[#0e9f8e]/10 text-[#0e9f8e] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#0e9f8e] text-white' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center text-sm text-slate-600">
            Have a question not listed here?{' '}
            <a href={`tel:${BUSINESS_CONFIG.phoneRaw}`} className="text-[#0e9f8e] font-bold hover:underline">
              Call {BUSINESS_CONFIG.phone}
            </a>{' '}
            or email{' '}
            <a href={`mailto:${BUSINESS_CONFIG.email}`} className="text-[#0e9f8e] font-bold hover:underline">
              {BUSINESS_CONFIG.email}
            </a>
          </div>

        </div>
      </section>

      {/* ===================================================================
          11. SERVICE AREAS (PILL TAGS)
          Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton,
          Vaughan, Markham, Richmond Hill, Oakville, Burlington, Pickering
          =================================================================== */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0e9f8e] mb-2">
            <MapPin className="w-4 h-4" />
            <span>Serving The Greater Toronto Area</span>
          </div>

          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0f2a2e] tracking-tight mb-4">
            Proudly cleaning neighborhoods across the entire GTA
          </h3>

          <p className="text-slate-600 text-sm max-w-2xl mx-auto mb-8">
            Our mobile cleaning units operate 7 days a week across all major regions with no extra travel surcharge within our standard service zone.
          </p>

          {/* Pill tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            {[
              "Toronto",
              "North York",
              "Scarborough",
              "Etobicoke",
              "Mississauga",
              "Brampton",
              "Vaughan",
              "Markham",
              "Richmond Hill",
              "Oakville",
              "Burlington",
              "Pickering"
            ].map((city) => (
              <span
                key={city}
                className="px-4 py-2 rounded-full bg-[#f4fbfa] hover:bg-[#0e9f8e] hover:text-white border border-[#0e9f8e]/20 text-[#0f2a2e] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-default shadow-sm"
              >
                📍 {city}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Don't see your specific neighborhood? We serve all postal codes within 60km of Downtown Toronto.
          </p>

        </div>
      </section>

      {/* ===================================================================
          12. FINAL CTA BANNER WITH GRADIENT BACKGROUND
          "Ready for a spotless space?" + Get My Free Quote Button
          =================================================================== */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#0f2a2e] via-[#0e9f8e] to-[#0a7a6d] text-white">
        {/* Subtle background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#ffb020]/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/15 text-teal-100 mb-4 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-[#ffb020]" />
            <span>Limited Time GTA New Client Offer</span>
          </span>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Ready for a spotless space you'll love?
          </h2>

          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto mt-4 mb-8">
            Join hundreds of satisfied Toronto & GTA homeowners and office managers. Get your instant flat-rate quote in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('quote-calculator')}
              className="w-full sm:w-auto bg-[#ffb020] hover:bg-[#e59d18] text-[#0f2a2e] px-8 py-4 rounded-xl font-heading font-extrabold text-base shadow-xl shadow-black/20 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[#0f2a2e]" />
              <span>Get My Free Quote</span>
            </button>
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/25 px-7 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 backdrop-blur"
            >
              <Phone className="w-5 h-5 text-[#ffb020]" />
              <span>Call (416) 555-0123</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70 mt-8">
            <span className="flex items-center gap-1.5">✓ No credit card required</span>
            <span className="flex items-center gap-1.5">✓ Instant quote in 30 sec</span>
            <span className="flex items-center gap-1.5">✓ 100% money-back re-clean guarantee</span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          13. FOOTER WITH 4 COLUMNS
          Company info, For Homes, For Business, Company + Copyright
          =================================================================== */}
      <footer className="bg-[#0b2023] text-white/80 pt-16 pb-12 border-t border-white/10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            
            {/* Col 1 & 2: Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0e9f8e] to-[#25d3b6] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                  BrightNest<span className="text-[#0e9f8e]">.</span>
                </span>
              </div>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-sm">
                Toronto & Greater Toronto Area's premier residential and commercial cleaning service. Reliable flat-rate quotes, eco-friendly supplies, and guaranteed peace of mind.
              </p>
              <div className="space-y-2 pt-2 text-xs text-white/75">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0e9f8e]" />
                  <span>Serving Toronto, Peel, York, Halton & Durham</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0e9f8e]" />
                  <span>{BUSINESS_CONFIG.operatingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0e9f8e]" />
                  <a href={`tel:${BUSINESS_CONFIG.phoneRaw}`} className="hover:text-white">{BUSINESS_CONFIG.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0e9f8e]" />
                  <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-white">{BUSINESS_CONFIG.email}</a>
                </div>
              </div>
            </div>

            {/* Col 3: For Homes */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm tracking-wider uppercase">
                For Homes
              </h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><button onClick={() => selectServiceAndScroll('regular')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Regular House Cleaning</button></li>
                <li><button onClick={() => selectServiceAndScroll('deep')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Deep Cleaning Service</button></li>
                <li><button onClick={() => selectServiceAndScroll('move')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Move-In / Move-Out Clean</button></li>
                <li><button onClick={() => selectServiceAndScroll('construction')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Post-Renovation Cleaning</button></li>
                <li><button onClick={() => selectServiceAndScroll('deep')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Carpet Steam Extraction</button></li>
              </ul>
            </div>

            {/* Col 4: For Business */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm tracking-wider uppercase">
                For Business
              </h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><button onClick={() => selectServiceAndScroll('office')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Office & Janitorial</button></li>
                <li><button onClick={() => selectServiceAndScroll('airbnb')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Airbnb Turnovers & Linens</button></li>
                <li><button onClick={() => selectServiceAndScroll('office')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Retail & Storefronts</button></li>
                <li><button onClick={() => selectServiceAndScroll('office')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Medical & Dental Clinics</button></li>
                <li><button onClick={() => selectServiceAndScroll('office')} className="hover:text-[#ffb020] font-bold transition-colors cursor-pointer text-left">Free Demo Clean Offer</button></li>
              </ul>
            </div>

            {/* Col 5: Company */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm tracking-wider uppercase">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">How It Works</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Transparent Pricing</button></li>
                <li><button onClick={() => scrollToSection('results')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Before & After Gallery</button></li>
                <li><button onClick={() => scrollToSection('reviews')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Customer Reviews</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-[#25d3b6] transition-colors cursor-pointer text-left">Frequently Asked Questions</button></li>
              </ul>
            </div>

          </div>

          {/* Copyright & Disclaimer Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
            <div>
              © 2026 BrightNest Cleaning · Demo website for Toronto & GTA services.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-white transition-colors cursor-pointer">GTA Coverage Map</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ===================================================================
          14. FLOATING WHATSAPP & CALL BUTTONS (FIXED AT BOTTOM-RIGHT)
          WhatsApp (green #25D366) and Call (teal #0e9f8e)
          =================================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* WhatsApp Round Button */}
        <a
          href={`https://wa.me/14165550123?text=${encodeURIComponent(BUSINESS_CONFIG.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
          {/* Tooltip on hover */}
          <span className="absolute right-16 bg-[#0f2a2e] text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>

        {/* Call Round Button */}
        <a
          href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
          aria-label="Call BrightNest Now"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0e9f8e] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Phone className="w-6 h-6 text-white" />
          {/* Tooltip on hover */}
          <span className="absolute right-16 bg-[#0f2a2e] text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Call (416) 555-0123
          </span>
        </a>

      </div>

      {/* ===================================================================
          FRIENDLY TOAST NOTIFICATION
          =================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0f2a2e] text-white px-6 py-4 rounded-2xl shadow-2xl border border-[#0e9f8e]/40 flex items-center gap-3 text-sm font-semibold max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-[#0e9f8e] text-white flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1">
            {toastMessage}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/50 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
