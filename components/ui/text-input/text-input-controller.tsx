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
  type?: "text" | "password";
  rules?: RegisterOptions<T, Path<T>>;
}

export function BytebankTextInputController<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  rules,
}: BytebankTextInputControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <BytebankTextInput
          label={label}
          placeholder={placeholder}
          type={type}
          value={value}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  );
}
