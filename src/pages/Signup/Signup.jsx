import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const layout = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #DFDDCF;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    height: 700px;
    background-color: white;
    & button {
        margin-top: 5px;
        width: 183px;
    }
`

function Signup(props) {
    const navigate = useNavigate();

    const user = {
        email: "",
        password: "",
        name: "",
        nickname: ""
    }

    const [ signupUser, setSignupUser ] = useState(user);

    const handleInputChange = (e) => {
        setSignupUser({
            ...signupUser,
            [e.target.name]: e.target.value
        });
    }

    const handleSigninClick = () => {
        navigate("/auth/signin");
    }

    const handleSignupSubmit = async () => {
        try {
            const response = await instance.post("/auth/signup", signupUser);
            navigate("/auth/signin");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div css={layout}>
            <h2>회원가입</h2>
            <div><input type="text" name='email' placeholder='이메일' onChange={handleInputChange}/></div>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange}/></div>
            <div><input type="text" name='name' placeholder='이름' onChange={handleInputChange}/></div>
            <div><input type="text" name='nickname' placeholder='닉네임' onChange={handleInputChange}/></div>
            <div><button onClick={handleSignupSubmit}>가입하기</button></div>
            <div><button onClick={handleSigninClick}>로그인</button></div>
        </div>
    );
}

export default Signup;