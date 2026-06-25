import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CTASection } from '@/components/landing/CTASection';
import { Database } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1E1E2E] py-8 bg-[#0A0A0F]">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#71717A] hover:text-white transition-colors">
          <Database className="w-4 h-4 text-[#7C3AED]" />
          QueryCraft AI · © {new Date().getFullYear()}
        </Link>
        <p className="text-xs text-[#52525B]">
          Built with Next.js 14 · OpenRouter · PostgreSQL · MongoDB
        </p>
      </div>
    </footer>
  );
}