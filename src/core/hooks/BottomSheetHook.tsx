import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

interface BottomSheetContextType {
  openBottomSheet: (content: React.ReactNode, onClose?: () => void) => void;
  closeBottomSheet: () => void;
  isOpen: boolean;
}

interface BottomSheetProviderProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const BottomSheetProvider = ({
  children,
  snapPoints = ["98%"],
}: BottomSheetProviderProps) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const memoizedSnapPoints = React.useMemo(() => snapPoints, [snapPoints]);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const openBottomSheet = useCallback(
    (newContent: React.ReactNode, onClose?: () => void) => {
      setContent(newContent);
      setOnCloseCallback(() => onClose || null);
      setIsOpen(true);
      bottomSheetRef.current?.expand();
    },
    [],
  );

  const closeBottomSheet = useCallback(() => {
    console.log(
      "closeBottomSheet chamado, onCloseCallback existe:",
      !!onCloseCallback,
    );
    // Executa o callback antes de fechar
    if (onCloseCallback) {
      console.log("Executando callback de fechamento");
      onCloseCallback();
      setOnCloseCallback(null);
    }
    setIsOpen(false);
    bottomSheetRef.current?.close();
  }, [onCloseCallback]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // BottomSheet foi fechado - sempre limpa o estado
        const callback = onCloseCallback;
        setOnCloseCallback(null);
        setContent(null);
        setIsOpen(false);

        // Executa o callback se existir
        if (callback) {
          callback();
        }
      } else if (index >= 0) {
        setIsOpen(true);
      }
    },
    [onCloseCallback],
  );

  return (
    <BottomSheetContext.Provider
      value={{ openBottomSheet, closeBottomSheet, isOpen }}
    >
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: colors.surfaceVariant,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>{content}</View>
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error(
      "useBottomSheet deve ser usado dentro de BottomSheetProvider",
    );
  }
  return context;
};
