import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import { BytebankTextInputController } from "@/components/ui/text-input/text-input-controller";
import { BytebankText } from "@/components/ui/text/text";
import { auth } from "@/constants/firebase";
import { useSnackbar } from "@/contexts/SnackBarContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Pressable, useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

WebBrowser.maybeCompleteAuthSession();

type RegisterFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const colorScheme = useColorScheme();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>();
  const { colors } = useTheme();
  const { showMessage } = useSnackbar();

  async function onSubmit(data: RegisterFormData) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      router.replace("/(tabs)/add");
    } catch (err) {
      showMessage("Usuário ou senha incorretos", "warning");
    }
  }

  return (
    <Container>
      <View style={{ paddingTop: 32 }}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 250, height: 50 }}
        />
        <Image
          source={require("@/assets/images/pixels.png")}
          style={{
            width: 200,
            height: 200,
            position: "absolute",
            right: -20,
            top: 180,
            opacity: colorScheme === "dark" ? 0.2 : 0.8,
          }}
        />
        <Image
          source={require("@/assets/images/pixels.png")}
          style={{
            width: 200,
            height: 200,
            position: "absolute",
            left: -20,
            top: 480,
            opacity: colorScheme === "dark" ? 0.2 : 0.8,
            transform: [{ rotate: "90deg" }],
          }}
        />
        <BytebankText variant="titleLarge" style={{ marginVertical: 28 }}>
          Bem-vindo ao Bytebank! Faça login para acessar sua central financeira.
        </BytebankText>

        <BytebankTextInputController
          control={control}
          name="email"
          label="Email"
          placeholder="Digite seu email"
          rules={{
            required: "Informe seu email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Digite um email válido",
            },
          }}
        />

        <BytebankTextInputController
          control={control}
          name="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          rules={{
            required: "Informe sua senha",
            minLength: {
              value: 6,
              message: "A senha deve ter no mínimo 6 caracteres",
            },
          }}
        />

        <BytebankButton
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </BytebankButton>
        <BytebankButton
          mode="outlined"
          onPress={() => {
            if (!isSubmitting) router.push("/register");
          }}
          style={{ backgroundColor: colors.background, marginTop: 16 }}
        >
          Criar conta
        </BytebankButton>
        <Pressable onPress={() => router.push("/forgot-password")}>
          <BytebankText
            style={{
              color: colors.primary,
              marginTop: 16,
              fontWeight: "bold",
              textAlign: "center",
              textDecorationStyle: "solid",
              textDecorationLine: "underline",
              fontSize: 14,
            }}
          >
            Esqueci minha senha
          </BytebankText>
        </Pressable>
      </View>
    </Container>
  );
}
