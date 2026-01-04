import { PaymentMethod } from "@domain/entities";

export interface IPaymentMethodRepository {
  getPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethodsByType(type: "income" | "expense"): Promise<PaymentMethod[]>;
}
