import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const FilePickerInput = ({
  value,
  placeholder = "Chọn file",
  onClick,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value) {
      if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('blob'))) {
        try {
          const url = new URL(value);
          setDisplayValue(decodeURIComponent(url.pathname.split("/").pop()));
        } catch {
          setDisplayValue(value);
        }
      } else {
         setDisplayValue(value);
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  return (
    <Form.Control
      type="text"
      value={displayValue}
      placeholder={placeholder}
      readOnly
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />
  );
};

export default FilePickerInput;
