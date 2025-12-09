export interface Card {
  id: string;
  userId: string;
  name: string;
  limit: number;
  blocked: boolean;
  dueDate: number;
  closingDate: number;
  createdAt: Timestamp;
}

export interface AddCardData {
  name: string;
  limit: number;
  dueDate: number;
  closingDate: number;
}
