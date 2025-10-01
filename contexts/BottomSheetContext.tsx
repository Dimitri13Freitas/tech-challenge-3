import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { createContext, useContext, useRef, useState } from "react";
import { useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

interface BottomSheetContextType {
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
}

interface BottomSheetProviderProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[]; // pontos opcionais
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const BottomSheetProvider = ({
  children,
  snapPoints = ["98%"], // valor padrão
}: BottomSheetProviderProps) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const memoizedSnapPoints = React.useMemo(() => snapPoints, [snapPoints]);
  const [content, setContent] = useState<React.ReactNode>(null);

  const openBottomSheet = (newContent: React.ReactNode) => {
    setContent(newContent);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose
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
