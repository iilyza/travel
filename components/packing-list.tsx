"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, Minus, Trash2, Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PackingItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface PackingListProps {
  items: Record<string, PackingItem[]>
  filter: string
}

const CATEGORIES = [
  "essentials",
  "clothing",
  "toiletries",
  "electronics",
  "documents",
  "activities"
]

const SECTIONS = [
  "all",
  "daily-outfits",
  "packing-strategy",
  "notes"
]

export function PackingList({ items, filter }: PackingListProps) {
  const [packingItems, setPackingItems] = useState<Record<string, PackingItem[]>>(() => {
    // Deep clone the items to avoid reference issues
    return JSON.parse(JSON.stringify(items))
  })
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("essentials")
  const [editingItem, setEditingItem] = useState<{ category: string; index: number } | null>(null)
  const [editValue, setEditValue] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  const handleCheckItem = (category: string, index: number) => {
    const updatedItems = { ...packingItems }
    updatedItems[category][index].packed = !updatedItems[category][index].packed
    setPackingItems(updatedItems)
  }

  const handleQuantityChange = (category: string, index: number, change: number) => {
    const updatedItems = { ...packingItems }
    const newQuantity = updatedItems[category][index].quantity + change

    if (newQuantity > 0) {
      updatedItems[category][index].quantity = newQuantity
      setPackingItems(updatedItems)
    }
  }

  const handleDeleteItem = (category: string, index: number) => {
    const updatedItems = { ...packingItems }
    updatedItems[category] = [...updatedItems[category].slice(0, index), ...updatedItems[category].slice(index + 1)]
    setPackingItems(updatedItems)
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newItemName.trim()) return

    const updatedItems = { ...packingItems }
    const category = "essentials" // Default category for new items

    if (!updatedItems[category]) {
      updatedItems[category] = []
    }

    // Check if it's a liquid item
    const isLiquid =
      newItemName.toLowerCase().includes("liquid") ||
      newItemName.toLowerCase().includes("shampoo") ||
      newItemName.toLowerCase().includes("conditioner") ||
      newItemName.toLowerCase().includes("lotion") ||
      newItemName.toLowerCase().includes("sunscreen") ||
      newItemName.toLowerCase().includes("gel")

    updatedItems[category].push({
      name: newItemName,
      quantity: 1,
      packed: false,
      purpose: "Custom item",
      isLiquid: isLiquid,
      volume: isLiquid ? "100ml" : undefined,
    })

    setPackingItems(updatedItems)
    setNewItemName("")
  }

  const startEditing = (category: string, index: number) => {
    setEditingItem({ category, index })
    setEditValue(packingItems[category][index].name)
    // Focus the input after it renders
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus()
      }
    }, 0)
  }

  const saveEdit = () => {
    if (editingItem && editValue.trim()) {
      const { category, index } = editingItem
      const updatedItems = { ...packingItems }

      // Check if the new name suggests it's a liquid
      const isLiquid =
        editValue.toLowerCase().includes("liquid") ||
        editValue.toLowerCase().includes("shampoo") ||
        editValue.toLowerCase().includes("conditioner") ||
        editValue.toLowerCase().includes("lotion") ||
        editValue.toLowerCase().includes("sunscreen") ||
        editValue.toLowerCase().includes("gel")

      updatedItems[category][index] = {
        ...updatedItems[category][index],
        name: editValue,
        isLiquid: isLiquid,
        volume: isLiquid ? updatedItems[category][index].volume || "100ml" : undefined,
      }

      setPackingItems(updatedItems)
    }
    setEditingItem(null)
  }

  const cancelEdit = () => {
    setEditingItem(null)
  }

  // Add a useEffect to update packingItems when items prop changes
  useEffect(() => {
    // Only update if items is different to avoid infinite loops
    if (Object.keys(items).length > 0 && JSON.stringify(items) !== JSON.stringify(packingItems)) {
      setPackingItems(JSON.parse(JSON.stringify(items)))
    }
  }, [items])

  // Filter categories based on the selected tab
  const filteredCategories = filter === "all" ? CATEGORIES : [filter]

  // Get all items for the "all" section
  const allItems = Object.entries(packingItems).flatMap(([category, items]) =>
    items.map((item) => ({ ...item, category }))
  )

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddItem} className="flex flex-wrap gap-2 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input placeholder="Add a new item..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
        </div>
        <select
          className="px-3 py-2 rounded-md border border-input bg-background"
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <Button type="submit">Add Item</Button>
      </form>

      <div className="space-y-6">
        {filter === "all" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Item</th>
                      <th className="text-center py-2 px-4">Quantity</th>
                      <th className="text-left py-2 px-4">Purpose/Notes</th>
                      <th className="text-right py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.map((item, index) => (
                      <tr key={`${item.category}-${index}`} className="border-b hover:bg-slate-50">
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-6 w-6",
                                item.packed && "bg-green-100 text-green-600"
                              )}
                              onClick={() => handleCheckItem(item.category, index)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            {editingItem?.category === item.category && editingItem?.index === index ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  ref={editInputRef}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-8 w-48"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      saveEdit()
                                    } else if (e.key === 'Escape') {
                                      cancelEdit()
                                    }
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-green-600"
                                  onClick={saveEdit}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-600"
                                  onClick={cancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <span className={cn(
                                "font-medium",
                                item.packed && "line-through text-gray-500"
                              )}>
                                {item.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(item.category, index, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(item.category, index, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex flex-col gap-1">
                            {item.purpose && (
                              <span className="text-sm text-gray-600">{item.purpose}</span>
                            )}
                            {item.isLiquid && item.volume && (
                              <span className="text-sm text-gray-500">Volume: {item.volume}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:text-blue-600"
                              onClick={() => startEditing(item.category, index)}
                              disabled={editingItem !== null}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:text-red-600"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this item?')) {
                                  handleDeleteItem(item.category, index)
                                }
                              }}
                              disabled={editingItem !== null}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : filter === "daily-outfits" || filter === "packing-strategy" || filter === "notes" ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Select a section to view its contents</p>
          </div>
        ) : (
          filteredCategories.map(category => {
            const categoryItems = packingItems[category] || []
          if (!categoryItems?.length) return null

          return (
            <Card key={category}>
              <CardHeader>
                  <CardTitle className="text-lg capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Item</th>
                          <th className="text-center py-2 px-4">Quantity</th>
                          <th className="text-left py-2 px-4">Purpose/Notes</th>
                          <th className="text-right py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                  {categoryItems.map((item, index) => (
                          <tr key={item.name} className="border-b hover:bg-slate-50">
                            <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6",
                            item.packed && "bg-green-100 text-green-600"
                          )}
                          onClick={() => handleCheckItem(category, index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                                {editingItem?.category === category && editingItem?.index === index ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      ref={editInputRef}
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="h-8 w-48"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          saveEdit()
                                        } else if (e.key === 'Escape') {
                                          cancelEdit()
                                        }
                                      }}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-green-600"
                                      onClick={saveEdit}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-600"
                                      onClick={cancelEdit}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                        <span className={cn(
                                    "font-medium",
                          item.packed && "line-through text-gray-500"
                        )}>
                          {item.name}
                        </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleQuantityChange(category, index, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleQuantityChange(category, index, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex flex-col gap-1">
                                {item.purpose && (
                                  <span className="text-sm text-gray-600">{item.purpose}</span>
                                )}
                                {item.isLiquid && item.volume && (
                                  <span className="text-sm text-gray-500">Volume: {item.volume}</span>
                                )}
                      </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:text-blue-600"
                                  onClick={() => startEditing(category, index)}
                                  disabled={editingItem !== null}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                                  className="h-6 w-6 hover:text-red-600"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this item?')) {
                                      handleDeleteItem(category, index)
                                    }
                                  }}
                                  disabled={editingItem !== null}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                            </td>
                          </tr>
                  ))}
                      </tbody>
                    </table>
                </div>
              </CardContent>
            </Card>
          )
          })
        )}
      </div>

      {filter === "all" && allItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">No items added yet. Add some items to get started!</p>
        </div>
      )}

      {filter !== "all" && filteredCategories.every((category) => !packingItems[category] || packingItems[category].length === 0) && (
        <div className="text-center py-8">
          <p className="text-slate-500">No items in this category. Add some items to get started!</p>
        </div>
      )}
    </div>
  )
}

