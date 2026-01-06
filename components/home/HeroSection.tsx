import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "./PhoneMockup";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-[#FDF8F3] overflow-hidden pt-20">
      {/* Background Decor Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-coral-500/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-coral-400/10 rounded-full blur-3xl" />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center relative z-10 pt-10 lg:pt-0">
        
        {/* Left: Text Content */}
        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left mb-16 lg:mb-0">
          <div className="space-y-4">
            <h2 className="text-coral-600 font-medium tracking-wide uppercase text-sm sm:text-base">
              Premium Mobile Invitations
            </h2>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-brown-900 leading-[1.1]">
              당신의 러브 스토리,<br />
              <span className="italic relative inline-block">
                아름다운
                {/* Underline deco */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-coral-400/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{" "}
              디지털 페이지로.
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed pt-4">
              소중한 날을 위한 가장 특별한 초대.<br className="hidden sm:block" />
              감성적인 디자인과 편리한 기능으로 시작해보세요.
            </p>
          </div>
          
          <div className="pt-4">
             <Button size="lg" className="text-lg px-10 py-7 shadow-xl shadow-coral-500/20 hover:scale-105 transition-transform duration-300">
               나만의 청첩장 만들기
             </Button>
          </div>
        </div>

        {/* Right: Phone Mockups */}
        <div className="w-full lg:w-1/2 relative h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
          
          {/* Decorative Circle behind phones */}
          <div className="absolute top-1/2 left-1/2 lg:left-2/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFEFE5] rounded-full -z-10" />

          {/* Phone 1 (Back) */}
          <div className="absolute left-1/2 lg:left-auto lg:right-[180px] top-10 lg:top-0 -translate-x-2/3 lg:translate-x-0 rotate-[-12deg] scale-90 opacity-90 z-0 transition-transform hover:z-20 hover:scale-100 hover:rotate-0 duration-500">
             <PhoneMockup 
                imageSrc="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop"
                name="Ji-woo & Min-jun"
                date="Oct 12, 2025"
             />
          </div>

          {/* Phone 2 (Front) */}
          <div className="absolute left-1/2 lg:left-auto lg:right-[40px] top-10 lg:top-20 -translate-x-1/3 lg:translate-x-0 rotate-[8deg] z-10 shadow-2xl transition-transform hover:scale-105 duration-500">
             <PhoneMockup 
                imageSrc="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop"
                name="Sarah & Michael"
                date="Oct 26, 2026"
             />
          </div>
        </div>
      </div>

      {/* Bottom Curve Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(140%+1.3px)] h-[150px] fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}