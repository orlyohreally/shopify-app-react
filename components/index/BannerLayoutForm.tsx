import React, { useState, useCallback } from "react";
import {
  Form,
  FormLayout,
  Link,
  Select,
  TextField,
  Checkbox,
} from "@shopify/polaris";

function BannerLayoutForm(props) {
  console.log("BannerLayoutForm", { props });
  const [form, setForm] = useState({
    position: "ORDER_STATUS",
  });
  const [errors, setErrors] = useState({
    position: "",
  });

  const handleFormChange = useCallback(
    (value, field) => {
      console.log("handleFieldsChange", value, form);
      setForm({ ...form, [field]: value });
      props.formUpdated({ value, field });
    },
    [form]
  );

  const handleSubmit = useCallback(
    (_event) => {
      console.log({ form });
      validateForm();
    },
    [form]
  );

  const validateForm = () => {
    setErrors({
      position: "333",
    });
  };

  const options = [
    { label: "Center", value: "center" },
    { label: "Bottom", value: "bottom" },
    { label: "Top", value: "top" },
    { label: "Defined by page content", value: "custom" },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <Select
          label="Banner position"
          error={errors.position}
          options={options}
          onChange={(val) => handleFormChange(val, "position")}
          value={form.position}
        />
      </FormLayout>
    </Form>
  );
}

export default BannerLayoutForm;
