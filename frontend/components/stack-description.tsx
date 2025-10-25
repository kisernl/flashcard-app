"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, Save, X } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Textarea } from "./ui/textarea"
import { Stack } from "@/lib/types"
import { updateStack } from "@/lib/api"
import { useToast } from "./ui/use-toast"

interface StackDescriptionProps {
  stack: Stack | null
  deckCount?: number
  isLoading?: boolean
  onUpdate?: (updatedStack: Stack) => void
}

export function StackDescription({ stack, deckCount = 0, isLoading = false, onUpdate }: StackDescriptionProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState("")
  const [editedName, setEditedName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleEditClick = () => {
    setEditedName(stack?.name || "")
    setEditedDescription(stack?.description || "")
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedDescription("")
  }

  const handleSave = async () => {
    if (!stack || !editedName.trim()) return
    
    setIsSaving(true)
    
    try {
      const updates: { description?: string; name?: string } = {}
      
      if (editedName !== stack.name) {
        updates.name = editedName.trim()
      }
      if (editedDescription !== (stack.description || '')) {
        updates.description = editedDescription.trim()
      }
      
      const updatedStack = await updateStack(stack.id, updates)
      
      if (onUpdate) {
        onUpdate({
            id: updatedStack.$id,
            name: (updatedStack as unknown as { name: string }).name,
            description: (updatedStack as unknown as { description?: string }).description,
            createdAt: new Date(updatedStack.$createdAt).getTime(),
            ownerId: (updatedStack as unknown as { ownerId: string }).ownerId
        });
      }
      
      // Reset editing state and clean up
      setIsEditing(false)
      setEditedName('')
      setEditedDescription('')
      
      toast({
        title: "Success",
        description: "Stack updated successfully.",
      })
      
    } catch (error) {
      console.error("Error updating stack:", error)
      toast({
        title: "Error",
        description: "Failed to update stack. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stack) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Stack Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a stack to view its details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isEditing ? (
          <div className="w-full flex items-center space-x-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-bold bg-yellow-50 dark:bg-yellow-900/20 border-b border-input focus:border-primary focus:outline-none w-full px-2 py-1 rounded-t transition-colors"
              disabled={isSaving}
            />
          </div>
        ) : (
          <CardTitle className="text-2xl font-bold">{stack.name}</CardTitle>
        )}
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleEditClick}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-muted-foreground">Stack Description</h3>
            
          </div>
          
          {isEditing ? (
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter a description for this stack..."
              className="min-h-[100px] bg-yellow-50 dark:bg-yellow-900/20 border border-input rounded-md p-2 transition-colors"
              disabled={isSaving}
              autoFocus
            />
          ) : (
            <p 
              className="mt-1 text-sm text-foreground whitespace-pre-wrap cursor-pointer hover:bg-accent/50 rounded-md p-2 -mx-2"
              onClick={handleEditClick}
            >
              {stack.description || <span className="text-muted-foreground italic">No description available. Click to add one.</span>}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p className="text-sm text-foreground">
              {format(new Date(stack.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Decks</h3>
            <p className="text-sm text-foreground">{deckCount}</p>
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <div className="p-4 border-t bg-muted/10 align-bottom">
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving || !editedName.trim()}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
