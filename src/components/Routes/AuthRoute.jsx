import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';
import SignupOAuth2 from '../../pages/Signup/SignupOAuth2';
import SignupOAuth2Merge from '../../pages/Signup/SignupOAuth2Merge';
import SigninOAuth2 from '../../pages/Signin/SigninOAuth2';

function AuthRoute(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!!principalState?.data?.data) {  // 로그인된 상태이면 회원가입, 로그인 창 들어가지지 않도록
        return <Navigate to={"/"}/>     // 무조건 홈으로 이동
    }

    return (
        <Routes>
            <Route path='signin' element={<Signin />} />
            <Route path='oauth2/signin' element={<SigninOAuth2 />} />
            <Route path='signup' element={<Signup />} />
            <Route path='oauth2/signup' element={<SignupOAuth2 />} />
            <Route path='oauth2/signup/merge' element={<SignupOAuth2Merge />} />
        </Routes>
    );
}

export default AuthRoute;