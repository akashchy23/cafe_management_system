import { FaCoffee } from 'react-icons/fa'

export default function About() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-xl text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-[#EBE3D7] shadow-lg shadow-amber-950/5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-4 shadow-inner ring-1 ring-amber-200">
          <FaCoffee className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#3B2314] tracking-tight mb-3">
          About Us
        </h1>
        <p className="text-sm text-[#6F5D53] leading-relaxed">
          The Cafe Management System is designed to provide seamless operations, order tracking, and intuitive management for modern cafes and specialty coffee shops.
        </p>
      </div>
    </div>
  )
}