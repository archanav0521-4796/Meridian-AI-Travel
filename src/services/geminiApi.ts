import { Destination, GeneratedItinerary, ItineraryDay } from '../types';

export function getStoredGeminiKey(): string {
  if (typeof localStorage !== 'undefined') {
    const key = localStorage.getItem('voyage_gemini_key');
    if (key && key.trim()) return key.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export async function askGeminiTravelAssistant(
  prompt: string,
  destination?: Destination,
  chatHistory: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> {
  const apiKey = getStoredGeminiKey();

  if (apiKey) {
    try {
      const systemInstruction = `You are MERIDIAN Concierge, an ultra-refined, worldly, and insightful personal luxury travel advisor.
Your answers are elegant, warm, concise, and deeply practical.

${
  destination
    ? `The traveler is currently inquiring about ${destination.name}, ${destination.country}.
Key context:
- Best time: ${destination.bestTimeToVisit}
- Currency: ${destination.currency}
- Language: ${destination.language}
- Famous places: ${destination.famousPlaces.map((p) => p.name).join(', ')}
- Known tips: ${destination.localTips.join('; ')}`
    : 'The traveler is inquiring about global travel destinations, itineraries, culture, or packing.'
}
Always provide formatted, readable responses with bullet points or bold text where appropriate. Avoid overly long prose; favor crisp insider wisdom.`;

      const contents = [
        ...chatHistory.map((item) => ({
          role: item.role,
          parts: [{ text: item.text }],
        })),
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }],
        },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return candidate;
        }
      }
    } catch (e) {
      console.warn('Gemini API request failed, engaging local curated intelligence:', e);
    }
  }

  // Built-in intelligent travel response engine for instant, zero-config evaluations
  return generateCuratedAiResponse(prompt, destination);
}

function generateCuratedAiResponse(prompt: string, destination?: Destination): string {
  const p = prompt.toLowerCase();
  const name = destination ? destination.name : 'your destination';
  const country = destination ? destination.country : 'abroad';

  if (p.includes('how long') || p.includes('days') || p.includes('duration') || p.includes('stay')) {
    if (destination) {
      return `For **${destination.name}**, an ideal journey is **4 to 6 days**. 
- **Days 1–2**: Immerse yourself in the historic heart (${destination.famousPlaces[0]?.name || 'key landmarks'}) and get acclimated to the local pace.
- **Days 3–4**: Venture into cultural quarters, sample local delicacies (${destination.cuisineMustTry.slice(0, 2).join(', ')}), and explore natural viewpoints.
- **Days 5+**: Take day excursions into neighboring coastal coves or alpine trails.`;
    }
    return `For most premier destinations, a balanced stay is **4 to 6 days**—allowing 2 days for iconic landmarks, 2 days for culinary and neighborhood flânerie, and 1-2 days for scenic day excursions.`;
  }

  if (p.includes('when to go') || p.includes('weather') || p.includes('season') || p.includes('month') || p.includes('time to visit')) {
    if (destination) {
      return `The prime window to experience **${destination.name}** is **${destination.bestTimeToVisit}**. 
During these months you enjoy optimal daylight, comfortable outdoor temperatures, and fewer peak tourist crowds.`;
    }
    return `The shoulder seasons (**May–June** and **September–October**) almost universally provide the finest balance of glorious weather, golden photography light, and relaxed crowds across both Europe and Asia.`;
  }

  if (p.includes('what to see') || p.includes('highlights') || p.includes('famous') || p.includes('must see') || p.includes('places')) {
    if (destination && destination.famousPlaces.length > 0) {
      const placesList = destination.famousPlaces
        .map((place) => `• **${place.name}** (${place.category}): ${place.tagline}. *Best at ${place.bestTimeOfDay}.*`)
        .join('\n');
      return `Here are the unmissable landmarks in **${destination.name}**:\n\n${placesList}\n\n*Tip: Reserve tickets online 2-3 weeks ahead to skip lines.*`;
    }
    return `Prioritize a blend of architectural heritage, a high scenic viewpoint for sunset orientation, and at least one vibrant historic quarter where you can get lost on foot without a map.`;
  }

  if (p.includes('food') || p.includes('eat') || p.includes('cuisine') || p.includes('dish') || p.includes('drink') || p.includes('restaurant')) {
    if (destination && destination.cuisineMustTry.length > 0) {
      return `Culinary treasures you must savor in **${destination.name}**:\n\n${destination.cuisineMustTry
        .map((dish) => `• **${dish}**`)
        .join('\n')}\n\n*Pro-tip:* Look for intimate eateries populated by local regulars rather than restaurants with multi-lingual picture menus directly adjacent to tourist plazas.`;
    }
    return `Always seek out family-owned trattorias, izakayas, or bistros with handwritten menus that rotate with seasonal market produce.`;
  }

  if (p.includes('pack') || p.includes('wear') || p.includes('clothes')) {
    return `**Essential Packing Guide for ${name}:**
• **Footwear:** Broken-in leather walking shoes or minimalist trainers (you'll average 12,000–18,000 steps daily).
• **Layers:** Breathable linen or merino wool shirts, lightweight waterproof trench/windbreaker, and a light cashmere knit for cooler evenings.
• **Tech:** High-capacity power bank, universal travel plug adapter, and offline downloaded maps.
• **Etiquette:** Modest attire with covered shoulders/knees if visiting religious shrines or historic cathedrals.`;
  }

  if (p.includes('budget') || p.includes('cost') || p.includes('money') || p.includes('price')) {
    if (destination) {
      return `**Budget Guidelines for ${destination.name} (${destination.currency}):**
• **Estimated Daily Spend:** ~$${destination.averageDailyCostUsd} USD per traveler (mid-luxury tier).
• **Accommodation:** Boutique hotels average $180–$350/night; luxury stays $500+/night.
• **Dining:** Casual neighborhood dining ~$25–$45 per meal; fine dining tasting menus ~$120+.
• **Transit:** ${destination.localTips[0] || 'Local transit is clean and efficient.'}`;
    }
    return `For a comfortable, refined journey, budget approximately $180 to $280 USD per day for dining, entrance passes, and local transport, excluding luxury accommodations.`;
  }

  // General warm conversational default
  return `Delighted to assist your voyage to **${name}**! 
Whether you are wondering about the best hidden sunset viewpoints, how to navigate local etiquette, or when to book museum passes, ask me anything. 
You can also use the **"Generate Itinerary"** button to formulate a complete day-by-day plan tailored to your travel style.`;
}

