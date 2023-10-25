import React from 'react';
import { useQueryClient } from 'react-query';
import { Navigate, useSearchParams } from 'react-router-dom';

function SigninOAuth2(props) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const queryClient = useQueryClient();

    localStorage.setItem("accessToken", "Bearer " + searchParams.get("token"));
    queryClient.refetchQueries(["getPrincipal"]);

    return <Navigate to={"/"} />;
}

export default SigninOAuth2;