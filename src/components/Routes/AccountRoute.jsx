import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import Mypage from '../../pages/Mypage/Mypage';

function AccountRoute(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if (!principalState?.data?.data) {   // 로그인이 안 됐으면 홈으로
        alert("로그인 후 이용 가능합니다.")
        return <Navigate to={"/auth/signin"} />
    }

    return (
        <Routes>
            <Route path='mypage' element={ <Mypage /> } />
            <Route path='password' element={ <></> } />
        </Routes>
    );
}

export default AccountRoute;