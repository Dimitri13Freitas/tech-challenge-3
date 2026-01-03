import {
  BytebankButton,
  BytebankText,
  BytebankTextInputController,
  Container,
} from "@/src/core/components";
import { useSnackbar } from "@/src/core/hooks";
import { signUpUseCase } from "@infrastructure/di/useCases";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmedPass: string;
};

export default function Register() {
  const { showMessage } = useSnackbar();
  const colorScheme = useColorScheme();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>();
  const { colors } = useTheme();
  async function onSubmit(data: RegisterFormData) {
    try {
      await signUpUseCase.execute({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      showMessage("Conta criada com sucesso!", "success");

      router.replace("/(tabs)/home");
    } catch (err: any) {
      showMessage(err.message || "Este usuário já possui cadastro!!", "warning");
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
          Crie sua conta no Bytebank
        </BytebankText>

        <BytebankTextInputController
          control={control}
          name="name"
          label="Nome"
          placeholder="Digite seu nome"
          rules={{ required: "Informe seu nome" }}
        />

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

        <BytebankTextInputController
          control={control}
          name="confirmedPass"
          label="Confirmar Senha"
          type="password"
          placeholder="Digite a senha novamente"
          rules={{
            required: "",
            minLength: {
              value: 6,
              message: "A senha deve ter no mínimo 6 caracteres",
            },
            validate: (value) =>
              value === watch("password") || "As senhas não conferem",
          }}
        />

        <View style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <BytebankButton
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </BytebankButton>
          <BytebankButton
            style={{ backgroundColor: colors.background }}
            mode="outlined"
            onPress={() => {
              if (!isSubmitting) router.push("/login");
            }}
            icon="arrow-left"
          >
            Voltar ao login
          </BytebankButton>
        </View>
      </View>
    </Container>
  );
}
