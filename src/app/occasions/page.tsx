'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Occasion type definition
type Occasion = {
  id: string;
  name: string;
  description: string;
  image: string;
  popular: boolean;
  season: string;
};

// Occasions data
const occasions: Occasion[] = [
  {
    id: 'wedding',
    name: 'Wedding Ceremonies',
    description: 'Celebrate the sacred union with exquisite gifts that honor tradition while embracing modern elegance. From personalized keepsakes to luxurious gift hampers.',
    image: '/assets/occasion-wedding.jpg',
    popular: true,
    season: 'All Year'
  },
  {
    id: 'anniversary',
    name: 'Anniversary Celebrations',
    description: 'Mark milestone moments with thoughtfully curated gifts that symbolize years of love and commitment. Perfect for silver, golden, and milestone anniversaries.',
    image: '/assets/occasion-anniversary.jpg',
    popular: true,
    season: 'All Year'
  },
  {
    id: 'diwali',
    name: 'Diwali Festivities',
    description: 'Illuminate the festival of lights with our opulent Diwali collection featuring handcrafted diyas, gourmet treats, and luxurious gift hampers.',
    image: '/assets/occasion-diwali.jpg',
    popular: true,
    season: 'October-November'
  },
  {
    id: 'corporate',
    name: 'Corporate Gifting',
    description: 'Make a lasting impression with sophisticated corporate gifts that convey appreciation and strengthen professional relationships.',
    image: '/assets/occasion-corporate.jpg',
    popular: true,
    season: 'All Year'
  },
  {
    id: 'rakshabandhan',
    name: 'Raksha Bandhan',
    description: 'Celebrate the special bond between siblings with our collection of premium rakhi sets, personalized gifts, and thoughtful hampers.',
    image: '/assets/occasion-rakhi.jpg',
    popular: false,
    season: 'July-August'
  },
  {
    id: 'birthday',
    name: 'Birthday Celebrations',
    description: 'Make their special day extraordinary with personalized birthday gifts that create memorable moments and showcase your thoughtfulness.',
    image: '/assets/occasion-birthday.jpg',
    popular: true,
    season: 'All Year'
  },
  {
    id: 'housewarming',
    name: 'Housewarming Gifting',
    description: 'Welcome friends and family to their new home with elegant housewarming gifts that bring warmth, prosperity, and positive energy.',
    image: '/assets/occasion-housewarming.jpg',
    popular: false,
    season: 'All Year'
  },
  {
    id: 'baby',
    name: 'Baby Showers & Naming Ceremonies',
    description: 'Celebrate new beginnings with thoughtful gifts for the little one and parents, featuring heirloom-quality keepsakes and luxury hampers.',
    image: '/assets/occasion-baby.jpg',
    popular: false,
    season: 'All Year'
  },
  {
    id: 'holi',
    name: 'Holi Celebrations',
    description: 'Embrace the festival of colors with our specially curated Holi gift collections featuring organic colors, gourmet treats, and festive accessories.',
    image: '/assets/occasion-holi.jpg',
    popular: false,
    season: 'February-March'
  },
  {
    id: 'retirement',
    name: 'Retirement Gifts',
    description: 'Honor years of dedication and service with meaningful retirement gifts that commemorate achievements and celebrate new beginnings.',
    image: '/assets/occasion-retirement.jpg',
    popular: false,
    season: 'All Year'
  }
];

// Featured occasions for the hero section
const featuredOccasions = occasions.filter(occasion => occasion.popular).slice(0, 4);

