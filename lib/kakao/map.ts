export interface AddressResult {
  placeName: string;
  address: string;
  roadAddress: string;
  lat: number;
  lng: number;
  phone?: string;
}

export interface GeocodingResult {
  address: string;
  roadAddress: string;
  lat: number;
  lng: number;
}

export async function searchPlaces(query: string): Promise<AddressResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
  
  if (!apiKey) {
    console.error("NEXT_PUBLIC_KAKAO_REST_KEY is not set");
    return [];
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();

    return data.documents.map((doc: Record<string, unknown>) => ({
      placeName: doc.place_name as string,
      address: doc.address_name as string,
      roadAddress: doc.road_address_name as string || doc.address_name as string,
      lat: parseFloat(doc.y as string),
      lng: parseFloat(doc.x as string),
      phone: doc.phone as string || undefined,
    }));
  } catch (error) {
    console.error("Failed to search places:", error);
    return [];
  }
}

export async function addressToCoords(address: string): Promise<GeocodingResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
  
  if (!apiKey) {
    console.error("NEXT_PUBLIC_KAKAO_REST_KEY is not set");
    return null;
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.documents.length === 0) {
      return null;
    }

    const doc = data.documents[0];
    return {
      address: doc.address_name,
      roadAddress: doc.road_address?.address_name || doc.address_name,
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x),
    };
  } catch (error) {
    console.error("Failed to geocode address:", error);
    return null;
  }
}

export async function coordsToAddress(lat: number, lng: number): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
  
  if (!apiKey) {
    console.error("NEXT_PUBLIC_KAKAO_REST_KEY is not set");
    return null;
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.documents.length === 0) {
      return null;
    }

    const doc = data.documents[0];
    return doc.road_address?.address_name || doc.address?.address_name || null;
  } catch (error) {
    console.error("Failed to reverse geocode:", error);
    return null;
  }
}

export function getStaticMapUrl(
  lat: number,
  lng: number,
  width: number = 400,
  height: number = 300
): string {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
  return `https://dapi.kakao.com/v2/maps/staticmap?&appkey=${apiKey}&center=${lng},${lat}&level=3&marker=pos ${lng} ${lat}&w=${width}&h=${height}`;
}
