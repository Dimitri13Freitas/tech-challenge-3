import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { BytebankTextInput } from "./text-input";

interface BytebankTextInputControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "currency" | "number"; // Adicionado currency e number
  rules?: RegisterOptions<T, Path<T>>;
  [key: string]: any;
}

// 1. Função de formatação BRL segura
function formatCurrencyBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }
  // Remove o símbolo "R$" e espaços para que o placeholder seja visível
  return value
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace("R$", "")
    .trim();
}

export function BytebankTextInputController<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  rules,
  ...props
}: BytebankTextInputControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        let displayedValue = "";

        if (type === "currency") {
          // Se for currency, formata o número para exibição (ex: "1.234,50")
          // O valor 'value' no RHF deve ser um number (ex: 1234.50)
          displayedValue = formatCurrencyBRL(value as number);
        } else if (type === "number") {
          // Para inputs numéricos puros (dueDate, closingDate), exibe o valor cru (ex: "10")
          displayedValue = String(value ?? "");
        } else {
          // Para 'text' e 'password', exibe o valor cru do RHF como string (CORRIGIDO)
          displayedValue = String(value ?? "");
        }

        return (
          <BytebankTextInput
            label={label}
            placeholder={placeholder}
            type={type}
            // Passa o valor formatado/convertido
            value={displayedValue}
            onChangeText={(text: string) => {
              if (type === "currency") {
                // 1. Limpa o texto, mantendo apenas dígitos
                const raw = text.replace(/[^0-9]/g, "");

                // 2. Trata a entrada vazia: salva 0 no formulário
                if (raw.length === 0) {
                  onChange(0);
                  return;
                }

                // 3. Converte centavos (string) para reais (number float)
                // Ex: "123" -> 1.23. Este é o valor "cru" que você precisa salvar.
                const numericValue = Number(raw) / 100;

                // 4. Salva o valor numérico limpo no react-hook-form
                onChange(numericValue);
              } else if (type === "number") {
                // Limpa para garantir apenas números para campos como dia
                const raw = text.replace(/[^0-9]/g, "");
                const numericValue = parseInt(raw, 10);

                // Salva como number se for válido, ou string vazia se o input estiver vazio
                onChange(raw.length === 0 ? "" : numericValue);
              } else {
                // CORREÇÃO: Para 'text' e 'password', salva o texto cru.
                onChange(text);
              }
            }}
            error={error?.message}
            keyboardType={
              type === "currency" || type === "number" ? "numeric" : "default"
            }
            {...props}
          />
        );
      }}
    />
  );
}
