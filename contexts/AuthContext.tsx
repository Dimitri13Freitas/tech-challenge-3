// import { auth } from "@/constants/firebase";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { User, onAuthStateChanged, signOut } from "firebase/auth";
// import React, { createContext, useContext, useEffect, useState } from "react";

// interface AuthContextProps {
//   user: User | null;
//   loading: boolean;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextProps>({
//   user: null,
//   loading: true,
//   logout: async () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         await AsyncStorage.setItem("@user", JSON.stringify(firebaseUser));
//       } else {
//         setUser(null);
//         await AsyncStorage.removeItem("@user");
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//     await AsyncStorage.removeItem("@user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
