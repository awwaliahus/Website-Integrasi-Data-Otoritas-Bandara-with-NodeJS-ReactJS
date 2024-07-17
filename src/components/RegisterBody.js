import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  width: 60vh;
  height: 100%;
  padding: 40px;
  border-radius: 10px;
  margin-top: 4%;
  margin-bottom: 3%;
  margin-left: 40%;
  background: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-left: 34%;
  margin-bottom: 10%;
  color: #333;
`;

const InputBox = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 90%;
  height: 40px;
  background: #f2f2f2;
  border: none;
  border-radius: 20px;
  padding: 0 40px 0 50px;
  font-size: 16px;
  color: #333;
`;

const Dropdown = styled.select`
  width: 90%;
  height: 40px;
  background: #f2f2f2;
  border: none;
  border-radius: 20px;
  padding: 0 40px 0 50px;
  font-size: 16px;
  color: #333;
`;

const Icon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #777;
  font-weight: bold;
`;

const Button = styled.button`
  width: 90%;
  height: 40px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(to right, #6a11cb, #00d2ff);
  }
`;

const MessageSuccess = styled.p`
  text-align: center;
  margin-right: 20px;
  margin-top: 20px;
  color: green;
`;

const MessageError = styled.p`
  text-align: center;
  margin-right: 20px;
  margin-top: 20px;
  color: red;
`;

const LoginRegisterLink = styled.p`
  text-align: left;
  font-size: 14px;
  margin-top: 20px;
`;

const StyledLink = styled(Link)`
  color: #2575fc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterBody = () => {
  const [nip, setNip] = useState("");
  const [unit, setUnit] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!nip || !unit || !nama || !password) {
      setMessageError("Semua field harus diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/user",
        {
          nip: nip,
          unit: unit,
          nama: nama,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessageError("");
      setMessageSuccess(response.data.message);
      setNip("");
      setNama("");
      setUnit("");
      setPassword("");
    } catch (error) {
      console.error("Error registering user: ", error);
      setMessageSuccess("");
      setMessageError(
        error.response?.data?.message || "Failed to register user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Title>Register</Title>
      <InputBox>
        <Input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <Icon className="fa fa-user"></Icon>
      </InputBox>
      <InputBox>
        <Input
          type="text"
          placeholder="NIP"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
        />
        <Icon className="fa fa-key"></Icon>
      </InputBox>
      <InputBox>
        <Dropdown value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="">-- Pilih --</option>
          <option value="Admin">Admin</option>
          <option value="Avsec">Avsec</option>
        </Dropdown>
        <Icon className="fa fa-building"></Icon>
      </InputBox>
      <InputBox>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Icon className="fa fa-lock"></Icon>
      </InputBox>
      <Button onClick={handleRegister} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Register"}
      </Button>
      {messageSuccess && <MessageSuccess>{messageSuccess}</MessageSuccess>}
      {messageError && <MessageError>{messageError}</MessageError>}
      <LoginRegisterLink>
        <StyledLink to="/login">Already have an account? Log in</StyledLink>
      </LoginRegisterLink>
    </Wrapper>
  );
};

export default RegisterBody;
