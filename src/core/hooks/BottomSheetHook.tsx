import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "react-native-paper";

type BottomSheetOptions = {
  content: React.ReactNode;
  snapPoints?: (string | number)[];
};

type BottomSheetContextData = {
  open: (options: BottomSheetOptions) => void;
  close: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextData>(
  {} as BottomSheetContextData,
);

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [content, setContent] = useState<React.ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState<(string | number)[]>(["65%"]);

  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const open = useCallback(({ content, snapPoints }: BottomSheetOptions) => {
    if (snapPoints) {
      setSnapPoints(snapPoints);
    }
    setContent(content);

    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 100);
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const value = useMemo(
    () => ({
      open,
      close,
    }),
    [open, close],
  );

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
      <BottomSheet
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        ref={bottomSheetRef}
        index={-1}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.2}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
        backgroundStyle={{
          backgroundColor: colors.surfaceVariant,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          {content}
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useGlobalBottomSheet = () => {
  return useContext(BottomSheetContext);
};
