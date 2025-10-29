import { useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import React from "react";

export default function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack
      initialRouteName={user ? "(tabs)" : "(auth)/login"}
      screenOptions={{ headerShown: false, animation: "default" }}
    >
      {user ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <>
          <Stack.Screen name="(auth)" />
        </>
      )}
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="manage-cards" />
      <Stack.Screen name="create-category" />
    </Stack>
  );
}
