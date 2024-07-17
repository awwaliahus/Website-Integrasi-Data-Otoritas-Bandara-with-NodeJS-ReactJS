import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wrapper = styled.div`
  width: 60vh;
  height: 70vh;
  padding: 40px;
  border-radius: 10px;
  margin: auto;
  margin-top: 10%;
  background: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-left: 37%;
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

const Icon = styled.i`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #777;
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

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const StyledLink = styled(Link)`
  color: #2575fc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginRegisterLink = styled.p`
  text-align: left;
  font-size: 14px;
  margin-top: 20px;
`;

const LoginBody = () => {
  const [values, setValues] = useState({
    nip: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post(process.env.REACT_APP_API_URL + "/login", values)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate("/dashboard");
        } else {
          alert(res.data.message)
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        // Handle other types of errors here, if necessary
        alert('Error');
      });
  };

  return (
    <Wrapper>
      <Title>Login</Title>
      <InputBox>
        <Input
          type="text"
          placeholder="NIP"
          required
          onChange={(e) => setValues({ ...values, nip: e.target.value })}
        />
        <Icon className="fa fa-key"></Icon>
      </InputBox>
      <InputBox>
        <Input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <Icon className="fa fa-lock"></Icon>
      </InputBox>
      <Button onClick={handleLogin}>Login</Button>
      <RememberForgot>
        <label></label>
        <a href="#"></a>
      </RememberForgot>
      <LoginRegisterLink>
        <StyledLink to="/register"></StyledLink>
      </LoginRegisterLink>
    </Wrapper>
  );
};

export default LoginBody;
