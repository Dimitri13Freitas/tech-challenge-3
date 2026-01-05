import {
  authRepository,
  signInUseCase,
  signOutUseCase,
  signUpUseCase,
} from "@infrastructure/di/useCases";

/**
 * Wrapper de compatibilidade para manter a interface antiga do firebaseAuthService
 * Usa os use cases internamente
 */
export const firebaseAuthService = {
  signIn: async (email: string, password: string) => {
    await signInUseCase.execute({ email, password });
  },

  signUp: async (email: string, password: string, name: string) => {
    return await signUpUseCase.execute({ email, password, name });
  },

  signOut: async () => {
    await signOutUseCase.execute();
  },

  onAuthChanged: (callback: (user: any) => void) => {
    return authRepository.onAuthStateChanged((domainUser) => {
      const firebaseUser = domainUser
        ? ({
            uid: domainUser.uid,
            email: domainUser.email,
            displayName: domainUser.displayName,
            emailVerified: domainUser.emailVerified,
          } as any)
        : null;
      callback(firebaseUser);
    });
  },
};
