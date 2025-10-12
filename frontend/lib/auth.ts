import { account } from './appwrite';

// Create account
export async function signUp(email: string, password: string, name: string) {
  return await account.create({
    userId: 'unique()',
    email,
    password,
    name,
  });
}

// Login
export async function login(email: string, password: string) {
  return await account.createEmailPasswordSession({
    email,
    password,
  });
}

// Get current user
export async function getCurrentUser(){
  try {
    return await account.get();
  } catch {
    return null;
  }
}

// Logout
export async function logout() {
  await account.deleteSession({ sessionId: 'current' });
}

