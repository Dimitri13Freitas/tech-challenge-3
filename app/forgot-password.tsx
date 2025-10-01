import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import { BytebankTextInputController } from "@/components/ui/text-input/text-input-controller";
import { BytebankText } from "@/components/ui/text/text";
import { auth } from "@/constants/firebase";
import { useSnackbar } from "@/contexts/SnackBarContext";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPassword() {
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm<ForgotPasswordForm>();
  const { showMessage } = useSnackbar();
  const [visible, setVisible] = useState<boolean>(false);

  async function onSubmit(data: ForgotPasswordForm) {
    try {
      await sendPasswordResetEmail(auth, data.email);
      showMessage("Email de recuperação enviado!", "success");
    } catch (err) {
      showMessage("Erro ao enviar email de recuperação", "warning");
    }
  }

  return (
    <>
      <View
        style={{
          backgroundColor: colors.primaryContainer,
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: 15,
        }}
      >
        <BytebankText
          variant="titleMedium"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Recuperar senha
        </BytebankText>
      </View>
      <Container>
        <BytebankTextInputController
          control={control}
          name="email"
          label="Email"
          placeholder="Digite seu email cadastrado"
          rules={{
            required: "Informe seu email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Digite um email válido",
            },
          }}
        />

        <BytebankButton onPress={handleSubmit(onSubmit)}>
          Enviar link de recuperação
        </BytebankButton>
        <BytebankText style={{ textAlign: "center", marginTop: 20 }}>
          Caso não receba o email verifique antes sua caixa de spam.
        </BytebankText>

        <BytebankButton
          style={{ backgroundColor: colors.background, marginTop: 26 }}
          mode="outlined"
          onPress={() => {
            router.push("/login");
          }}
          icon="arrow-left"
        >
          Voltar ao login
        </BytebankButton>
      </Container>
    </>
  );
}
