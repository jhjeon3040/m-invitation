"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: MapOptions) => KakaoMap;
        LatLng: new (lat: number, lng: number) => LatLng;
        Marker: new (options: MarkerOptions) => Marker;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindow;
        event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

interface MapOptions {
  center: LatLng;
  level: number;
}

interface LatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMap {
  setCenter: (latlng: LatLng) => void;
  setLevel: (level: number) => void;
}

interface MarkerOptions {
  position: LatLng;
  map?: KakaoMap;
  draggable?: boolean;
}

interface Marker {
  setMap: (map: KakaoMap | null) => void;
  getPosition: () => LatLng;
}

interface InfoWindowOptions {
  content: string;
  removable?: boolean;
}

interface InfoWindow {
  open: (map: KakaoMap, marker: Marker) => void;
  close: () => void;
}

export interface KakaoMapProps {
  lat: number;
  lng: number;
  venueName: string;
  venueAddress?: string;
  className?: string;
  showInfoWindow?: boolean;
}

export function KakaoMap({
  lat,
  lng,
  venueName,
  venueAddress,
  className = "w-full h-64 rounded-xl",
  showInfoWindow = true,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.kakao?.maps) return;

    try {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const position = new window.kakao.maps.LatLng(lat, lng);

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: position,
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          position,
          map,
        });

        if (showInfoWindow) {
          const infoContent = `
            <div style="padding: 8px 12px; min-width: 120px; font-size: 13px;">
              <strong style="color: #3D3632;">${venueName}</strong>
              ${venueAddress ? `<br/><span style="color: #888; font-size: 11px;">${venueAddress}</span>` : ""}
            </div>
          `;

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoContent,
            removable: true,
          });

          infoWindow.open(map, marker);
        }
      });
    } catch (error) {
      console.error("Failed to initialize Kakao Map:", error);
      setHasError(true);
    }
  }, [isLoaded, lat, lng, venueName, venueAddress, showInfoWindow]);

  const handleScriptLoad = () => {
    setIsLoaded(true);
  };

  const handleScriptError = () => {
    console.error("Failed to load Kakao Maps SDK");
    setHasError(true);
  };

  if (hasError || !apiKey) {
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center text-gray-400`}>
        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-sm">{venueName}</p>
        {venueAddress && <p className="text-xs mt-1">{venueAddress}</p>}
      </div>
    );
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      <div
        ref={mapRef}
        className={className}
        role="application"
        aria-label={`${venueName} 지도`}
      >
        {!isLoaded && (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-sm">지도 로딩중...</span>
          </div>
        )}
      </div>
    </>
  );
}

export default KakaoMap;
