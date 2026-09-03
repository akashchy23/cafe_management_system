import { FaCoffee } from 'react-icons/fa'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-6 shadow-inner ring-1 ring-amber-200">
          <FaCoffee className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#3B2314] tracking-tight">
          Welcome to Cafe
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#7A695E] font-medium">
          Management System
        </p>
      </div>
    </div>
  )
}