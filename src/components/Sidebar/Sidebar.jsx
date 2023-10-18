import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

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

    const queryClient = useQueryClient();

    // 상위의 App.js에서 사용한 QueryClient 가져옴(전역 상태)
    const principalState = queryClient.getQueryState("getPrincipal");

    const handleSigninClick = () => {
        navigate("/auth/signin");
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("accessToken"); // localStorage의 토큰을 지움 -> 로그아웃
        window.location.replace("/");
    }

    return (
        <div css={layout}>
            {!!principalState?.data?.data ? (    // principalState에 data가 있다 -> 로그인 된 상태
                <div css={container}>
                    <h3>{principalState.data.data.nickname}님 환영합니다!</h3>
                    <div><button onClick={handleLogoutClick}>로그아웃</button></div>
                    <div>
                        <Link to={"/account/mypage"}>마이페이지</Link>
                    </div>
                </div>
            ) : (   // 없을 경우 -> 로그아웃 상태
                <div css={container}>
                    <h3>로그인 후 게시판을 이용해보세요</h3>
                    <div><button onClick={handleSigninClick}>로그인</button></div>
                    <div>
                        <Link to={"/auth/forgot/password"}>비밀번호 찾기</Link>
                        <Link to={"/auth/signup"}>회원가입</Link>
                    </div>
                </div>
            ) }
            
            
        </div>
    );
}

export default Sidebar;