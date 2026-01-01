import {
  BytebankButton,
  BytebankCard,
  BytebankText,
  Container,
} from "@/src/core/components";
import { useAppStore } from "@/src/store/useAppStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Avatar, Divider, useTheme } from "react-native-paper";

export default function UserScreen() {
  const { user, logout } = useAppStore();
  const { colors } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Confirmar saída",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logout();
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
              Alert.alert(
                "Erro",
                "Não foi possível fazer logout. Tente novamente.",
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <Container scrollable={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: "center",
            marginBottom: 32,
            marginTop: 20,
          }}
        >
          <Avatar.Text
            size={120}
            label={getInitials(user?.displayName || user?.email)}
            style={{
              backgroundColor: colors.primary,
            }}
            labelStyle={{
              fontSize: 48,
              color: colors.onPrimary,
            }}
          />
          <BytebankText
            variant="headlineSmall"
            style={{
              marginTop: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {user?.displayName || "Usuário"}
          </BytebankText>
          {user?.email && (
            <BytebankText
              variant="bodyMedium"
              style={{
                marginTop: 4,
                color: colors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {user.email}
            </BytebankText>
          )}
        </View>

        <BytebankCard style={{ marginBottom: 16 }}>
          <View style={{ padding: 16 }}>
            <BytebankText
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Informações da Conta
            </BytebankText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <BytebankText
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
                >
                  Nome
                </BytebankText>
                <BytebankText variant="bodyLarge">
                  {user?.displayName || "Não informado"}
                </BytebankText>
              </View>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons
                name="email"
                size={24}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <BytebankText
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
                >
                  E-mail
                </BytebankText>
                <BytebankText variant="bodyLarge">
                  {user?.email || "-"}
                </BytebankText>
              </View>
            </View>

            {user?.emailVerified !== undefined && (
              <>
                <Divider style={{ marginVertical: 12 }} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name={user.emailVerified ? "check-circle" : "alert-circle"}
                    size={24}
                    color={user.emailVerified ? colors.primary : colors.error}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <BytebankText
                      variant="bodySmall"
                      style={{
                        color: colors.onSurfaceVariant,
                        marginBottom: 4,
                      }}
                    >
                      Verificação de E-mail
                    </BytebankText>
                    <BytebankText
                      variant="bodyLarge"
                      style={{
                        color: user.emailVerified
                          ? colors.primary
                          : colors.error,
                      }}
                    >
                      {user.emailVerified
                        ? "E-mail verificado"
                        : "E-mail não verificado"}
                    </BytebankText>
                  </View>
                </View>
              </>
            )}
          </View>
        </BytebankCard>

        {user?.metadata && (
          <BytebankCard style={{ marginBottom: 16 }}>
            <View style={{ padding: 16 }}>
              <BytebankText
                variant="titleMedium"
                style={{
                  fontWeight: "bold",
                  marginBottom: 16,
                }}
              >
                Informações Adicionais
              </BytebankText>

              {user.metadata.creationTime && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <MaterialCommunityIcons
                    name="calendar-plus"
                    size={24}
                    color={colors.primary}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <BytebankText
                      variant="bodySmall"
                      style={{
                        color: colors.onSurfaceVariant,
                        marginBottom: 4,
                      }}
                    >
                      Conta criada em
                    </BytebankText>
                    <BytebankText variant="bodyLarge">
                      {new Date(user.metadata.creationTime).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </BytebankText>
                  </View>
                </View>
              )}

              {user.metadata.lastSignInTime && (
                <>
                  <Divider style={{ marginVertical: 12 }} />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={24}
                      color={colors.primary}
                      style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <BytebankText
                        variant="bodySmall"
                        style={{
                          color: colors.onSurfaceVariant,
                          marginBottom: 4,
                        }}
                      >
                        Último acesso
                      </BytebankText>
                      <BytebankText variant="bodyLarge">
                        {new Date(
                          user.metadata.lastSignInTime,
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </BytebankText>
                    </View>
                  </View>
                </>
              )}
            </View>
          </BytebankCard>
        )}

        <BytebankButton
          mode="contained"
          onPress={handleLogout}
          loading={loggingOut}
          disabled={loggingOut}
          buttonColor={colors.error}
          textColor={colors.onError}
          style={{
            marginTop: 24,
            marginBottom: 32,
          }}
          icon={() => (
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={colors.onError}
            />
          )}
        >
          {loggingOut ? "Saindo..." : "Sair da Conta"}
        </BytebankButton>
      </ScrollView>
    </Container>
  );
}
