export interface Transaction {
  id: string;
  userId: string;
  valor: number;
  type: "expense" | "income";
  paymentMethod: string;
  category: {
    id: string;
    name: string;
    isCustom: boolean;
  };
  date: Date;
}