export default function OccasionsPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen pt-[90px]">
        {/* Hero Section */}
        <section className="relative bg-charcoal text-ivory py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-full h-full bg-gradient-to-r from-gold/30 to-blush/30"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
                Perfect Gifts for Every <span className="text-gold">Occasion</span>
              </h1>
              <p className="text-xl md:text-2xl text-ivory/80">
                Discover curated gift collections designed to celebrate life's special moments
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredOccasions.map((occasion, index) => (
                <motion.div
                  key={occasion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/occasions/${occasion.id}`} className="block">
                    <div className="relative h-64 overflow-hidden rounded-xl group">
                      <Image
                        src={occasion.image || "/assets/placeholder.jpg"}
                        alt={occasion.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-xl font-bold text-white font-playfair group-hover:text-gold transition-colors">
                          {occasion.name}
                        </h3>
                        <p className="text-white/80 text-sm mt-1">
                          Explore Collection
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* All Occasions */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-4">
                Browse All <span className="text-gold">Occasions</span>
              </h2>
              <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
                No matter the celebration, we have thoughtfully curated gift collections to make every moment special
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {occasions.map((occasion, index) => (
                <motion.div
                  key={occasion.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={occasion.image || "/assets/placeholder.jpg"}
                      alt={occasion.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {occasion.season !== 'All Year' && (
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-charcoal text-xs font-medium px-3 py-1 rounded-full">
                        {occasion.season}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-playfair font-bold text-charcoal mb-3 group-hover:text-gold transition-colors">
                      {occasion.name}
                    </h3>
                    <p className="text-charcoal/70 text-sm mb-4">
                      {occasion.description}
                    </p>
                    <Link
                      href={`/occasions/${occasion.id}`}
                      className="inline-flex items-center text-gold font-medium hover:text-gold/80 transition-colors"
                    >
                      View Collection
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Personalized Gifts */}
        <section className="py-16 bg-charcoal/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-6">
                  Looking for Something <span className="text-gold">Truly Special</span>?
                </h2>
                <p className="text-lg text-charcoal/70 mb-8">
                  Our personalized gifting service allows you to create bespoke gifts for any occasion. Work with our dedicated gift concierge to design a unique gift experience that perfectly captures your sentiment.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Custom engravings and monograms",
                    "Personalized gift hampers tailored to recipient preferences",
                    "Bespoke packaging with handwritten notes",
                    "Customized delivery experiences"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-charcoal/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/concierge"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold/90 transition-all duration-300"
                >
                  Speak to Our Gift Concierge
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-xl overflow-hidden">
                  <Image
                    src="/assets/personalized-gift.jpg"
                    alt="Personalized Gifting Experience"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl max-w-xs">
                      <p className="text-charcoal italic font-medium mb-4">
                        "The personalized anniversary gift was beyond our expectations. Every detail was thoughtfully considered."
                      </p>
                      <p className="text-charcoal/80 text-sm">
                        — Priya & Arjun, Delhi
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blush/20 -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-gold/20 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Upcoming Occasions */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-4">
                Upcoming <span className="text-gold">Occasions</span>
              </h2>
              <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
                Plan ahead for these special occasions with our curated gift collections
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Diwali Celebrations",
                  date: "November 12, 2023",
                  image: "/assets/occasion-diwali.jpg",
                  link: "/occasions/diwali"
                },
                {
                  name: "Anniversary Gifting",
                  date: "Plan in Advance",
                  image: "/assets/occasion-anniversary.jpg",
                  link: "/occasions/anniversary"
                },
                {
                  name: "Corporate Gifts",
                  date: "Year-End Appreciation",
                  image: "/assets/occasion-corporate.jpg",
                  link: "/occasions/corporate"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <Link href={item.link} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || "/assets/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 text-blush text-sm font-medium">
                        {item.date}
                      </div>
                      <h3 className="text-xl font-playfair font-bold text-charcoal mb-2 group-hover:text-gold transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center text-gold">
                        <span className="text-sm font-medium">Explore collection</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Request */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gold/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-6">
                  Can't Find Your Occasion?
                </h2>
                <p className="text-lg text-charcoal/80 mb-8">
                  We create bespoke gift experiences for any occasion. Contact our gift concierge to discuss your unique requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-charcoal text-ivory font-medium rounded-md hover:bg-charcoal/90 transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/concierge"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold/90 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.183.091" />
                    </svg>
                    AI Concierge
                  </Link>
                </div>
              </div>
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/20 z-0"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold/10 z-0"></div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 