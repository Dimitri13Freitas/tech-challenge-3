import { BytebankText } from "@core/components";
import { useGlobalBottomSheet } from "@core/hooks";
import { Category } from "@core/types/services/categories/categoryTypes";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

interface CategorySelectorSheetProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (category: Category) => void;
}

export const CategorySelectorSheet = ({
  categories,
  selectedCategoryId,
  onSelect,
}: CategorySelectorSheetProps) => {
  const { colors } = useTheme();
  const { close } = useGlobalBottomSheet();

  const handleSelect = (category: Category) => {
    onSelect(category);
    close();
  };

  return (
    <View>
      <BytebankText
        variant="titleLarge"
        style={{ fontWeight: "bold", marginBottom: 16 }}
      >
        Selecione uma categoria:
      </BytebankText>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor:
                selectedCategoryId === item.id
                  ? colors.primaryContainer
                  : colors.surface,
              marginBottom: 8,
              borderWidth: selectedCategoryId === item.id ? 1 : 0,
              borderColor:
                selectedCategoryId === item.id ? colors.primary : "transparent",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BytebankText
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color:
                    selectedCategoryId === item.id
                      ? colors.primary
                      : colors.onSurface,
                }}
              >
                {item.name}
              </BytebankText>
              {item.isCustom && (
                <BytebankText
                  style={{
                    fontSize: 10,
                    color: colors.primary,
                    backgroundColor: colors.primaryContainer,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  PERSONALIZADA
                </BytebankText>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <BytebankText
            style={{
              textAlign: "center",
              color: colors.onSurfaceVariant,
              marginTop: 16,
            }}
          >
            Nenhuma categoria disponível
          </BytebankText>
        )}
      />
    </View>
  );
};


