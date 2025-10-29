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

  signIn: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),

  signOut: () => signOut(auth),

  onAuthChanged: (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback),
};
