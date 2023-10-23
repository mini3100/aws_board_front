import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import kakaoImg from './kakao_login_medium_narrow.png'
import naverImg from './btnW_완성형.png'

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

const kakaoBtn = css`
    margin-top: 5px;
    cursor: pointer;
`

const naverBtn = css`
    margin-top: 3px;
    width: 183px;
    cursor: pointer;
`;

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
            localStorage.setItem("accessToken", "Bearer " + response.data); // 토큰을 만들어와서 localStorage에 저장
            window.location.replace("/");   // home으로 이동
        } catch (error) {
            if(error.response.status == 401) {
                alert(error.response.data.authError);
            }
        }
    }

    const handleKakaoLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    };

    const handleNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    return (
        <div css={layout}>
            <h2>로그인</h2>
            <div><input type="email" name='email' placeholder='이메일' onChange={handleInputChange}/></div>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange}/></div>
            <div><button onClick={handleSigninClick}>로그인</button></div>
            <div><button onClick={handleSignupClick}>회원가입</button></div>
            <div><img css={kakaoBtn} onClick={handleKakaoLogin} src={kakaoImg} alt="" /></div>
            <div><img css={naverBtn} onClick={handleNaverLogin} src={naverImg} alt="" /></div>
        </div>
    );
}

export default Signin;