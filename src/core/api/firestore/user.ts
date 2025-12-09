import { db } from "@core/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export const createUserProfileService = async (uid: string, email: string) => {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, {
      email: email,
      totalBalance: 0,
      createdAt: new Date(),
    });
    console.log("Documento do usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o documento do usuário: ", error);
  }
};
