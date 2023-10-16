import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';

const layout = css`
    margin-right: 10px;
    width: 320px;
`;

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
`;

function Sidebar(props) {
    const navigate = useNavigate();

    const handleSigninClick = () => {
        navigate("/auth/signin");
    }

    return (
        <div css={layout}>
            <div css={container}>
                <h3>로그인 후 게시판을 이용해보세요</h3>
                <div><button onClick={handleSigninClick}>로그인</button></div>
                <div>
                    <Link to={"/auth/forgot/password"}>비밀번호 찾기</Link>
                    <Link to={"/auth/signup"}>회원가입</Link>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;