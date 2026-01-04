import { Category as LegacyCategory } from "@core/types/services/categories/categoryTypes";
import { Category as DomainCategory } from "@domain/entities";

/**
 * Converte uma entidade de domínio Category para o tipo legado usado pelos componentes
 */
export function domainCategoryToLegacy(
  domainCategory: DomainCategory,
): LegacyCategory {
  return {
    id: domainCategory.id,
    name: domainCategory.name,
    type: domainCategory.type,
    color: domainCategory.color,
    isCustom: domainCategory.isCustom,
    userId: domainCategory.userId,
  };
}

/**
 * Converte um array de entidades de domínio Category para o tipo legado
 */
export function domainCategoriesToLegacy(
  domainCategories: DomainCategory[],
): LegacyCategory[] {
  return domainCategories.map(domainCategoryToLegacy);
}

