import { Smartphone, ClipboardCheck, Globe } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "감성적인 디자인 & 소장",
    description: "Digital & Tangible",
  },
  {
    icon: ClipboardCheck,
    title: "스마트한 RSVP 관리",
    description: "Smart RSVP",
  },
  {
    icon: Globe,
    title: "어디서든 간편한 공유",
    description: "Global Reach",
  },
];

export function FeatureCards() {
  return (
    <section className="bg-white pb-20 pt-10 px-4 sm:px-6 lg:px-8 relative z-10 -mt-10 sm:-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(255,142,118,0.15)] transition-shadow duration-300 flex items-center space-x-6 border border-gray-100"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-[#FFF0EB] rounded-2xl flex items-center justify-center group-hover:bg-coral-500 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-coral-500 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-brown-900 font-medium mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-medium text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