export async function generateDayByDayItinerary(
  destination: Destination,
  daysCount: number = 3,
  travelStyle: string = 'Balanced & Cultural',
  pace: string = 'Moderate'
): Promise<GeneratedItinerary> {
  const apiKey = getStoredGeminiKey();

  if (apiKey) {
    try {
      const prompt = `Generate a structured, luxurious, day-by-day travel itinerary for ${daysCount} days in ${destination.name}, ${destination.country}.
Travel Style: ${travelStyle}, Pace: ${pace}.
Available famous places: ${destination.famousPlaces.map((p) => p.name).join(', ')}.
Must try cuisine: ${destination.cuisineMustTry.join(', ')}.

Respond ONLY with a valid JSON object matching this exact TypeScript structure (no markdown fences, pure JSON):
{
  "title": "Editorial title for the trip",
  "estimatedTotalBudgetUsd": 850,
  "importantNotes": ["Note 1", "Note 2"],
  "packingList": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "days": [
    {
      "dayNumber": 1,
      "theme": "Catchy theme for the day",
      "summary": "Brief 1-sentence summary",
      "activities": [
        {
          "id": "act-1-1",
          "timeSlot": "Morning",
          "time": "09:00 AM",
          "title": "Activity name",
          "placeName": "Name of landmark",
          "description": "Engaging description with specific sights",
          "estimatedCost": "$25",
          "transportTip": "Walk or Metro Line 1",
          "insiderTip": "Arrive before 9:30 AM to skip queues"
        },
        {
          "id": "act-1-2",
          "timeSlot": "Afternoon",
          "time": "01:30 PM",
          "title": "Activity name",
          "placeName": "Name of landmark",
          "description": "Engaging description",
          "estimatedCost": "$40",
          "transportTip": "10 min taxi",
          "insiderTip": "Reserve table by window"
        },
        {
          "id": "act-1-3",
          "timeSlot": "Evening",
          "time": "07:00 PM",
          "title": "Activity name",
          "description": "Sunset views and dinner",
          "estimatedCost": "$65",
          "transportTip": "Pleasant walk along promenade",
          "insiderTip": "Dress smart casual"
        }
      ]
    }
  ]
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawText);

        if (parsed.days && Array.isArray(parsed.days)) {
          return {
            id: `itin-${Date.now()}`,
            destinationId: destination.id,
            destinationName: destination.name,
            country: destination.country,
            title: parsed.title || `${daysCount} Days of Splendor in ${destination.name}`,
            durationDays: daysCount,
            travelStyle,
            budgetStyle: destination.budgetTier,
            pace,
            estimatedTotalBudgetUsd: parsed.estimatedTotalBudgetUsd || daysCount * destination.averageDailyCostUsd,
            days: parsed.days,
            packingList: parsed.packingList || [
              'Comfortable walking shoes',
              'Layered breathable apparel',
              'Universal adapter & powerbank',
              'Camera with extra battery',
            ],
            importantNotes: parsed.importantNotes || destination.localTips.slice(0, 3),
            createdAt: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Gemini itinerary generation fallback triggered:', e);
    }
  }

  // High-fidelity fallback itinerary generator crafted specifically for each destination
  return generateDeterministicItinerary(destination, daysCount, travelStyle, pace);
}

function generateDeterministicItinerary(
  dest: Destination,
  daysCount: number,
  travelStyle: string,
  pace: string
): GeneratedItinerary {
  const places = dest.famousPlaces;
  const days: ItineraryDay[] = [];

  const dayThemes = [
    { theme: 'Arrival & Iconic Horizons', focus: 'Iconic Landmarks & Panoramic Orientations' },
    { theme: 'Spiritual Grace & Secret Courtyards', focus: 'Heritage Temples & Historic Alleys' },
    { theme: 'Gastronomy & Artisanal Quarters', focus: 'Markets, Master Crafts & Sunset Dining' },
    { theme: 'Scenic Excursions & Raw Nature', focus: 'Lakes, Cliffs & Alpine Trails' },
    { theme: 'Arts, Salons & Hidden Treasures', focus: 'Boutique Galleries & Quiet Cafés' },
    { theme: 'Grand Finale & Golden Hour Farewells', focus: 'Farewell Vista & Signature Tasting Menu' },
    { theme: 'Slow Flânerie & Departure', focus: 'Souvenirs & Reflective Morning Tea' },
  ];

  for (let d = 1; d <= daysCount; d++) {
    const themeObj = dayThemes[(d - 1) % dayThemes.length];
    const place1 = places[(d - 1) % places.length];
    const place2 = places[d % places.length] || place1;

    days.push({
      dayNumber: d,
      theme: themeObj.theme,
      summary: `Dedicate today to ${themeObj.focus.toLowerCase()} across ${dest.name}.`,
      activities: [
        {
          id: `act-${d}-1`,
          timeSlot: 'Morning',
          time: '08:30 AM',
          title: `Discover ${place1.name}`,
          placeName: place1.name,
          description: `Begin your morning early at ${place1.name}. ${place1.description.slice(0, 140)}...`,
          estimatedCost: place1.entryFee.includes('Free') ? '$0' : place1.entryFee,
          transportTip: 'Short morning stroll or quick local transit',
          insiderTip: place1.bestTimeOfDay,
          completed: false,
        },
        {
          id: `act-${d}-2`,
          timeSlot: 'Afternoon',
          time: '01:00 PM',
          title: `Artisanal Lunch & Exploration of ${place2.name}`,
          placeName: place2.name,
          description: `Savor authentic ${dest.cuisineMustTry[d % dest.cuisineMustTry.length]} at a neighborhood bistro, followed by ${place2.tagline}.`,
          estimatedCost: '$35 - $50',
          transportTip: '15-min scenic taxi or metro ride',
          insiderTip: `Seek out the shaded courtyard for undisturbed photographs.`,
          completed: false,
        },
        {
          id: `act-${d}-3`,
          timeSlot: 'Evening',
          time: '06:30 PM',
          title: `Golden Hour Stroll & Sunset Dinner`,
          description: `Toast to the evening as daylight softens. Indulge in ${dest.cuisineMustTry[(d + 1) % dest.cuisineMustTry.length]} paired with regional wine.`,
          estimatedCost: '$60 - $95',
          transportTip: 'Pleasant evening promenade',
          insiderTip: 'Reserve your terrace table 45 minutes before local sunset.',
          completed: false,
        },
      ],
    });
  }

  return {
    id: `itin-${Date.now()}`,
    destinationId: dest.id,
    destinationName: dest.name,
    country: dest.country,
    title: `${daysCount} Days in ${dest.name}: The Curated Journey`,
    durationDays: daysCount,
    travelStyle,
    budgetStyle: dest.budgetTier,
    pace,
    estimatedTotalBudgetUsd: daysCount * dest.averageDailyCostUsd,
    days,
    packingList: [
      'Tailored comfortable walking shoes',
      'Breathable linen & lightweight merino layers',
      'Universal power adapter & compact powerbank',
      'Refillable insulated water flask',
      'Light rain shell or windbreaker',
      'Polarized sunglasses & broad-spectrum sunscreen',
    ],
    importantNotes: dest.localTips,
    createdAt: new Date().toISOString(),
  };
}
