import { BytebankText } from "@core/components";
import { useGlobalBottomSheet } from "@core/hooks";
import { Transaction } from "@core/types/services";
import { formatTransactionDate } from "@core/utils";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { EditTransactionSheet } from "./edit-transaction-sheet";

export const TransactionItem = ({
  transaction,
  onUpdate,
}: {
  transaction: Transaction;
  onUpdate?: () => void;
}) => {
  const { colors } = useTheme();
  const { open } = useGlobalBottomSheet();
  const isExpense = transaction.type === "expense";

  function handleOpen(transaction: Transaction) {
    open({
      snapPoints: ["80%"],
      content: (
        <EditTransactionSheet transaction={transaction} onUpdate={onUpdate} />
      ),
    });
  }

  return (
    <TouchableOpacity
      style={{
        borderRadius: 12,
        marginBottom: 10,
        padding: 16,
        elevation: 2,
        backgroundColor: colors.elevation.level3,
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      }}
      onPress={() => handleOpen(transaction)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <BytebankText
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.onSurface,
            }}
          >
            {transaction.category.name}
          </BytebankText>
          <BytebankText
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.onSurface,
              marginBottom: 8,
            }}
          >
            {transaction.paymentMethod}
          </BytebankText>
          <BytebankText
            style={{
              fontSize: 12,
              color: colors.onSurfaceVariant,
            }}
          >
            {formatTransactionDate(transaction.date)}
          </BytebankText>
        </View>
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <BytebankText
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: isExpense ? colors.error : colors.primary,
            }}
          >
            {isExpense ? "-" : "+"}R${" "}
            {parseFloat("" + transaction.valor)
              .toFixed(2)
              .replace(".", ",")}
          </BytebankText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
