import React from 'react';
import { Link } from "react-router-dom";

import {
    Music,
    Users,
    Target,
    Eye,
    Heart,
    GraduationCap,
    Award,
    Clock,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    BookOpen,
    Mic,
    Star,
    Map
} from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

const AboutUs = () => {
    const teamMembers = [
        {
            name: "Priya Sharma",
            role: "Founder & Head Instructor",
            bio: "Classically trained pianist with 15+ years of teaching experience. Master's in Music Education from Berklee College of Music. Specializes in Western classical and contemporary piano. Has trained over 300 students in piano and music theory.",
            image: "/Instructor2.jpg",
            expertise: ["Piano", "Music Theory", "Composition", "Western Classical"],
            achievements: ["Grade 8 Trinity College London", "Berklee College Alumni", "15+ Years Experience"]
        },
        {
            name: "Anand Rathore",
            role: "Music Teacher & Classical Vocal Specialist",
            bio: "Experienced music educator with strong command over Indian classical vocal music, rhythm, and theory. Skilled in teaching and explaining musical concepts with clarity. Worked in multiple reputed schools across Agra and Mathura.",
            image: "/Instructor1.jpg", // No image provided in resume
            expertise: [
                "Classical Vocal (Indian Classical Music)",
                "Swar & Taal",
                "Harmonium",
                "Synthesizer",
                "Tabla",
                "Music Theory"
            ],
            achievements: [
                "1-year teaching experience at Prayag Emerald Junior High School, Agra",
                "1-year teaching experience at Gayatri Tapobhoomi, Mathura",
                "1-year teaching experience at St. Andrews School, Agra",
                "1-year teaching experience at Milton Public School, Agra",
                "Prabhakar from Prayagraj Sangeet Samiti, Allahabad",
                "M.A in Music from Jivaji University (2025)"
            ]
        }

    ];

    const values = [
        {
            icon: Heart,
            title: "Passion for Music",
            description: "We believe that genuine love for music is the foundation of great musical education and performance."
        },
        {
            icon: Users,
            title: "Student-Centered",
            description: "Every student is unique. We tailor our teaching methods to individual learning styles and goals."
        },
        {
            icon: GraduationCap,
            title: "Excellence",
            description: "We maintain the highest standards in teaching, curriculum, and student support services."
        },
        {
            icon: BookOpen,
            title: "Comprehensive Learning",
            description: "From basic notes to advanced compositions, we cover music theory and practical skills."
        },
        {
            icon: Mic,
            title: "Performance Focused",
            description: "Regular recitals and concerts to build confidence and stage presence in students."
        },
        {
            icon: Star,
            title: "Innovative Methods",
            description: "Blending traditional teaching with modern technology and contemporary music trends."
        }
    ];

    const stats = [
        { number: "500+", label: "Students Trained", icon: Users },
        { number: "15+", label: "Expert Instructors", icon: GraduationCap },
        { number: "25+", label: "Instruments", icon: Music },
        { number: "10+", label: "Years Experience", icon: Calendar },
        { number: "45+", label: "Annual Concerts", icon: Mic },
        { number: "98%", label: "Success Rate", icon: CheckCircle }
    ];

    const facilities = [
        {
            title: "Soundproof Practice Rooms",
            description: "8 fully equipped soundproof rooms for individual and group practice sessions",
            image: "https://images.unsplash.com/photo-1651339764881-54e8338b185b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWMlMjByb29tc3xlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            title: "Recording Studio",
            description: "Professional recording setup for students to record their progress and compositions",
            image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        },
        {
            title: "Instrument Library",
            description: "Well-maintained collection of instruments available for student practice",
            image: "https://plus.unsplash.com/premium_photo-1682125896993-12a1758b6cb3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlicmFyeSUyMG11c2ljfGVufDB8fDB8fHww"
        },
        {
            title: "Performance Hall",
            description: "100-seat auditorium for regular student performances and recitals",
            image: "https://images.unsplash.com/photo-1597071692394-6661037e14ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fG11c2ljJTIwc3RhZ2V8ZW58MHx8MHx8fDA%3D"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBarpage />

            {/* Hero Section */}
            <section className="bg-gradient-to-r mt-5 from-red-600 to-red-800 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-100">
                    <div className="absolute top-10 left-10 text-6xl">🎸</div>
                    <div className="absolute bottom-10 right-10 text-6xl">🎹</div>
                    <div className="absolute bottom-30 left-10 text-6xl">🎹</div>
                    <div className="absolute top-1/4 right-1/8 text-5xl">🎺</div>
                    <div className="absolute top-1/2 right-1/3 text-5xl">🎺</div>
                    <div className="absolute bottom-1/2 left-1/4 text-5xl">🥁</div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <p>
                                Currently Accepting New Students for {new Date().getFullYear()}
                            </p>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Raadhyam</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Discover our journey, mission, and the passion that drives us to nurture musical talent.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/Contact-Us">
                            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300">
                                Get Enquiry
                            </button>
                            </Link>

                            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Current Status Banner */}
            <section className="bg-yellow-50 border-l-4 border-yellow-400 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                            <span className="font-semibold text-gray-800">Institute Currently Open</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Mon-Sat: 9 AM - 9 PM
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Sunday: 9 AM - 6 PM
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                +91 xxxxx xxxxx
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-6 bg-red-50 rounded-2xl hover:transform hover:-translate-y-2 transition duration-300">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="text-red-600 w-6 h-6" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                                    alt="Our Music Studio"
                                    className="rounded-2xl shadow-2xl w-full"
                                />
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
                                <div className="absolute -top-6 -left-6 w-20 h-20 bg-red-300 rounded-full opacity-30"></div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story & Journey</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Raadhyam Musical Classes was founded in 2012 with a simple mission: to make quality music education
                                accessible to everyone. What started as a small studio with just two instructors has now grown into
                                a premier music institution with multiple locations and a thriving online community of over 500 students.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Our name "Raadhyam" comes from the Sanskrit word for "pleasing to the heart," which reflects our
                                philosophy that music should come from the heart and bring joy to both the performer and the listener.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                Over the years, we've expanded our curriculum to include 25+ instruments, launched online classes,
                                and established annual music festivals that showcase our students' talents.
                            </p>
                            <div className="flex items-center space-x-4 text-red-600">
                                <Award className="w-6 h-6" />
                                <span className="font-semibold">Award-winning music education institution (Best Music School 2023)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instruments We Teach */}
{/* Instruments We Teach */}
<section className="py-16 bg-red-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Instruments We Teach</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive training in 25+ instruments across various musical traditions
            </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
                {
                    name: "Piano",
                    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGlhbm98ZW58MHx8MHx8fDA%3D"
                },
                {
                    name: "Guitar",
                    image: "https://plus.unsplash.com/premium_photo-1693169973609-342539dea9dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3VpdGFyfGVufDB8fDB8fHww"
                },
                {
                    name: "Tabla",
                    image: "https://images.unsplash.com/photo-1633411988188-6e63354a9019?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGFibGF8ZW58MHx8MHx8fDA%3D"
                },
                {
                    name: "Flute",
                    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmx1dGV8ZW58MHx8MHx8fDA%3D"
                },
                {
                    name: "Sitar",
                    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2l0YXJ8ZW58MHx8MHx8fDA%3D"
                },
                {
                    name: "Drums",
                    image: "https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHJ1bXN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    name: "Harmonium",
                    image: "https://media.istockphoto.com/id/1367529261/photo/indian-classical-music.webp?a=1&b=1&s=612x612&w=0&k=20&c=CoYsfAPCP0e5nsv7-J5efD6nZu4bUFwhwZH42-TgJ1k="
                },

                {
                    name: "Vocals",
                    image: "https://images.unsplash.com/photo-1615748562188-07be820cff5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dm9jYWxzfGVufDB8fDB8fHww"
                },
                {
                    name: "Keyboard",
                    image: "https://images.unsplash.com/photo-1614978498256-94ec73df1015?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2V5Ym9hcmRzJTIwbXVzaWN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    name: "Dholak",
                    image: "https://media.istockphoto.com/id/2195962108/photo/indian-traditional-drums-close-up.jpg?s=612x612&w=0&k=20&c=jqVw-ICQsZDN7z_EjPh6Aj0tlKmGhMEz6GJeI0NB2r8="
                },

            ].map((instrument, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                >
                    <div className="h-32 overflow-hidden">
                        <img
                            src={instrument.image}
                            alt={instrument.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                    </div>
                    <div className="p-4 text-center">
                        <span className="text-gray-800 font-medium text-sm md:text-base">{instrument.name}</span>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">...and many more! Contact us for instruments not listed here.</p>
            <Link to="/Contact-Us">
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300">
                    Inquire About Other Instruments
                </button>
            </Link>
        </div>
    </div>
</section>

            {/* Facilities Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Facilities</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            State-of-the-art infrastructure designed for optimal learning experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {facilities.map((facility, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={facility.image}
                                        alt={facility.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{facility.title}</h3>
                                    <p className="text-gray-600">{facility.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 bg-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We believe that everyone has musical potential waiting to be discovered
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Target className="text-red-600 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                            <p className="text-gray-600 mb-4">
                                To provide exceptional music education that nurtures creativity, builds confidence, and fosters
                                a lifelong love for music in students of all ages and skill levels through personalized attention
                                and comprehensive curriculum.
                            </p>
                            <p className="text-gray-600">
                                We strive to create a supportive environment where students can explore their musical interests
                                and develop their unique artistic voice while maintaining the highest standards of musical excellence.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Eye className="text-red-600 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                            <p className="text-gray-600 mb-4">
                                To become the leading music education institution recognized for excellence in teaching,
                                innovation in curriculum, and commitment to student success across India.
                            </p>
                            <p className="text-gray-600">
                                We envision a world where music education is accessible to all and where every individual
                                can experience the transformative power of music, creating a more harmonious society through
                                the universal language of music.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values & Philosophy</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            The principles that guide everything we do at Raadhyam
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-red-50 p-6 rounded-2xl hover:transform hover:-translate-y-2 transition duration-300">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <value.icon className="text-red-600 w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{value.title}</h3>
                                <p className="text-gray-600 text-center">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Founders</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            The passionate musicians behind Raadhyam
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Circular Image */}
                                <div className="w-60 h-60 rounded-full overflow-hidden shadow-md mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-[center_30%]"
                                    />
                                </div>


                                {/* Name + Role */}
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                <p className="text-red-600 font-semibold mb-4">{member.role}</p>


                                {/* Bio */}
                                <p className="text-gray-600 mb-6 max-w-md">{member.bio}</p>


                                {/* Expertise */}
                                <div className="mb-6 w-full">
                                    <h4 className="font-semibold text-gray-800 mb-2">Areas of Expertise:</h4>
                                    <div className="flex justify-center flex-wrap gap-2">
                                        {member.expertise.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>


                                {/* Achievements */}
                                <div className="w-full">
                                    <h4 className="font-semibold text-gray-800 mb-2">Key Achievements:</h4>
                                    <ul className="text-gray-600 text-sm space-y-1">
                                        {member.achievements.map((achievement, idx) => (
                                            <li key={idx} className="flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </section>

            {/* Location & Map Section */}
            <section className="py-16 bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Visit Our Campus</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 text-red-600 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Main Campus</h3>
                                        <p className="text-gray-600">
                                            Raadhyam Music Institute<br />
                                            Ashiyana PT. Deen, Shop no.04, <br />
                                            Sector 7, Dayal Upadhyay Puram, <br />
                                            Agra, Uttar Pradesh 282007
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Phone className="w-6 h-6 text-red-600 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact</h3>
                                        <p className="text-gray-600">
                                            +91 84103 37618<br />
                                            +91 94123 18590
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Mail className="w-6 h-6 text-red-600 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                                        <p className="text-gray-600">
                                            raadhyammusicals@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Clock className="w-6 h-6 text-red-600 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Operating Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Saturday: 9:00 AM - 9:00 PM<br />
                                            Sunday: 9:00 AM - 6:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="bg-gray-200 rounded-2xl overflow-hidden h-96">
                            {/* Google Map Embed */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.666687052142!2d77.95964401102849!3d27.198210876379967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747702598cee49%3A0x8c378565a19b33c5!2sRaadhyam%20Music%20Academy!5e0!3m2!1sen!2sin!4v1763693224614!5m2!1sen!2sin"
                                style={{ border: 0 }}
                                className="w-full h-full"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Raadhyam Music Institute Location"
                            >
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
                    <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                        Join over 500 students who have discovered their musical potential with Raadhyam.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <Link to="/Contact-Us">
                        <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300">
                            Get Enquiry
                        </button>
                        </Link>


                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300">
                            Download Brochure
                        </button>
                    </div>
                    <p className="text-red-200 mt-6">
                        Limited spots available for {new Date().getFullYear()} batch. Enroll now!
                    </p>
                </div>
            </section>

            <FooterPage />
        </div>
    );
};

export default AboutUs;