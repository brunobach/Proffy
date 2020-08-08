import React, { InputHTMLAttributes } from "react";

import "./styles.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  typeinput?: string;
}

const Input: React.FC<InputProps> = ({typeinput, label, name, ...rest }) => {
  return (
    <div className="input-block">
      <label htmlFor={name}>{label}</label>
      <input type={typeinput} id={name} {...rest} />
    </div>
  );
};

export default Input;
