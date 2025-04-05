import type { PackingItem, WeatherData } from "./types"

interface PackingListParams {
  duration: number
  tripPurposes: string[]
  otherPurpose?: string
  accommodations: string[]
  weather?: WeatherData
  itinerary?: string
  gender?: "male" | "female" | "neutral"
}

export function generatePackingList(params: PackingListParams): Record<string, PackingItem[]> {
  const { duration, tripPurposes, otherPurpose, accommodations, weather, gender = "neutral" } = params

  // Initialize categories
  const packingList: Record<string, PackingItem[]> = {
    essentials: [],
    clothing: [],
    toiletries: [],
    electronics: [],
    documents: [],
    activities: [],
  }

  // Add essential items (common for all trips)
  packingList.essentials = [
    { name: "Wallet", quantity: 1, packed: false, purpose: "Essential item" },
    { name: "Phone", quantity: 1, packed: false, purpose: "Essential item" },
    { name: "Phone charger", quantity: 1, packed: false, purpose: "Essential item" },
    { name: "Medications", quantity: 1, packed: false, purpose: "Essential item" },
    { name: "Travel insurance info", quantity: 1, packed: false, purpose: "Essential item" },
  ]

  // Add clothing items based on duration
  const topsQuantity = Math.ceil(duration / 2) + 1
  const bottomsQuantity = Math.ceil(duration / 3) + 1
  const underwearQuantity = duration + 1
  const socksQuantity = duration + 1

  packingList.clothing = [
    { name: "T-shirts/tops", quantity: topsQuantity, packed: false, purpose: "Basic clothing" },
    { name: "Pants/shorts/skirts", quantity: bottomsQuantity, packed: false, purpose: "Basic clothing" },
    { name: "Underwear", quantity: underwearQuantity, packed: false, purpose: "Basic clothing" },
    { name: "Socks", quantity: socksQuantity, packed: false, purpose: "Basic clothing" },
    { name: "Sleepwear", quantity: 1, packed: false, purpose: "Basic clothing" },
  ]

  // Add gender-specific clothing items
  if (gender === "female") {
    packingList.clothing.push(
      { name: "Bras", quantity: Math.ceil(duration / 2) + 1, packed: false, purpose: "Basic clothing" },
      { name: "Sports bras", quantity: Math.ceil(duration / 4) + 1, packed: false, purpose: "For activities" },
    )

    packingList.toiletries.push(
      { name: "Feminine hygiene products", quantity: 1, packed: false, purpose: "Personal care" },
      { name: "Makeup", quantity: 1, packed: false, purpose: "Personal care" },
      { name: "Makeup remover", quantity: 1, packed: false, purpose: "Personal care", isLiquid: true, volume: "100ml" },
    )
  }

  if (gender === "male") {
    packingList.toiletries.push(
      {
        name: "Razor/shaving cream",
        quantity: 1,
        packed: false,
        purpose: "Personal care",
        isLiquid: true,
        volume: "100ml",
      },
      { name: "Aftershave", quantity: 1, packed: false, purpose: "Personal care", isLiquid: true, volume: "100ml" },
    )
  }

  // Add weather-specific clothing if weather data is available
  if (weather) {
    if (weather.temperature < 15) {
      packingList.clothing.push(
        { name: "Sweater/hoodie", quantity: 2, packed: false, purpose: "For cold weather" },
        { name: "Jacket", quantity: 1, packed: false, purpose: "For cold weather" },
      )
    }

    if (weather.temperature > 25) {
      packingList.clothing.push(
        { name: "Shorts", quantity: 2, packed: false, purpose: "For warm weather" },
        { name: "Sunglasses", quantity: 1, packed: false, purpose: "For sunny days" },
        { name: "Hat/cap", quantity: 1, packed: false, purpose: "Sun protection" },
      )
    }

    if (weather.description.toLowerCase().includes("rain")) {
      packingList.clothing.push(
        { name: "Rain jacket/umbrella", quantity: 1, packed: false, purpose: "For rainy weather" },
        { name: "Waterproof shoes", quantity: 1, packed: false, purpose: "For rainy weather" },
      )
    }
  }

  // Add trip purpose specific items
  if (tripPurposes.includes("beach")) {
    packingList.activities.push(
      { name: "Swimwear", quantity: 2, packed: false, purpose: "For beach activities" },
      { name: "Beach towel", quantity: 1, packed: false, purpose: "For beach activities" },
      { name: "Flip flops", quantity: 1, packed: false, purpose: "For beach activities" },
      { name: "Sunscreen", quantity: 1, packed: false, purpose: "Sun protection", isLiquid: true, volume: "200ml" },
    )
  }

  if (tripPurposes.includes("business")) {
    packingList.clothing.push(
      { name: "Formal shirts", quantity: Math.ceil(duration / 2), packed: false, purpose: "For business meetings" },
      { name: "Formal pants/skirts", quantity: 2, packed: false, purpose: "For business meetings" },
      { name: "Business shoes", quantity: 1, packed: false, purpose: "For business meetings" },
      { name: "Ties/accessories", quantity: 2, packed: false, purpose: "For business meetings" },
    )

    packingList.activities.push(
      { name: "Business cards", quantity: 1, packed: false, purpose: "For networking" },
      { name: "Notebook/planner", quantity: 1, packed: false, purpose: "For business meetings" },
    )
  }

  if (tripPurposes.includes("outdoor")) {
    packingList.activities.push(
      { name: "Hiking boots", quantity: 1, packed: false, purpose: "For outdoor activities" },
      { name: "Quick-dry shirts", quantity: 3, packed: false, purpose: "For outdoor activities" },
      { name: "Hiking pants", quantity: 2, packed: false, purpose: "For outdoor activities" },
      { name: "Daypack", quantity: 1, packed: false, purpose: "For day trips" },
      { name: "Water bottle", quantity: 1, packed: false, purpose: "For hydration" },
      { name: "First aid kit", quantity: 1, packed: false, purpose: "For emergencies" },
    )
  }

  if (tripPurposes.includes("city")) {
    packingList.activities.push(
      { name: "Comfortable walking shoes", quantity: 1, packed: false, purpose: "For city exploration" },
      { name: "Day bag/backpack", quantity: 1, packed: false, purpose: "For carrying essentials" },
      { name: "City map/guidebook", quantity: 1, packed: false, purpose: "For navigation" },
      { name: "Camera", quantity: 1, packed: false, purpose: "For sightseeing" },
    )
  }

  // Add items for custom trip purpose
  if (tripPurposes.includes("other") && otherPurpose) {
    packingList.activities.push({
      name: `Items for ${otherPurpose}`,
      quantity: 1,
      packed: false,
      purpose: `For ${otherPurpose}`,
    })
  }

  // Add toiletries with liquid indicators and volumes
  packingList.toiletries = [
    ...(packingList.toiletries || []),
    { name: "Toothbrush", quantity: 1, packed: false, purpose: "Basic hygiene" },
    { name: "Toothpaste", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "75ml" },
    { name: "Deodorant", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "50ml" },
    { name: "Shampoo", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "100ml" },
    { name: "Conditioner", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "100ml" },
    { name: "Body wash", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "100ml" },
    { name: "Hairbrush/comb", quantity: 1, packed: false, purpose: "Basic hygiene" },
    { name: "Face wash", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "50ml" },
    { name: "Moisturizer", quantity: 1, packed: false, purpose: "Basic hygiene", isLiquid: true, volume: "50ml" },
  ]

  // Add accommodation-specific items
  for (const accommodation of accommodations) {
    if (accommodation === "hostel" || accommodation === "camping") {
      packingList.essentials.push(
        { name: "Travel towel", quantity: 1, packed: false, purpose: `For ${accommodation}` },
        { name: "Earplugs", quantity: 1, packed: false, purpose: `For ${accommodation}` },
        { name: "Eye mask", quantity: 1, packed: false, purpose: `For ${accommodation}` },
      )
    }

    if (accommodation === "camping") {
      packingList.essentials.push(
        { name: "Sleeping bag", quantity: 1, packed: false, purpose: "For camping" },
        { name: "Flashlight", quantity: 1, packed: false, purpose: "For camping" },
        { name: "Multi-tool", quantity: 1, packed: false, purpose: "For camping" },
      )
    }
  }

  // Add electronics
  packingList.electronics = [
    { name: "Camera", quantity: 1, packed: false, purpose: "For photos" },
    { name: "Power adapter", quantity: 1, packed: false, purpose: "For charging devices" },
    { name: "Portable charger", quantity: 1, packed: false, purpose: "For charging on the go" },
  ]

  // Add documents
  packingList.documents = [
    { name: "Passport/ID", quantity: 1, packed: false, purpose: "Required for travel" },
    { name: "Flight tickets", quantity: 1, packed: false, purpose: "Required for travel" },
    { name: "Hotel reservation", quantity: 1, packed: false, purpose: "Required for check-in" },
    { name: "Cash/credit cards", quantity: 1, packed: false, purpose: "For purchases" },
  ]

  return packingList
}

