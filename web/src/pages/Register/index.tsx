import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Input from "../../components/Input";

import logoImg from "../../assets/images/logo.svg";
import backIcon from "../../assets/images/icons/back.svg";

import "./styles.css";

function Register() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div id="page-register">
      <div className="page-register-logo" />
      <div className="page-register-form">
        <div className="top-bar-register">
          <Link to="/home">
            <img src={backIcon} alt="Voltar" />
          </Link>

          <img src={logoImg} alt="Proffy" />
        </div>

        <form>
          <h2>Cadastro</h2>
          <legend>Preencha os dados abaixo para começar.</legend>

          <Input
            typeinput="text"
            name="name"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            typeinput="text"
            name="lastname"
            label="Sobrenome"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
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
          <button
            className={password && email ? "active" : "disabled"}
            disabled={email.length <= 1 && password.length <= 1}
            type="submit"
          >
            Concluir cadastro
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
