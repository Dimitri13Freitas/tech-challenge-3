export interface Transaction {
  id: string;
  valor: string;
  type: "expense" | "income";
  paymentMethod: string;
  category: {
    id: string;
    name: string;
    isCustom: boolean;
  };
  date: Date;
}
