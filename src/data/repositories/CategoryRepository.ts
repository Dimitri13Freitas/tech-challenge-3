import { db } from "@core/firebase/config";
import { Category, CategoryType } from "@domain/entities";
import {
  FetchCategoriesResult,
  ICategoryRepository,
  PaginationCursor,
} from "@domain/repositories";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

export class CategoryRepository implements ICategoryRepository {
  async fetchCategories(
    userId: string,
    type: CategoryType | "all",
    pageSize: number,
    cursor?: PaginationCursor,
  ): Promise<FetchCategoriesResult> {
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

      const lastStandardDoc = cursor?.lastStandardDoc as
        | QueryDocumentSnapshot<DocumentData>
        | undefined;

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
      const standardCategories: Category[] = standardSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return Category.create(
            doc.id,
            data.name,
            false,
            data.type,
            data.color || "#9E9E9E",
          );
        },
      );

      const newLastStandardDoc =
        standardSnapshot.docs[standardSnapshot.docs.length - 1] || null;

      const userRef = collection(db, "categories");

      const userFilters = [where("userId", "==", userId)];
      if (type !== "all") {
        userFilters.push(where("type", "==", type));
      }

      const lastUserDoc = cursor?.lastUserDoc as
        | QueryDocumentSnapshot<DocumentData>
        | undefined;

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
      const userCategories: Category[] = userSnapshot.docs.map((doc) => {
        const data = doc.data();
        return Category.create(
          doc.id,
          data.name,
          true,
          data.type,
          data.color || "#9E9E9E",
          userId,
        );
      });

      const newLastUserDoc =
        userSnapshot.docs[userSnapshot.docs.length - 1] || null;

      const allCategories = [...standardCategories, ...userCategories];

      return {
        categories: allCategories,
        pagination: {
          lastStandardDoc: newLastStandardDoc,
          lastUserDoc: newLastUserDoc,
        },
        hasMore: Boolean(newLastStandardDoc) || Boolean(newLastUserDoc),
      };
    } catch (error) {
      console.error("Erro ao buscar categorias combinadas: ", error);
      return {
        categories: [],
        pagination: { lastStandardDoc: null, lastUserDoc: null },
        hasMore: false,
      };
    }
  }

  async addCategory(
    userId: string,
    name: string,
    color: string,
    type: CategoryType,
  ): Promise<Category> {
    try {
      const userCategoriesRef = collection(db, "categories");

      const docRef = await addDoc(userCategoriesRef, {
        userId: userId,
        name: name,
        color: color,
        type: type,
        createdAt: new Date(),
      });

      return Category.create(docRef.id, name, true, type, color, userId);
    } catch (error) {
      console.error("Erro ao adicionar categoria customizada: ", error);
      throw new Error(
        "Não foi possível adicionar a categoria ao banco de dados.",
      );
    }
  }

  async updateCategory(
    categoryId: string,
    name: string,
    color: string,
    type: CategoryType,
  ): Promise<Category> {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await updateDoc(categoryRef, {
        name: name,
        color: color,
        type: type,
        updatedAt: new Date(),
      });

      // Buscar o userId do documento atualizado
      const categoryDoc = await getDoc(categoryRef);
      const data = categoryDoc.data();

      if (!data) {
        throw new Error("Categoria não encontrada após atualização");
      }

      return Category.create(
        categoryId,
        name,
        true,
        type,
        color,
        data.userId,
      );
    } catch (error) {
      console.error("Erro ao atualizar categoria customizada: ", error);
      throw new Error(
        "Não foi possível atualizar a categoria no banco de dados.",
      );
    }
  }

  async removeCategory(categoryId: string): Promise<void> {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error("Erro ao remover categoria customizada: ", error);
      throw new Error(
        "Não foi possível remover a categoria do banco de dados.",
      );
    }
  }
}
