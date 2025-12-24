import { BytebankText } from "@core/components";
import { useGlobalBottomSheet } from "@core/hooks";
import { PaymentMethod } from "@core/types/services/paymentMethods/paymentMethodsTypes";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

interface PaymentMethodSelectorSheetProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod?: string;
  onSelect: (method: string) => void;
}

export const PaymentMethodSelectorSheet = ({
  paymentMethods,
  selectedPaymentMethod,
  onSelect,
}: PaymentMethodSelectorSheetProps) => {
  const { colors } = useTheme();
  const { close } = useGlobalBottomSheet();

  const handleSelect = (method: string) => {
    onSelect(method);
    close();
  };

  return (
    <View>
      <BytebankText
        variant="titleLarge"
        style={{ fontWeight: "bold", marginBottom: 16 }}
      >
        Selecione um método de pagamento:
      </BytebankText>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item.name)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor:
                selectedPaymentMethod === item.name
                  ? colors.primaryContainer
                  : colors.surface,
              marginBottom: 8,
              borderWidth: selectedPaymentMethod === item.name ? 1 : 0,
              borderColor:
                selectedPaymentMethod === item.name
                  ? colors.primary
                  : "transparent",
            }}
          >
            <View>
              <BytebankText
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color:
                    selectedPaymentMethod === item.name
                      ? colors.primary
                      : colors.onSurface,
                }}
              >
                {item.name}
              </BytebankText>
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
            Nenhum método de pagamento disponível
          </BytebankText>
        )}
      />
    </View>
  );
};

