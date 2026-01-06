import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  className?: string;
  imageSrc: string;
  name: string;
  date: string;
}

export function PhoneMockup({ className, imageSrc, name, date }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden",
        "before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-1/3 before:h-6 before:bg-gray-950 before:rounded-b-2xl before:z-20",
        className
      )}
    >
      {/* Screen */}
      <div className="absolute inset-0 bg-white overflow-hidden flex flex-col">
        {/* Status Bar Placeholder */}
        <div className="h-8 w-full bg-white/10 absolute top-0 z-10 flex justify-between px-6 items-center text-[10px] font-medium text-black/50">
          <span>9:41</span>
          <div className="flex gap-1">
             <div className="w-4 h-2.5 bg-black/20 rounded-[1px]" />
          </div>
        </div>

        {/* Invitation Content */}
        <div className="relative h-3/5 w-full">
          <Image
            src={imageSrc}
            alt="Wedding Couple"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="flex-1 bg-white p-6 flex flex-col items-center text-center space-y-3 pt-6 relative">
             {/* Curve divider effect if possible, simplified here */}
             <div className="absolute -top-10 left-0 right-0 h-10 bg-white rounded-t-[2rem]" />
             
             <p className="text-sm font-serif italic text-gray-500">Save the Date</p>
             <h3 className="text-xl font-serif text-gray-800 leading-tight">{name}</h3>
             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{date}</p>
             
             <div className="mt-4 w-full space-y-2">
                <p className="text-[10px] text-gray-400">Saturday, September 16, 2026<br/>3:30 pm - 7:00 pm</p>
                <div className="w-full h-8 bg-[#FDF8F3] rounded-full flex items-center justify-center text-xs text-coral-500 font-bold mt-2">
                    RSVP
                </div>
             </div>
        </div>
      </div>
      
      {/* Side Buttons */}
      <div className="absolute top-24 -left-[8px] w-[8px] h-10 bg-gray-800 rounded-l-md shadow-sm" />
      <div className="absolute top-40 -left-[8px] w-[8px] h-14 bg-gray-800 rounded-l-md shadow-sm" />
      <div className="absolute top-28 -right-[8px] w-[8px] h-20 bg-gray-800 rounded-r-md shadow-sm" />
    </div>
  );
}
