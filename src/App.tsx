import React, { useState, useEffect } from 'react';
import { Scissors, Phone, User, CheckCircle2, Loader2, ChevronRight, X, Clock, Star, MapPin, Instagram, Facebook, Home, Map as MapIcon, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: 'Hair' | 'Beard' | 'Spa';
}

const SERVICES: Service[] = [
  { id: '1', name: 'Signature Fade', price: 1200, duration: '45 min', description: 'Coupe classique ou moderne avec dégradé précis.', category: 'Hair' },
  { id: '2', name: 'Beard Sculpting', price: 600, duration: '25 min', description: 'Taille et contour de barbe avec serviette chaude.', category: 'Beard' },
  { id: '3', name: 'The QLF Full', price: 1600, duration: '75 min', description: 'Coupe signature + Barbe + Soin rapide.', category: 'Hair' },
  { id: '4', name: 'Black Mask Therapy', price: 1000, duration: '30 min', description: 'Nettoyage profond et masque au charbon.', category: 'Spa' },
  { id: '5', name: 'Hair Coloring', price: 1800, duration: '60 min', description: 'Teinture professionnelle pour cheveux.', category: 'Hair' },
  { id: '6', name: 'Premium Smoothing', price: 2500, duration: '90 min', description: 'Lissage protéine haute qualité.', category: 'Hair' },
];

const HOME_SERVICE_FEE = 500;
const SHOP_LOCATION_IFRAME = "https://www.google.com/maps?q=QLF+BARBER+Rue+de+Meskiana+214+Logements+Khenchela&output=embed";

