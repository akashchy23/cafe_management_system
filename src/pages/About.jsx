import { FaCoffee, FaHeart, FaAward, FaUsers } from 'react-icons/fa'

export default function About() {
  const highlights = [
    {
      icon: FaCoffee,
      title: 'Artisanal Coffee',
      desc: 'Carefully sourced single-origin beans roasted to perfection daily.',
    },
    {
      icon: FaAward,
      title: 'Quality First',
      desc: 'Crafted with premium ingredients and unmatched attention to detail.',
    },
    {
      icon: FaUsers,
      title: 'Community Driven',
      desc: 'A warm and welcoming space designed for coffee lovers and friends.',
    },
    {
      icon: FaHeart,
      title: 'Made with Passion',
      desc: 'Every cup is prepared with love and expertise by our master baristas.',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-5 shadow-inner ring-1 ring-amber-200">
            <FaCoffee className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3B2314] tracking-tight">
            About Our Cafe
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#7A695E] max-w-2xl mx-auto leading-relaxed">
            Welcome to Cafe Management System — combining our love for exceptional coffee with seamless management solutions.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {highlights.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#EBE3D7] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-[#6F4E37] flex items-center justify-center shrink-0 shadow-inner">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#3B2314] mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#7A695E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mission Statement */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#EBE3D7] shadow-xl shadow-amber-950/5 p-8 sm:p-10 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#3B2314] mb-3">
            Our Mission & Vision
          </h3>
          <p className="text-[#6F5D53] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our mission is to create delightful coffee experiences powered by modern, reliable, and user-friendly technology. Whether you&apos;re managing table orders, inventory, or simply enjoying your morning espresso, we strive for excellence in every detail.
          </p>
        </div>
      </div>
    </div>
  )
}