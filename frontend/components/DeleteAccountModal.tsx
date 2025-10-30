"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Functions } from "appwrite";
import { client } from "@/lib/appwrite";

export function DeleteAccountModal() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      
      // Call the Appwrite function to delete all user data
      const functions = new Functions(client);
      const result = await functions.createExecution(
        'deleteUserData', // Function ID (will need to be set after function deployment)
        JSON.stringify({ userId: user.$id })
      );

      if (result.responseStatusCode === 200) {
        const response = JSON.parse(result.responseBody);
        if (response.success) {
          // Clear local storage
          localStorage.removeItem("decks");
          localStorage.removeItem("stacks");
          
          // Redirect to landing page
          router.push("/");
        } else {
          throw new Error(response.error || 'Failed to delete account');
        }
      } else {
        throw new Error('Function execution failed');
      }
      
    } catch (error) {
      console.error("Error deleting account:", error);
      // In a production app, you might want to show a toast error message here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          title="Delete Account"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to delete your account and all of your data? This action cannot be undone and will permanently remove your account, flashcard decks, stacks, and all associated information from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}