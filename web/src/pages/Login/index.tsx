import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Input from "../../components/Input";
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';

import logoImg from "../../assets/images/logo.svg";

import "./styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");

  useEffect(() => {
    console.log(remember);
  }, [remember]);

  return (
    <div id="page-login">
      <div className="page-login-logo" />

      <div className="page-login-form">
      <div className="top-bar-login">
          <img src={logoImg} alt="Proffy" />
        </div>
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
            className="password-input"
          />

          <div className="remember-password">
            <input
              type="checkbox"
              id="remember-check"
              name="remember-check"
              onChange={(e) => setRemember(e.target.value)}
            />
            <label htmlFor="remember-check">Lembrar-me</label>
            <a href="">Esqueci minha senha</a>
          </div>
          <button
            className={password && email ? "active" : "disabled"}
            disabled={email.length <= 1 && password.length <= 1}
            type="submit"
          >
            Entrar
          </button>

          <div className="form-footer">
            <h2>Nao tem conta?</h2>
            <span>É de graça</span>
            <img src={purpleHeartIcon} alt="Coração Roxo" />
          </div>
          <Link to="/register">
          Cadastre-se Agora
          </Link>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
