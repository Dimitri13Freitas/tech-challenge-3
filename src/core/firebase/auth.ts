import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { createUserProfile } from "../api/firestore/user.api";
import { auth } from "./config";

export const firebaseAuthService = {
  signUp: async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const { user } = userCredential;
    await updateProfile(user, { displayName: name });

    if (user.email) await createUserProfile(user.uid, user.email);

    return user;
  },

  signIn: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  },

  signOut: () => signOut(auth),

  onAuthChanged: (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback),
};
