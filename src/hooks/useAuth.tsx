
"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, OAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Assuming firebase config is in lib/firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateUsername } from 'unique-username-generator';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  communityProfileExists: boolean | null; // null = checking, true = exists, false = doesn't exist
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
  logout: () => Promise<void>;
  joinCommunity: () => Promise<void>; // Function to explicitly create community profile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [communityProfileExists, setCommunityProfileExists] = useState<boolean | null>(null);

  const checkOrCreateCommunityProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setCommunityProfileExists(false);
      return false;
    }
    setCommunityProfileExists(null); // Start checking
    const profileRef = doc(db, 'communityProfiles', currentUser.uid);
    try {
      const docSnap = await getDoc(profileRef);
      const exists = docSnap.exists();
      setCommunityProfileExists(exists);
      console.log(`Community profile check for ${currentUser.uid}: ${exists ? 'Exists' : 'Does not exist'}`);
      return exists;
    } catch (error) {
      console.error("Error checking community profile:", error);
      setCommunityProfileExists(false); // Assume false on error
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await checkOrCreateCommunityProfile(currentUser);
      setLoading(false);
      console.log("Auth state changed:", currentUser?.uid || 'No user');
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSuccessfulLogin = async (loggedInUser: User) => {
    setUser(loggedInUser);
    // Check if community profile exists after login
    await checkOrCreateCommunityProfile(loggedInUser);
  };

  const loginWithProvider = async (provider: any) => { // GoogleAuthProvider | OAuthProvider | FacebookAuthProvider | TwitterAuthProvider
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(result.user);
      console.log(`${provider.providerId} login successful:`, result.user.uid);
    } catch (error: any) {
      console.error("Authentication error:", error);
      // Handle specific errors like popup closed, account exists with different credential, etc.
      alert(`Login failed: ${error.message}`); // Simple alert for demo
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => loginWithProvider(new GoogleAuthProvider());
  const loginWithMicrosoft = () => loginWithProvider(new OAuthProvider('microsoft.com'));
  const loginWithFacebook = () => loginWithProvider(new FacebookAuthProvider());
  const loginWithTwitter = () => loginWithProvider(new TwitterAuthProvider());

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setCommunityProfileExists(false); // Reset community status on logout
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinCommunity = async () => {
    if (!user || communityProfileExists === true || communityProfileExists === null) {
      console.log("Cannot join community: No user, already joined, or currently checking.");
      return;
    }
    setLoading(true);
    try {
      const profileRef = doc(db, 'communityProfiles', user.uid);
      const username = generateUsername("-", 3, 15); // Generate initial pseudonymous username
      const profileData = {
        userId: user.uid, // Link to the main auth user ID
        displayName: username,
        bio: `Hello! I'm new to the ConnectPro community.`,
        createdAt: new Date(),
        // Add other default community profile fields if needed
      };
      await setDoc(profileRef, profileData);
      setCommunityProfileExists(true); // Update state
      console.log(`Community profile created for ${user.uid} with username ${username}`);
    } catch (error) {
      console.error("Error creating community profile:", error);
      // Optionally show an error toast/message
    } finally {
      setLoading(false);
    }
  };


  const value = {
    user,
    loading,
    communityProfileExists,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithFacebook,
    loginWithTwitter,
    logout,
    joinCommunity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
