import {
  AuthRepository,
  BalanceRepository,
  CardRepository,
  CategoryRepository,
  PaymentMethodRepository,
  TransactionRepository,
} from "@data/repositories";
import {
  AddCardUseCase,
  AddCategoryUseCase,
  AddTransactionUseCase,
  FetchCategoriesUseCase,
  ForgotPasswordUseCase,
  GetCardsUseCase,
  GetExpensesByCategoryUseCase,
  GetMonthlySummaryUseCase,
  GetTransactionsByMonthUseCase,
  RemoveCategoryUseCase,
  SignInUseCase,
  SignOutUseCase,
  SignUpUseCase,
  ToggleCardBlockedStatusUseCase,
  UpdateCardUseCase,
  UpdateTransactionUseCase,
} from "@domain/usecases";

const categoryRepository = new CategoryRepository();
const transactionRepository = new TransactionRepository();
const cardRepository = new CardRepository();
const paymentMethodRepository = new PaymentMethodRepository();
const balanceRepository = new BalanceRepository();
const authRepository = new AuthRepository();

export const fetchCategoriesUseCase = new FetchCategoriesUseCase(
  categoryRepository,
);
export const addCategoryUseCase = new AddCategoryUseCase(categoryRepository);
export const removeCategoryUseCase = new RemoveCategoryUseCase(
  categoryRepository,
);

export const addTransactionUseCase = new AddTransactionUseCase(
  transactionRepository,
);
export const updateTransactionUseCase = new UpdateTransactionUseCase(
  transactionRepository,
);
export const getTransactionsByMonthUseCase = new GetTransactionsByMonthUseCase(
  transactionRepository,
);

export const getMonthlySummaryUseCase = new GetMonthlySummaryUseCase(
  transactionRepository,
);

export const getCardsUseCase = new GetCardsUseCase(cardRepository);
export const addCardUseCase = new AddCardUseCase(cardRepository);
export const updateCardUseCase = new UpdateCardUseCase(cardRepository);
export const toggleCardBlockedStatusUseCase =
  new ToggleCardBlockedStatusUseCase(cardRepository);

export const signInUseCase = new SignInUseCase(authRepository);
export const signUpUseCase = new SignUpUseCase(authRepository);
export const signOutUseCase = new SignOutUseCase(authRepository);
export const forgotPasswordUseCase = new ForgotPasswordUseCase(authRepository);

export const getExpensesByCategoryUseCase = new GetExpensesByCategoryUseCase(
  categoryRepository,
  transactionRepository,
);

export { authRepository, balanceRepository, paymentMethodRepository };
