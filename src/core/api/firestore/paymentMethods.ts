import { db } from "@core/firebase/config";
import { collection, getDocs, query } from "firebase/firestore";

export const getPaymentMethods = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "paymentMethods"));

    const querySnapshot = await getDocs(q);

    const methods = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
      };
    });

    return methods;
  } catch (error) {
    console.error("Erro ao buscar métodos de pagamento:", error);
    return [];
  }
};
