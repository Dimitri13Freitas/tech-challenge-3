import { db } from "@core/firebase/config";
import { PaymentMethod } from "@domain/entities";
import { IPaymentMethodRepository } from "@domain/repositories";
import { collection, getDocs, query, where } from "firebase/firestore";

export class PaymentMethodRepository implements IPaymentMethodRepository {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const q = query(collection(db, "paymentMethods"));

      const querySnapshot = await getDocs(q);

      const methods = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return PaymentMethod.create(doc.id, data.name, data.type);
      });

      return methods;
    } catch (error) {
      console.error("Erro ao buscar métodos de pagamento:", error);
      return [];
    }
  }

  async getPaymentMethodsByType(
    type: "income" | "expense",
  ): Promise<PaymentMethod[]> {
    try {
      const q = query(
        collection(db, "paymentMethods"),
        where("type", "==", type),
      );

      const querySnapshot = await getDocs(q);

      const methods = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return PaymentMethod.create(doc.id, data.name, data.type);
      });

      return methods;
    } catch (error) {
      console.error("Erro ao buscar métodos de pagamento por tipo:", error);
      return [];
    }
  }
}


