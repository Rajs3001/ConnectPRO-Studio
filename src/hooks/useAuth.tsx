
"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, OAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Added email/password auth
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Added serverTimestamp
import { generateUsername } from 'unique-username-generator';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  communityProfileExists: boolean | null; // null = checking, true = exists, false = doesn't exist
  loginWithGoogle: () => Promise<User | null>; // Return User on success
  loginWithMicrosoft: () => Promise<User | null>;
  loginWithFacebook: () => Promise<User | null>;
  loginWithTwitter: () => Promise<User | null>;
  loginWithEmail: (email: string, pass: string) => Promise<User | null>; // Add email login
  signupWithEmail: (name: string, email: string, pass: string) => Promise<User | null>; // Add email signup
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

  const checkOrCreateCommunityProfile = async (currentUser: User | null): Promise<boolean> => {
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
    setLoading(true); // Ensure loading is true while checking initial state
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
    // No need to call setUser here, onAuthStateChanged handles it.
    // Check community profile status.
    await checkOrCreateCommunityProfile(loggedInUser);
    return loggedInUser; // Return user object
  };

  const loginWithProvider = async (provider: any): Promise<User | null> => { // GoogleAuthProvider | OAuthProvider | FacebookAuthProvider | TwitterAuthProvider
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      // handleSuccessfulLogin is called by onAuthStateChanged listener
      console.log(`${provider.providerId} login successful:`, result.user.uid);
      return result.user;
    } catch (error: any) {
      console.error("Provider Authentication error:", error);
      // Handle specific errors like popup closed, account exists with different credential, etc.
      // alert(`Login failed: ${error.message}`); // Simple alert for demo
      setLoading(false); // Ensure loading is false on error
      throw error; // Re-throw error for component to handle
    } finally {
       // Loading state will be set to false by the onAuthStateChanged listener
    }
  };

   const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
     setLoading(true);
     try {
       const userCredential = await signInWithEmailAndPassword(auth, email, pass);
       // handleSuccessfulLogin is called by onAuthStateChanged listener
       console.log(`Email login successful:`, userCredential.user.uid);
       return userCredential.user;
     } catch (error: any) {
       console.error("Email Login error:", error);
       setLoading(false); // Ensure loading is false on error
       throw error; // Re-throw for component handling (e.g., display toast)
     } finally {
       // Loading state will be set to false by the onAuthStateChanged listener
     }
   };

   const signupWithEmail = async (name: string, email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // Update the user's profile with the name
        await updateProfile(userCredential.user, { displayName: name });
        // Reload user to get the updated info (optional, onAuthStateChanged might catch it)
        // await userCredential.user.reload();
        console.log(`Email signup successful:`, userCredential.user.uid);
        // handleSuccessfulLogin is called by onAuthStateChanged listener after signup
        return userCredential.user; // Return the newly created user
    } catch (error: any) {
        console.error("Email Signup error:", error);
        setLoading(false);
        throw error; // Re-throw for component handling
    } finally {
       // Loading state will be set to false by the onAuthStateChanged listener
    }
  };


  const loginWithGoogle = () => loginWithProvider(new GoogleAuthProvider());
  const loginWithMicrosoft = () => loginWithProvider(new OAuthProvider('microsoft.com'));
  const loginWithFacebook = () => loginWithProvider(new FacebookAuthProvider());
  const loginWithTwitter = () => loginWithProvider(new TwitterAuthProvider());

  const logout = async () => {
    setLoading(true); // Indicate loading during logout
    try {
      await signOut(auth);
      // State updates (user=null, communityProfileExists=false) handled by onAuthStateChanged
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false); // Ensure loading is false on error
    } finally {
        // setLoading will be set to false by onAuthStateChanged eventually
    }
  };

  const joinCommunity = async () => {
    if (!user || communityProfileExists === true || communityProfileExists === null) {
      console.log("Cannot join community: No user, already joined, or currently checking.");
      if (!user) throw new Error("User must be logged in to join the community.");
      if (communityProfileExists === true) throw new Error("User already has a community profile.");
      if (communityProfileExists === null) throw new Error("Still checking profile status.");
      return;
    }
    setLoading(true);
    try {
      const profileRef = doc(db, 'communityProfiles', user.uid);
      const username = generateUsername("-", 3, 15); // Generate initial pseudonymous username
      const profileData = {
        userId: user.uid, // Link to the main auth user ID
        displayName: username, // Use generated name
        bio: `Hello! I'm new to the ConnectPro community.`,
        createdAt: serverTimestamp(), // Use server timestamp
        // Add other default community profile fields if needed
      };
      await setDoc(profileRef, profileData);
      setCommunityProfileExists(true); // Update state
      console.log(`Community profile created for ${user.uid} with username ${username}`);
    } catch (error) {
      console.error("Error creating community profile:", error);
      setLoading(false); // Ensure loading stops on error
      throw error; // Re-throw error for component to handle
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
    loginWithEmail, // Added email login
    signupWithEmail, // Added email signup
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
