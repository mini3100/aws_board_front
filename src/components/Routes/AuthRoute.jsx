import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';

function AuthRoute(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!!principalState?.data?.data) {  // 로그인된 상태이면 회원가입, 로그인 창 들어가지지 않도록
        return <Navigate to={"/"}/>     // 무조건 홈으로 이동
    }

    return (
        <Routes>
            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />
        </Routes>
    );
}

export default AuthRoute;