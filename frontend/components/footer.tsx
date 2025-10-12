// frontend/components/footer.tsx
"use client"

import Image from "next/image"

export function AppFooter() {
  return (
    <footer className="bg-[#242329] border-t border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Image 
              src="/capireiq_logo_footer.jpeg" 
              alt="capire iQ Logo" 
              width={100} 
              height={100} 
              className="h-16 p-1 w-auto transition-transform hover:scale-105"
              priority
            />
          </div>
          <div className="text-center md:text-right space-y-2">
            <p className="text-sm text-stone-100">
              © {new Date().getFullYear()} Capire IQ. Built for learners, by learners.
            </p>
            <p className="text-xs text-stone-400">
              The effort to learn is never wasted.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}