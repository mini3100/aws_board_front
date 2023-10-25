import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { instance } from '../../api/config/instance';

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

function SignupOAuth2Merge(props) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ mergeUser, setMergeUser ] = useState({
        email: searchParams.get("email"),
        password: "",
        oauth2Id: searchParams.get("oauth2Id"),
        provider: searchParams.get("provider")
    });

    const handleInputChange = (e) => {
        setMergeUser({
            ...mergeUser,
            [e.target.name]: e.target.value
        });
    };

    const handleMergeSubmit = async () => {
        try {
            await instance.put("/auth/oauth2/merge", mergeUser);
            // 통합 성공시 로그인 페이지로 이동
            alert("계정 통합을 완료하였습니다. 다시 로그인 해주세요.");
            window.location.replace("/auth/signin");
        } catch (error) {
            console.error(error.response.data.authError);
        }
    }

    return (
        <div css={layout}>
            <h2>{searchParams.get("email")}계정과 {searchParams.get("provider")}계정 통합</h2>
            <p>계정을 통합하시려면 가입된 사용자의 비밀번호를 입력하세요.</p>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange} /></div>
            <button onClick={handleMergeSubmit}>확인</button>
        </div>
    );
}

export default SignupOAuth2Merge;