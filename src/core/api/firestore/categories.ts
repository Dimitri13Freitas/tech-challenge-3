import { db } from "@core/firebase/config";
import { Category, CombinedCategoriesResult } from "@core/types/services";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";

export const getCombinedCategoriesService = async (
  userId: string,
  type: "expense" | "income" | "all" = "expense",
  pageSize: number = 10,
  lastStandardDoc?: QueryDocumentSnapshot<DocumentData> | null,
  lastUserDoc?: QueryDocumentSnapshot<DocumentData> | null,
): Promise<CombinedCategoriesResult> => {
  try {
    const standardRef = collection(db, "standardCategories");

    let standardQuery =
      type === "all"
        ? query(standardRef, orderBy("name"), limit(pageSize))
        : query(
            standardRef,
            where("type", "==", type),
            orderBy("name"),
            limit(pageSize),
          );

    if (lastStandardDoc) {
      standardQuery = query(
        standardRef,
        ...(type === "all" ? [] : [where("type", "==", type)]),
        orderBy("name"),
        startAfter(lastStandardDoc),
        limit(pageSize),
      );
    }

    const standardSnapshot = await getDocs(standardQuery);
    const standardCategories: Category[] = standardSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id" | "isCustom">),
      isCustom: false,
    }));

    const newLastStandardDoc =
      standardSnapshot.docs[standardSnapshot.docs.length - 1] || null;

    const userRef = collection(db, "categories");

    const userFilters = [where("userId", "==", userId)];
    if (type !== "all") {
      userFilters.push(where("type", "==", type));
    }

    let userQuery = query(
      userRef,
      ...userFilters,
      orderBy("name"),
      limit(pageSize),
    );

    if (lastUserDoc) {
      userQuery = query(
        userRef,
        ...userFilters,
        orderBy("name"),
        startAfter(lastUserDoc),
        limit(pageSize),
      );
    }

    const userSnapshot = await getDocs(userQuery);
    const userCategories: Category[] = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id" | "isCustom">),
      isCustom: true,
    }));

    const newLastUserDoc =
      userSnapshot.docs[userSnapshot.docs.length - 1] || null;
    return {
      categories: [...standardCategories, ...userCategories],
      lastStandardDoc: newLastStandardDoc,
      lastUserDoc: newLastUserDoc,
    };
  } catch (error) {
    console.error("Erro ao buscar categorias combinadas: ", error);
    return { categories: [], lastStandardDoc: null, lastUserDoc: null };
  }
};
