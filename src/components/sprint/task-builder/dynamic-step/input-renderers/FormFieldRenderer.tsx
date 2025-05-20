
import React from "react";
import { FormField } from "@/types/task-builder";
import { TextInputRenderer } from "./TextInputRenderer";
import { SelectInputRenderer } from "./SelectInputRenderer";
import { RadioInputRenderer } from "./RadioInputRenderer";
import { CheckboxInputRenderer } from "./CheckboxInputRenderer";

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
}) => {
  switch (field.type) {
    case "text":
      return (
        <TextInputRenderer
          id={field.id}
          label={field.label}
          value={value || ""}
          type="text"
          placeholder={field.placeholder}
          onChange={onChange}
        />
      );

    case "textarea":
      return (
        <TextInputRenderer
          id={field.id}
          label={field.label}
          value={value || ""}
          type="textarea"
          placeholder={field.placeholder}
          onChange={onChange}
        />
      );

    case "select":
      return (
        <SelectInputRenderer
          id={field.id}
          label={field.label}
          value={value || ""}
          options={field.options}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      );

    case "radio":
      return (
        <RadioInputRenderer
          id={field.id}
          label={field.label}
          value={value || ""}
          options={field.options}
          onChange={onChange}
        />
      );

    case "checkbox":
      return (
        <CheckboxInputRenderer
          id={field.id}
          label={field.label}
          value={Boolean(value)}
          isSingle={true}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
};
