import React, { useState, useCallback } from "react";
import {
  Form,
  FormLayout,
  Link,
  Select,
  TextField,
  Checkbox,
} from "@shopify/polaris";

function BannerConfigForm(props) {
  console.log({ props });
  const [form, setForm] = useState({
    pageSlug: props.pageSlug,
    displayScope: props.displayScope,
    active: props.active,
  });

  const [errors, setErrors] = useState({
    pageSlug: "",
    displayScope: "",
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
      pageSlug: "2222",
      displayScope: "333",
    });
  };

  const options = [
    { label: "All", value: "ALL" },
    { label: "Online store", value: "ONLINE_STORE" },
    { label: "Checkout page", value: "ORDER_STATUS" },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          value={props.pageSlug}
          error={errors.pageSlug}
          onChange={(val) => handleFormChange(val, "pageSlug")}
          label="Page slug from banner"
          type="text"
          helpText={
            <span>
              Set slug of the ButterCMS page that will be used as banner
            </span>
          }
        />
        <Select
          label="Banner location"
          error={errors.displayScope}
          options={options}
          onChange={(val) => handleFormChange(val, "displayScope")}
          value={props.displayScope}
          helpText={<span>Set where your banner will be shown</span>}
        />
        <Checkbox
          label="Display banner"
          checked={props.active}
          onChange={(val) => handleFormChange(val, "active")}
        />
      </FormLayout>
    </Form>
  );
}

export default BannerConfigForm;
