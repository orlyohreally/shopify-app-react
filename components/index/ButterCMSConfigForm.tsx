import React, { useState, useCallback } from "react";
import {
  Form,
  FormLayout,
  Link,
  Select,
  TextField,
  Checkbox,
} from "@shopify/polaris";

function ButterCMSConfigForm(props) {
  const [form, setForm] = useState({
    butterCMSToken: "",
  });
  const [errors, setErrors] = useState({
    butterCMSToken: "",
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
    // setErrors({
    // });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          value={form.butterCMSToken}
          error={errors.butterCMSToken}
          onChange={(val) => handleFormChange(val, "butterCMSToken")}
          label="ButterCMS token"
          type="text"
          helpText={
            <span>
              Go to <Link url="bvhsbvks">settings</Link> to get ButterCMS token
            </span>
          }
        />
      </FormLayout>
    </Form>
  );
}

export default ButterCMSConfigForm;
