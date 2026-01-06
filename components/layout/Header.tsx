import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F3]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-brown-900">
              BLANC.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {["홈", "기능 소개", "트렌디 디자인", "문의하기"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-brown-900/80 hover:text-coral-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-brown-900 font-medium">
              로그인
            </Button>
            <Button>
              청첩장 만들기
            </Button>
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="md:hidden flex items-center">
             <button className="text-brown-900 p-2">
                <span className="sr-only">Open menu</span>
                {/* Simple Hamburger Icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
