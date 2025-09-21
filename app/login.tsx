import { BytebankButton } from "@/components/ui/button/button";
import Container from "@/components/ui/container/container";
import { BytebankTextInputController } from "@/components/ui/text-input/text-input-controller";
import { BytebankText } from "@/components/ui/text/text";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";

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
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>();

  const { colors } = useTheme();
  const [checked, setChecked] = useState(false);
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
            onPress={() => setChecked(!checked)}
          >
            <Checkbox status={checked ? "checked" : "unchecked"} />
            <BytebankText variant="titleMedium">Lembrar senha?</BytebankText>
          </TouchableOpacity>
        </View>
        <BytebankButton>Entrar</BytebankButton>
        <BytebankButton
          mode="outlined"
          onPress={() => router.push("/register")}
          style={{ backgroundColor: colors.background, marginTop: 16 }}
        >
          Criar conta
        </BytebankButton>
      </View>
    </Container>
  );
}
