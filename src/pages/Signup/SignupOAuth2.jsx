import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';

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

function SignupOAuth2(props) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(!window.confirm("등록되지 않은 간편로그인 사용자입니다. 회원등록 하시겠습니까?")) {
            window.location.replace("/auth/signin");
        }
    }, []);
    

    const user = {
        email: "",
        password: "",
        name: searchParams.get("name"),
        nickname: "",
        oauth2Id: searchParams.get("oauth2Id"),
        profileImg: searchParams.get("profileImg"),
        provider: searchParams.get("provider")
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
            alert("회원가입 완료");
            window.location.replace("auth/signin");
        } catch (error) {
            console.log(error);
            if(Object.keys(error.response.data).includes("email")) {    // 이메일 중복 오류 (이미 해당 이메일로 가입한 유저가 있을 경우)
                // 계정 통합 권유
                if(window.confirm(`해당 이메일로 가입된 계정이 있습니다.\n${signupUser.provider} 계정과 연결하시겠습니까?`)) {
                    // 계정 통합 페이지 이동
                    navigate(`/auth/oauth2/signup/merge?oauth2Id=${signupUser.oauth2Id}&email=${signupUser.email}&provider=${signupUser.provider}`)
                }
            } else if(Object.keys(error.response.data).includes("nickname")) {
                alert("이미 사용중인 닉네임입니다. 다시 입력하세요.");
            }
        }
    }

    return (
        <div css={layout}>
            <h2>회원가입</h2>
            <div><input type="text" name='email' placeholder='이메일' onChange={handleInputChange}/></div>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange}/></div>
            <div><input type="text" name='name' placeholder='이름' disabled={true} value={signupUser.name}/></div>
            <div><input type="text" name='nickname' placeholder='닉네임' onChange={handleInputChange}/></div>
            <div><button onClick={handleSignupSubmit}>가입하기</button></div>
            <div><button onClick={handleSigninClick}>로그인</button></div>
        </div>
    );
}

export default SignupOAuth2;