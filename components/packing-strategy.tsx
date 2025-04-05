import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface PackingStrategyProps {
  luggageType: string
}

export function PackingStrategy({ luggageType }: PackingStrategyProps) {
  const getStrategyContent = () => {
    switch (luggageType) {
      case "carry-on":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Packing Strategy for Carry-on Suitcase</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Rolling Method</h4>
              <p>Roll clothes instead of folding to save space and reduce wrinkles.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>T-shirts, underwear, and socks are ideal for rolling</li>
                <li>Place rolled items at the bottom of your suitcase</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Layer Strategy (Bottom to Top)</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Bottom layer:</strong> Heavy items like shoes (in shoe bags), jeans, and bulky items
                </li>
                <li>
                  <strong>Middle layer:</strong> Rolled clothes and medium-weight items
                </li>
                <li>
                  <strong>Top layer:</strong> Light items like shirts and items you'll need first
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Liquids and Toiletries</h4>
              <p>Remember the 3-1-1 rule for carry-ons:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>3.4 ounces (100ml) or less per container</li>
                <li>1 quart-sized, clear, plastic, zip-top bag</li>
                <li>1 bag per passenger</li>
              </ul>
            </div>
          </div>
        )

      case "checked":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Packing Strategy for Checked Suitcase</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Weight Distribution</h4>
              <p>Place heavier items at the bottom (wheel end) of the suitcase for better balance.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Layer Strategy</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Bottom layer:</strong> Heavy items like shoes, toiletry bags, and bulky clothing
                </li>
                <li>
                  <strong>Middle layer:</strong> Folded clothes using the bundle method to reduce wrinkles
                </li>
                <li>
                  <strong>Top layer:</strong> Light items and things you'll need immediately upon arrival
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Utilize All Space</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Fill shoes with socks or small items</li>
                <li>Use packing cubes to organize and compress clothing</li>
                <li>Use the outer pockets for items you may need to access during travel</li>
              </ul>
            </div>
          </div>
        )

      case "backpack-small":
      case "backpack-medium":
      case "backpack-large":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Packing Strategy for{" "}
              {luggageType === "backpack-small" ? "Small" : luggageType === "backpack-medium" ? "Medium" : "Large"}{" "}
              Backpack
            </h3>

            <div className="space-y-2">
              <h4 className="font-medium">Weight Distribution</h4>
              <p>Proper weight distribution is crucial for comfort when carrying a backpack:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Bottom:</strong> Heavy items (sleeping bag, extra shoes)
                </li>
                <li>
                  <strong>Middle:</strong> Medium-weight items (clothes, food)
                </li>
                <li>
                  <strong>Top:</strong> Light, frequently used items (jacket, map, snacks)
                </li>
                <li>
                  <strong>External pockets:</strong> Items needed on the go (water bottle, sunscreen)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Space-Saving Techniques</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use compression sacks for clothing and sleeping bags</li>
                <li>Roll clothes instead of folding</li>
                <li>Use packing cubes to organize and maximize space</li>
                <li>Wear your bulkiest items during transit</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Accessibility Tips</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Pack items you'll need during the day near the top or in external pockets</li>
                <li>Keep valuables in internal, hard-to-reach pockets</li>
                <li>Use a rain cover to protect your backpack in wet conditions</li>
              </ul>
            </div>
          </div>
        )

      case "duffel":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Packing Strategy for Duffel Bag</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Organization Strategy</h4>
              <p>Duffel bags lack structure, so organization is key:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use packing cubes to create structure and organization</li>
                <li>Color-code packing cubes by category (clothes, toiletries, electronics)</li>
                <li>Place shoes at the ends of the bag, wrapped in shoe bags</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Layering Approach</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Bottom:</strong> Heavy items and items not needed immediately
                </li>
                <li>
                  <strong>Middle:</strong> Clothing and medium-weight items
                </li>
                <li>
                  <strong>Top:</strong> Items needed first upon arrival
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Accessibility Tips</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use external or end pockets for frequently accessed items</li>
                <li>Keep a small pouch with essentials at the top of your bag</li>
                <li>Consider using a shoulder strap for easier carrying</li>
              </ul>
            </div>
          </div>
        )

      case "osprey-fairview":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Packing Strategy for Osprey Fairview/Farpoint Travel Pack</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Main Compartment (Bottom-to-Top Packing)</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Bottom:</strong> Less frequently used items (extra clothes, sleeping bag liner)
                </li>
                <li>
                  <strong>Middle:</strong> Medium-weight essentials (clothes in packing cubes, toiletries)
                </li>
                <li>
                  <strong>Top:</strong> Frequently used items (jacket, snacks, water bottle)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Daypack (Detachable 15L)</h4>
              <p>Pack daily essentials in the detachable daypack:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Passport, cash, cards in secure inner pocket</li>
                <li>Electronics (phone, camera, chargers)</li>
                <li>Water bottle, snacks</li>
                <li>Light rain jacket or sweater</li>
                <li>Sunglasses, sunscreen</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Compression System</h4>
              <p>Use the built-in compression straps to:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Secure and stabilize the load</li>
                <li>Reduce the pack's profile for easier handling</li>
                <li>Prevent items from shifting during transit</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Laptop Sleeve</h4>
              <p>The dedicated laptop sleeve can hold:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Laptop (up to 15")</li>
                <li>Tablet</li>
                <li>Travel documents in a folder</li>
                <li>Books or magazines</li>
              </ul>
            </div>
          </div>
        )

      default:
        if (luggageType) {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Packing Strategy for {luggageType}</h3>

              <div className="space-y-2">
                <h4 className="font-medium">General Packing Principles</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>Weight distribution:</strong> Heavier items at the bottom/back
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Frequently used items should be easily accessible
                  </li>
                  <li>
                    <strong>Organization:</strong> Use packing cubes or bags to group similar items
                  </li>
                  <li>
                    <strong>Protection:</strong> Wrap fragile items in soft clothing
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Space-Saving Techniques</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Roll clothes instead of folding to save space</li>
                  <li>Use compression bags for bulky items</li>
                  <li>Fill empty spaces (like shoes) with small items</li>
                  <li>Wear your bulkiest items during transit</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Packing Order</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>First layer:</strong> Heavy items (shoes, toiletry bags)
                  </li>
                  <li>
                    <strong>Middle layer:</strong> Clothing and medium-weight items
                  </li>
                  <li>
                    <strong>Top layer:</strong> Light items and things needed first
                  </li>
                </ul>
              </div>
            </div>
          )
        } else {
          return (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No luggage type specified</AlertTitle>
              <AlertDescription>
                To see packing strategies, please go back to the trip form and select a luggage type.
              </AlertDescription>
            </Alert>
          )
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packing Strategy</CardTitle>
      </CardHeader>
      <CardContent>{getStrategyContent()}</CardContent>
    </Card>
  )
}

