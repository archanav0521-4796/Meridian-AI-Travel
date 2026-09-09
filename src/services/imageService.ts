export function getStoredUnsplashKey(): string {
  if (typeof localStorage !== 'undefined') {
    const key = localStorage.getItem('voyage_unsplash_key');
    if (key && key.trim()) return key.trim();
  }
  return import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
}

export interface FetchedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  description: string;
  authorName: string;
  authorUrl: string;
}

const imageCache = new Map<string, FetchedImage[]>();

export async function searchImages(query: string, count: number = 6): Promise<FetchedImage[]> {
  const cacheKey = `${query}_${count}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const accessKey = getStoredUnsplashKey();

  if (accessKey) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&orientation=landscape&per_page=${count}&client_id=${accessKey}`
      );
      if (res.ok) {
        const data = await res.json();
        const results: FetchedImage[] = (data.results || []).map((item: any) => ({
          id: item.id,
          url: item.urls?.regular || item.urls?.full,
          thumbnailUrl: item.urls?.small,
          description: item.alt_description || query,
          authorName: item.user?.name || 'Unsplash Photographer',
          authorUrl: item.user?.links?.html || 'https://unsplash.com',
        }));

        if (results.length > 0) {
          imageCache.set(cacheKey, results);
          return results;
        }
      }
    } catch (e) {
      console.warn('Unsplash API search failed, using curated image resolver:', e);
    }
  }

  // Dynamic curated fallback using verified high-resolution Unsplash CDN photographic assets
  const fallbackAssets: Record<string, FetchedImage[]> = {
    kyoto: [
      {
        id: 'kyo-1',
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop',
        description: 'Kyoto Pagoda at twilight',
        authorName: 'Sorasak',
        authorUrl: 'https://unsplash.com/@sorasak',
      },
      {
        id: 'kyo-2',
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400&auto=format&fit=crop',
        description: 'Arashiyama bamboo grove',
        authorName: 'Pawel Nolbert',
        authorUrl: 'https://unsplash.com/@nolbert',
      },
    ],
    paris: [
      {
        id: 'par-1',
        url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop',
        description: 'Paris skyline with Eiffel Tower',
        authorName: 'Anthony Delanoix',
        authorUrl: 'https://unsplash.com/@anthonydelanoix',
      },
    ],
  };

  const lowerQuery = query.toLowerCase();
  for (const [key, list] of Object.entries(fallbackAssets)) {
    if (lowerQuery.includes(key)) {
      return list;
    }
  }

  // General fallback
  const generic: FetchedImage[] = [
    {
      id: 'gen-1',
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop',
      description: 'Scenic world exploration',
      authorName: 'Unsplash Community',
      authorUrl: 'https://unsplash.com',
    },
  ];

  return generic;
}
