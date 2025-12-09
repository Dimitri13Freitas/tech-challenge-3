import { formatCurrencyBR } from "@core/utils";
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
  type?: "text" | "password" | "currency" | "number";
  rules?: RegisterOptions<T, Path<T>>;
  [key: string]: any;
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
          displayedValue = formatCurrencyBR(value, { removeSymbol: true });
        } else if (type === "number") {
          displayedValue = String(value ?? "");
        } else {
          displayedValue = String(value ?? "");
        }

        return (
          <BytebankTextInput
            label={label}
            placeholder={placeholder}
            type={type}
            value={displayedValue}
            onChangeText={(text: string) => {
              if (type === "currency") {
                const raw = text.replace(/[^0-9]/g, "");
                if (raw.length === 0) {
                  onChange(0);
                  return;
                }
                const numericValue = Number(raw) / 100;
                onChange(numericValue);
              } else if (type === "number") {
                const raw = text.replace(/[^0-9]/g, "");
                const numericValue = parseInt(raw, 10);
                onChange(raw.length === 0 ? "" : numericValue);
              } else {
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
