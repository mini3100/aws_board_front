import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import { instance } from '../../api/config/instance';

const layout = css`
    margin-right: 20px;
    width: 320px;
`;

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    border: 1px solid #DFDDCF;
    border-radius: 10px;
    padding: 20px;
    background-color: white;
`;

const menuContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #DFDDCF;
    border-radius: 10px;
    background-color: white;
    overflow: hidden;
`;

const menuBox = css`
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    width: 100%;
    
    & li {
        border-bottom: 1px solid #DFDDCF;
        padding: 20px;
        font-weight: 600;
        list-style-type: none;
        :hover {
            background-color: #fff9c6;
            color: #4d2e07;
        }
    }
    & li.selected {
        background-color: #e2b375;
        color: white;
    }
    & a:last-of-type li {
        border-bottom: none;
    }
`

function Sidebar(props) {
    const [ categories, setCategories ] = useState([]);

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    // 상위의 App.js에서 사용한 QueryClient 가져옴(전역 상태)
    const principalState = queryClient.getQueryState("getPrincipal");   // key값을 통해 해당 상태를 가져옴.

    const { category } = useParams();
    const pathname = useLocation().pathname;

    useEffect(() => {
        instance.get("/board/categories")
        .then((response) => {
            setCategories(response.data);
        })
    }, [])

    const handleSigninClick = () => {
        navigate("/auth/signin");
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("accessToken"); // localStorage의 토큰을 지움 -> 로그아웃
        // navigate : 상태 비교해서 다른 부분만 렌더링 -> app.js에서 토큰을 검사하는 코드가 실행되지 않음(로그아웃 안 됨)
        // window.location.replace : 전부 렌더링(새로고침)
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
                    <div><Link to={"/auth/forgot/password"}>비밀번호 찾기</Link></div>
                    <div><Link to={"/auth/signup"}>회원가입</Link></div>
                </div>
            )}
            <div css={menuContainer}>
                <ul css={menuBox}>
                    <Link to={"/board/write"}><li className={pathname === "/board/write" ? 'selected' : ''}>게시글 작성</li></Link>
                    <Link to={"/board/all/1"}>
                        <li className={category === 'all' ? 'selected' : ''}>
                            전체 게시글 ({categories.map(category => category.boardCount).reduce((sum, curValue) => sum + curValue, 0)})
                        </li>
                    </Link>
                    {categories.map(categoryObj => {
                        return  <Link to={`/board/${categoryObj.boardCategoryName}/1`} key={categoryObj.boardCategoryId}>
                                    <li className={category === categoryObj.boardCategoryName ? 'selected' : ''}>
                                        {categoryObj.boardCategoryName} ({categoryObj.boardCount})
                                    </li>
                                </Link>
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;