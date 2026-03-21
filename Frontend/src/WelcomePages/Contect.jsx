import React, { useState } from 'react';
import FooterPage from "./FooterPage";
import NavBarpage from "./NavBarpage";

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Format message for WhatsApp
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

        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Replace with your WhatsApp number (include country code without +)
        const whatsappNumber = '916396949336'; // Example: 91 for India

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        setIsLoading(false);

        // Optional: Reset form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email Us',
            description: 'Send us an email anytime',
            value: 'raadhyammusicals@gmail.com',
            link: 'mailto:raadhyammusicals@gmail.com'
        },
        {
            icon: '📱',
            title: 'WhatsApp',
            description: 'Chat with us instantly',
            value: '+91 84103 37618',
            link: 'https://wa.me/918410337618'
        },
        {
            icon: '📍',
            title: 'Visit Us',
            description: 'Come say hello at our studio',
            value: 'Ashiyana PT.Deen Shop no.04 Sector 7 Dayal Upadhyay Puram Agra Uttar Pradesh 282007',
            link: 'https://maps.app.goo.gl/b6rT2WkwkLrQJiis8'
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating musical notes - Reduced for mobile */}
                <div className="hidden sm:block absolute top-1/4 left-1/4 animate-float text-yellow-300 text-xl sm:text-2xl">♪</div>
                <div className="hidden sm:block absolute top-1/3 right-1/4 animate-float-delayed text-pink-300 text-2xl sm:text-3xl">♫</div>
                <div className="hidden sm:block absolute bottom-1/4 left-1/3 animate-float-slow text-green-300 text-xl sm:text-2xl">♬</div>
                <div className="hidden sm:block absolute top-1/2 right-1/3 animate-float-delayed-slow text-blue-300 text-2xl sm:text-3xl">♪</div>

                {/* Smaller floating notes for mobile */}
                <div className="sm:hidden absolute top-1/6 left-1/6 animate-float text-yellow-300 text-lg">♪</div>
                <div className="sm:hidden absolute bottom-1/6 right-1/6 animate-float-delayed text-pink-300 text-lg">♫</div>

                {/* Instrument silhouettes - Smaller on mobile */}
                <div className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 opacity-5 sm:opacity-10">
                    <div className="text-6xl sm:text-8xl">🎸</div>
                </div>
                <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 opacity-5 sm:opacity-10">
                    <div className="text-6xl sm:text-8xl">🎹</div>
                </div>
                <div className="absolute bottom-10 right-10 opacity-5">
                    <div className="text-6xl">🥁</div>
                </div>
            </div>

            {/* Navigation */}
            <div className="relative z-20">
                <NavBarpage />
            </div>

            {/* Main Content - Flex grow to push footer down */}
            <div className="flex-grow relative z-10">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
                    {/* Header Section */}
                    <div className="text-center mb-8 sm:mb-12 md:mb-16 mt-15 sm:mt-8">
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 md:p-4 rounded-full">
                                <img src="/Logo.png" alt="Raadhyam Logo" className="h-10 sm:h-12 md:h-16" />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-3 sm:mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-2xl mx-auto px-2">
                            Let's create beautiful music together. Reach out to us for any inquiries, collaborations, or just to say hello!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl xl:max-w-7xl mx-auto">
                        {/* Contact Information */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                    <span className="text-purple-300">💬</span>
                                    Let's Talk Music
                                </h2>
                                <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-6 sm:mb-8">
                                    Whether you're looking for music lessons, instrument rentals, or want to collaborate on a project, we're here to help you on your musical journey.
                                </p>

                                {/* Contact Methods */}
                                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                    {contactMethods.map((method, index) => (
                                        <a
                                            key={index}
                                            href={method.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                                        >
                                            <div className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                {method.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-semibold text-base sm:text-lg group-hover:text-purple-300 transition-colors truncate">
                                                    {method.title}
                                                </h3>
                                                <p className="text-gray-400 text-xs sm:text-sm mb-1">{method.description}</p>
                                                <p className="text-purple-300 font-medium text-sm sm:text-base truncate">{method.value}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                                    <div className="text-xl sm:text-2xl text-purple-300 mb-1 sm:mb-2">🎵</div>
                                    <div className="text-white font-bold text-lg sm:text-xl">500+</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">Students</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                                    <div className="text-xl sm:text-2xl text-pink-300 mb-1 sm:mb-2">🎸</div>
                                    <div className="text-white font-bold text-lg sm:text-xl">50+</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">Instruments</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                                    <div className="text-xl sm:text-2xl text-blue-300 mb-1 sm:mb-2">🎹</div>
                                    <div className="text-white font-bold text-lg sm:text-xl">10+</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">Teachers</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                                    <div className="text-xl sm:text-2xl text-green-300 mb-1 sm:mb-2">⭐</div>
                                    <div className="text-white font-bold text-lg sm:text-xl">5.0</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
                                <span className="text-purple-300">📝</span>
                                Send us a Message
                            </h2>
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
                                Fill out the form below and we'll get back to you via WhatsApp within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    {/* Name Field */}
                                    <div className="group">
                                        <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
                                            <span className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-purple-300 text-sm">👤</span>
                                                Full Name *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="group">
                                        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
                                            <span className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-purple-300 text-sm">✉️</span>
                                                Email Address *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    {/* Phone Field */}
                                    <div className="group">
                                        <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
                                            <span className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-purple-300 text-sm">📱</span>
                                                Phone Number
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10"
                                            placeholder="Your phone number"
                                        />
                                    </div>

                                    {/* Subject Field */}
                                    <div className="group">
                                        <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
                                            <span className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-purple-300 text-sm">🎯</span>
                                                Subject *
                                            </span>
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base  border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-gray-400 placeholder-gray-400 backdrop-blur-sm hover:bg-white/10"
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

                                {/* Message Field */}
                                <div className="group">
                                    <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 group-hover:text-white transition-colors">
                                        <span className="flex items-center gap-1 sm:gap-2">
                                            <span className="text-purple-300 text-sm">💭</span>
                                            Your Message *
                                        </span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 resize-none"
                                        placeholder="Tell us about your musical needs, questions, or how we can help you..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 disabled:cursor-not-allowed transition duration-300 font-medium transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl group text-sm sm:text-base md:text-lg"
                                >
                                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending to WhatsApp...
                                            </>
                                        ) : (
                                            <>
                                                <span className="group-hover:animate-bounce text-base sm:text-xl">💬</span>
                                                Send via WhatsApp
                                                <span className="group-hover:animate-bounce text-base sm:text-xl">🎵</span>
                                            </>
                                        )}
                                    </span>
                                </button>

                                <p className="text-gray-400 text-xs sm:text-sm text-center px-2">
                                    By submitting this form, you'll be redirected to WhatsApp to send your message directly to our team.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Will stick to bottom */}
            <div className="relative z-10">
                <FooterPage />
            </div>

            {/* Add custom animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(-180deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-5px) scale(1.05); }
                }
                @keyframes float-delayed-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(90deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 10s ease-in-out infinite;
                }
                .animate-float-delayed-slow {
                    animation: float-delayed-slow 12s ease-in-out infinite;
                }
                
                /* Mobile-first responsive design */
                @media (max-width: 640px) {
                    .animate-float,
                    .animate-float-delayed,
                    .animate-float-slow,
                    .animate-float-delayed-slow {
                        animation-duration: 8s;
                    }
                }
            `}</style>
        </div>
    );
};

export default ContactPage;