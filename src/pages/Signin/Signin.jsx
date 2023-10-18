import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/config/instance';

function Signin(props) {
    const navigate = useNavigate();

    const user = {
        email: "",
        password: ""
    }

    const [ signinUser, setSigninUser ] = useState(user);

    const handleInputChange = (e) => {
        setSigninUser({
            ...signinUser,
            [e.target.name]: e.target.value
        });
    }

    const handleSignupClick = () => {
        navigate("/auth/signup");
    }

    const handleSigninClick = async () => {
        try {
            const response = await instance.post("/auth/signin", signinUser);
            localStorage.setItem("accessToken", "Bearer " + response.data);
            window.location.replace("/");
        } catch (error) {
            if(error.response.status == 401) {
                alert(error.response.data.authError);
            }
        }
    }

    return (
        <div>
            <div><input type="email" name='email' placeholder='이메일' onChange={handleInputChange}/></div>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange}/></div>
            <div><button onClick={handleSigninClick}>로그인</button></div>
            <div><button onClick={handleSignupClick}>회원가입</button></div>
        </div>
    );
}

export default Signin;