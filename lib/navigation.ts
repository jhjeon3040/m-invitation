export interface NavigationParams {
  lat: number;
  lng: number;
  name: string;
}

export function isKakaoInApp(): boolean {
  if (typeof navigator === "undefined") return false;
  return /KAKAOTALK/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

export function isMobile(): boolean {
  return isIOS() || isAndroid();
}

function openDeepLink(appUrl: string, webUrl: string): void {
  if (isMobile()) {
    window.location.href = appUrl;
    
    setTimeout(() => {
      window.location.href = webUrl;
    }, 1500);
  } else {
    window.open(webUrl, "_blank");
  }
}

export function openKakaoMap({ lat, lng, name }: NavigationParams): void {
  const appUrl = `kakaomap://look?p=${lat},${lng}`;
  const webUrl = `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`;
  
  if (isKakaoInApp()) {
    window.location.href = appUrl;
    return;
  }
  
  openDeepLink(appUrl, webUrl);
}

export function openNaverMap({ lat, lng, name }: NavigationParams): void {
  const appUrl = `nmap://route/public?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(name)}&appname=yeonjeong`;
  const webUrl = `https://map.naver.com/v5/directions/-/-/-/transit?c=${lng},${lat},15,0,0,0,dh`;
  
  openDeepLink(appUrl, webUrl);
}

export function openTMap({ lat, lng, name }: NavigationParams): void {
  const appUrl = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(name)}`;
  const webUrl = `https://apis.openapi.sk.com/tmap/app/routes?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(name)}`;
  
  openDeepLink(appUrl, webUrl);
}

export async function copyAddress(address: string, venueName?: string): Promise<boolean> {
  const fullAddress = venueName ? `${venueName}\n${address}` : address;
  
  try {
    await navigator.clipboard.writeText(fullAddress);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = fullAddress;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
