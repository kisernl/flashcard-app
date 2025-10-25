"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, FolderOpen } from "lucide-react"
import type { Stack } from "@/lib/types"
// TODO: Remove storage import once all operations are migrated to API
import { updateStack } from "@/lib/api" // Still used for create/update operations until API is fully implemented
import { getStacks, getDecksForStack, createStack, deleteStack as apiDeleteStack } from "@/lib/api"

interface StackListProps {
  onSelectStack: (stack: Stack) => void
  userId: string
}

export function StackList({ onSelectStack, userId }: StackListProps) {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [deckCounts, setDeckCounts] = useState<Record<string, number>>({})
  const [newStackName, setNewStackName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const loadedStacks = await getStacks(userId)
      setStacks(loadedStacks)

      // Load deck counts for each stack
      const counts: Record<string, number> = {}
      for (const stack of loadedStacks) {
        const decks = await getDecksForStack(stack.id, userId)  // Changed from stack.$id to stack.id
        counts[stack.id] = decks.length  // Changed from stack.$id to stack.id
      }
      setDeckCounts(counts)
    } catch (error) {
      console.error("Failed to load stacks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateStack = async () => {
    if (!newStackName.trim()) return

    try {
      // Using API for stack creation
      await createStack(newStackName.trim(), userId)
      setNewStackName("")
      setIsDialogOpen(false)
      await loadData()
    } catch (error) {
      console.error("Failed to create stack:", error)
    }
  }

  const handleDeleteStack = async (stackId: string, userId: string) => {
    if (stackId === "general") return
    if (confirm("Delete this stack? All decks will be moved to General.")) {
      try {
        await apiDeleteStack(stackId, userId)
        await loadData()
      } catch (error) {
        console.error("Failed to delete stack:", error)
      }
    }
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading stacks...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Stacks</h2>
          <p className="text-sm text-muted-foreground">Select a stack to view its decks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Stack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Stack</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="stack-name">Stack Name</Label>
                <Input
                  id="stack-name"
                  placeholder="e.g., Spanish, Biology, History"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateStack()}
                />
              </div>
              <Button onClick={handleCreateStack} className="w-full">
                Create Stack
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stacks.map((stack) => {
          const deckCount = deckCounts[stack.id] || 0
          return (
            <Card key={stack.id} className="group transition-colors dark:bg-zinc-900 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{stack.name}</CardTitle>
                  </div>
                  {stack.id !== "general" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteStack(stack.id, userId)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {deckCount} {deckCount === 1 ? "deck" : "decks"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => onSelectStack(stack)}>
                  Open Stack
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