export default function App() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isHomeService, setIsHomeService] = useState(false);
  const [step, setStep] = useState<'services' | 'form' | 'success'>('services');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const baseTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalPrice = baseTotal + (isHomeService ? HOME_SERVICE_FEE : 0);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          services: selectedServices.map((s) => s.name),
          total: totalPrice,
          isHomeService,
          locationLink: isHomeService ? locationLink : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center orange-glow">
              <Scissors className="text-black w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">QLF Barber</h1>
              <span className="text-[10px] text-orange-500 font-mono uppercase tracking-[0.2em]">chez amir</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white/50">
            <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            <a href="#location" className="hover:text-orange-500 transition-colors">Localisation</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
          <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all">
            Réserver
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-mono uppercase tracking-widest mb-6">
              <Star className="w-3 h-3 fill-orange-500" />
              Le meilleur barbier à votre service
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8 text-gradient">
              Redéfinissez <br /> Votre Style.
            </h2>
            <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
              Vivez une expérience de toilettage premium chez QLF Barber. Amir et son équipe vous accueillent pour des coupes de précision et des soins exclusifs.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://maps.app.goo.gl/GARjU4kER1zsbdof9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 text-sm font-mono hover:text-orange-500 transition-colors"
              >
                <MapPin className="w-4 h-4 text-orange-500" /> Khenchela, Algérie
              </a>
              <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
                <Clock className="w-4 h-4 text-orange-500" /> 09:00 - 21:00
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-20">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Main Content */}
      <main id="services" className="max-w-7xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {step === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Services Grid */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold font-display uppercase tracking-tight">Nos Prestations</h3>
                  <div className="flex gap-2">
                    {['All', 'Hair', 'Beard', 'Spa'].map(cat => (
                      <button key={cat} className="px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border border-white/10 hover:border-orange-500 transition-colors">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Home Service Option */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setIsHomeService(!isHomeService)}
                  className={`w-full p-8 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-between overflow-hidden relative ${
                    isHomeService 
                      ? 'bg-orange-500/10 border-orange-500 orange-glow' 
                      : 'glass border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                      isHomeService ? 'bg-orange-500 text-black' : 'bg-white/5 text-orange-500'
                    }`}>
                      <Home className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xl font-black uppercase italic tracking-tight">Hébergement à domicile</h4>
                      <p className="text-sm text-white/40">Amir vient chez vous pour votre confort.</p>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <span className="text-xs font-mono uppercase text-white/30 block mb-1">Frais de déplacement</span>
                    <span className="text-2xl font-black text-orange-500">+{HOME_SERVICE_FEE} DA</span>
                  </div>
                  {isHomeService && (
                    <div className="absolute top-0 right-0 p-4">
                      <CheckCircle2 className="text-orange-500 w-6 h-6" />
                    </div>
                  )}
                </motion.button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICES.map((service) => {
                    const isSelected = selectedServices.find((s) => s.id === service.id);
                    return (
                      <motion.button
                        whileHover={{ y: -4 }}
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className={`group relative text-left p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                          isSelected
                            ? 'bg-orange-500 border-orange-500 text-black'
                            : 'glass glass-hover'
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md ${
                              isSelected ? 'bg-black/10' : 'bg-white/5'
                            }`}>
                              {service.category}
                            </span>
                            <span className="font-black text-xl">{service.price} DA</span>
                          </div>
                          <h4 className="text-xl font-bold mb-2">{service.name}</h4>
                          <p className={`text-sm mb-6 line-clamp-2 ${isSelected ? 'text-black/60' : 'text-white/40'}`}>
                            {service.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-60">
                            <Clock className="w-3 h-3" /> {service.duration}
                          </div>
                        </div>
                        
                        {/* Decorative background for selected state */}
                        {isSelected && (
                          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10">
                            <Scissors className="w-32 h-32 rotate-12" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar / Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-6">
                  <div className="glass p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-6 uppercase italic tracking-tighter">Votre Sélection</h3>
                      
                      {selectedServices.length === 0 ? (
                        <div className="py-12 text-center space-y-4">
                          <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center mx-auto">
                            <Scissors className="w-5 h-5 text-white/20" />
                          </div>
                          <p className="text-white/30 text-xs font-mono uppercase tracking-widest">Aucun service sélectionné</p>
                        </div>
                      ) : (
                        <div className="space-y-4 mb-8">
                          {selectedServices.map(s => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={s.id} 
                              className="flex justify-between items-center group"
                            >
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => toggleService(s)}
                                  className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium">{s.name}</span>
                              </div>
                              <span className="text-sm font-mono text-white/50">{s.price} DA</span>
                            </motion.div>
                          ))}
                          {isHomeService && (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex justify-between items-center text-orange-500"
                            >
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => setIsHomeService(false)}
                                  className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-bold">Service à Domicile</span>
                              </div>
                              <span className="text-sm font-mono">+{HOME_SERVICE_FEE} DA</span>
                            </motion.div>
                          )}
                        </div>
                      )}

                      <div className="pt-6 border-t border-white/10 space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-mono uppercase text-white/40">Total à payer</span>
                          <span className="text-4xl font-black text-orange-500 tracking-tighter">{totalPrice} DA</span>
                        </div>
                        
                        <button
                          disabled={selectedServices.length === 0}
                          onClick={() => setStep('form')}
                          className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-2 group orange-glow"
                        >
                          Continuer
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social/Info Card */}
                  <div className="glass p-6 rounded-3xl flex items-center justify-between">
                    <div className="flex gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all">
                        <Facebook className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono uppercase text-white/30">Besoin d'aide?</p>
                      <p className="text-sm font-bold">0666045666</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto"
            >
              <button
                onClick={() => setStep('services')}
                className="mb-8 text-white/40 hover:text-white flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors"
              >
                <X className="w-4 h-4" /> Retour aux services
              </button>

              <div className="glass p-10 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <h3 className="text-4xl font-black mb-2 italic uppercase tracking-tighter">Confirmation</h3>
                  <p className="text-white/40 text-sm mb-10">Dernière étape pour valider votre créneau.</p>

                  <form onSubmit={handleBooking} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 ml-1">Votre Identité</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nom & Prénom"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 ml-1">Contact Direct</label>
                      <div className="relative group">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Numéro de téléphone"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>

                    {isHomeService && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                      >
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 ml-1">Lien de Localisation (Google Maps)</label>
                        <div className="relative group">
                          <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/40 group-focus-within:text-orange-500 transition-colors" />
                          <input
                            required
                            type="url"
                            value={locationLink}
                            onChange={(e) => setLocationLink(e.target.value)}
                            placeholder="Collez le lien Maps ici..."
                            className="w-full bg-orange-500/5 border border-orange-500/20 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-orange-500 focus:bg-orange-500/[0.08] transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-white/30 italic">Partagez votre position depuis Google Maps pour qu'Amir puisse vous trouver.</p>
                      </motion.div>
                    )}

                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs font-mono bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full py-6 bg-orange-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3 orange-glow"
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Réserver Maintenant
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-20"
            >
              <div className="relative inline-block mb-12">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto relative z-10">
                  <CheckCircle2 className="text-black w-16 h-16" />
                </div>
                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              </div>
              
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6">Réservation Envoyée</h2>
              <p className="text-white/50 text-lg leading-relaxed mb-12">
                Amir a reçu votre demande. Vous recevrez un appel ou un message de confirmation très prochainement.
              </p>
              
              <button
                onClick={() => {
                  setStep('services');
                  setSelectedServices([]);
                  setIsHomeService(false);
                  setName('');
                  setPhone('');
                  setLocationLink('');
                }}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-black uppercase text-xs tracking-[0.3em]"
              >
                Retour à l'accueil
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Location Section */}
      <section id="location" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-mono uppercase tracking-widest mb-6">
              <MapIcon className="w-3 h-3" />
              Où nous trouver
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-8">Le Salon QLF.</h2>
            <p className="text-lg text-white/50 mb-10 leading-relaxed">
              Venez nous rendre visite dans notre espace dédié au style et au bien-être. Un cadre moderne et chaleureux vous attend pour une expérience unique.
            </p>
            <div className="space-y-6">
              <a 
                href="https://maps.app.goo.gl/GARjU4kER1zsbdof9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 group/loc"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover/loc:bg-orange-500 group-hover/loc:text-black transition-all">
                  <MapPin className="text-orange-500 w-6 h-6 group-hover/loc:text-black" />
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover/loc:text-orange-500 transition-colors">Adresse</h4>
                  <p className="text-white/40 group-hover/loc:text-white transition-colors">Rue de Meskiana, 214 Logements, Khenchela, Algérie</p>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Téléphone</h4>
                  <p className="text-white/40">0666045666</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass p-4 rounded-[2.5rem] h-[500px] relative overflow-hidden group">
            <iframe 
              src={SHOP_LOCATION_IFRAME}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-[2rem] grayscale invert opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Scissors className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-black uppercase italic">QLF Barber</span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
            &copy; 2026 Designed for Excellence by QLF Agency
          </p>
          <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
