import React, { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../components/Input";

import "./styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div id="page-login">
      <div className="page-login-logo" />

      <div className="page-login-form">
        <form>
          <h2>Fazer login</h2>
          <Input
            typeinput="text"
            name="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            typeinput="password"
            name="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="remember-password">
            <input type="checkbox" id="remember-check" name="remember-check" />
            <label htmlFor="remember-check">Lembrar senha</label>
            <a href="">Esqueci minha senha</a>
          </div>
          <button
            className={password && email ? "active" : "disabled"}
            disabled={email.length <= 1 && password.length <= 1}
            type="submit"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
