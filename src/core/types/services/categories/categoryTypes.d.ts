export interface Category {
  id: string;
  userId?: string;
  color?: string;
  isCustom: boolean;
  name: string;
  type: "expense" | "income";
}
export interface CombinedCategoriesResult {
  categories: Category[];
  lastStandardDoc: QueryDocumentSnapshot<DocumentData> | null;
  lastUserDoc: QueryDocumentSnapshot<DocumentData> | null;
}
