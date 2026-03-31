import React, { useState } from 'react';
import {
    Mail,
    MapPin,
    MessageCircle,
    Music,
    Send,
} from 'lucide-react';
import FooterPage from './FooterPage';
import NavBarpage from './NavBarpage';
import heroBg from '../assets/hero-bg.jpg';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const whatsappMessage = `
*New Contact Message from Raadhyam Website*
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Subject:* ${formData.subject}
*Message:*
${formData.message}
*Sent via Raadhyam Contact Form*
        `.trim();
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappNumber = '916396949336';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        setIsLoading(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Us',
            description: 'Send us an email anytime',
            value: 'raadhyammusicals@gmail.com',
            link: 'mailto:raadhyammusicals@gmail.com'
        },
        {
            icon: MessageCircle,
            title: 'WhatsApp',
            description: 'Chat with us instantly',
            value: '+91 84103 37618',
            link: 'https://wa.me/918410337618'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            description: 'Come say hello at our studio',
            value: 'Ashiyana PT.Deen Shop no.04 Sector 7 Dayal Upadhyay Puram Agra UP 282007',
            link: 'https://maps.app.goo.gl/b6rT2WkwkLrQJiis8'
        },
    ];

    return (
        <div className="overflow-x-hidden bg-slate-50 min-h-screen">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&display=swap');

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(26px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.35); }
                    50% { box-shadow: 0 0 34px rgba(217, 119, 6, 0.62); }
                }

                .animate-fade-up { animation: fadeUp 0.8s ease-out both; }
                .animate-fade-up-delay-1 { animation: fadeUp 0.8s ease-out 0.1s both; }
                .animate-fade-up-delay-2 { animation: fadeUp 0.8s ease-out 0.2s both; }
                .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }

                .text-gold-gradient {
                    background: linear-gradient(90deg, #F59E0B, #D97706, #B45309);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .gold-gradient {
                    background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #D97706 100%);
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(217, 119, 6, 0.22);
                    transition: all 0.3s ease;
                }

                .glass-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(217, 119, 6, 0.5);
                    box-shadow: 0 22px 48px rgba(15, 23, 42, 0.14);
                }

                h1, h2, h3 {
                    font-family: 'Playfair Display', Georgia, serif;
                }
            `}</style>

            <NavBarpage />

            <section className="relative min-h-[74vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
                <img src={heroBg} alt="Raadhyam contact hero" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/72 to-slate-950/88" />

                <div className="relative z-10 max-w-4xl px-4 text-center">
                    <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-amber-600/35 bg-amber-600/10 px-4 py-2 text-sm font-semibold text-amber-300">
                        <Music className="h-4 w-4" /> Contact Raadhyam
                    </span>

                    <h1 className="animate-fade-up-delay-1 mt-6 text-4xl font-bold leading-tight text-slate-100 sm:text-5xl md:text-6xl">
                        Let&apos;s Build Your
                        <br />
                        <span className="text-gold-gradient">Musical Journey</span>
                    </h1>

                    <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300/85 sm:text-lg">
                        Questions, admissions, trial classes, or collaboration ideas. Reach out and our team will get back within 24 hours.
                    </p>

                    <div className="animate-fade-up-delay-2 mt-9 flex flex-wrap justify-center gap-3">
                        <a
                            href="mailto:raadhyammusicals@gmail.com"
                            className="inline-flex items-center gap-2 rounded-full border border-amber-600/45 bg-white/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-600/20"
                        >
                            <Mail className="h-4 w-4" /> raadhyammusicals@gmail.com
                        </a>
                        <a
                            href="https://wa.me/918410337618"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-amber-600/45 bg-white/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-600/20"
                        >
                            <MessageCircle className="h-4 w-4" /> WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            <main className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-5">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="glass-card rounded-3xl p-6 sm:p-8">
                                <span className="inline-flex items-center gap-2 rounded-full border border-amber-600/25 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
                                    Quick Connect
                                </span>
                                <h2 className="mt-4 text-3xl font-bold text-slate-900">Talk to Our Team</h2>
                                <p className="mt-3 text-slate-600">
                                    From beginner classes to advanced training, we guide each learner with a structured and friendly approach.
                                </p>

                                <div className="mt-6 space-y-3">
                                    {contactMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <a
                                                key={method.title}
                                                href={method.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex gap-4 rounded-2xl border border-amber-600/20 bg-white/70 p-4 transition hover:border-amber-600/55 hover:bg-white"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-600 group-hover:text-white">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-base font-semibold text-slate-900">{method.title}</p>
                                                    <p className="text-sm text-slate-500">{method.description}</p>
                                                    <p className="mt-1 break-words text-sm font-semibold text-amber-700">{method.value}</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl p-6 sm:p-8">
                                <h3 className="text-2xl font-bold text-slate-900">Visit Our Studio</h3>
                                <p className="mt-2 text-slate-600">Ashiyana PT.Deen Shop no.04 Sector 7 Dayal Upadhyay Puram Agra UP 282007</p>
                                <a
                                    href="https://maps.app.goo.gl/b6rT2WkwkLrQJiis8"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 transition hover:text-amber-800"
                                >
                                    <MapPin className="h-4 w-4" /> Open in Google Maps
                                </a>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-6 sm:p-8 lg:col-span-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-600/25 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
                                Send Message
                            </span>
                            <h2 className="mt-4 text-3xl font-bold text-slate-900">Share Your Requirement</h2>
                            <p className="mt-3 text-slate-600">
                                Submit this form and you will be redirected to WhatsApp with your message pre-filled.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Your phone number"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Subject *</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
                                        >
                                            <option value="">Select Enquiry Type</option>
                                            <option value="music-lessons">Music Lessons</option>
                                            <option value="instrument-rental">Instrument Rental</option>
                                            <option value="product-purchase">Product Purchase</option>
                                            <option value="event-booking">Event / Performance Booking</option>
                                            <option value="collaboration">Collaboration</option>
                                            <option value="custom-course">Custom Course Request</option>
                                            <option value="trial-class">Free Trial / Demo Class</option>
                                            <option value="pricing">Pricing & Packages</option>
                                            <option value="support">General Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Your Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Tell us about your goals, questions, and preferred class format."
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="gold-gradient animate-pulse-glow inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-slate-900 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                                            Sending to WhatsApp...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" /> Send via WhatsApp
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs leading-relaxed text-slate-500">
                                    After submit, WhatsApp opens with your message so you can review and send directly.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <FooterPage />
        </div>
    );
};

export default ContactPage;