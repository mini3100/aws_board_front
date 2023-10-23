import React, { useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { instance } from '../../api/config/instance';

function EditPassword(props) {
    const [ passwordObj, setPasswordObj ] = useState({
        oldPassword: "",
        newPassword: "",
        checkNewPassword: ""
    });

    const handleInputChange = (e) => {
        setPasswordObj({
            ...passwordObj,
            [e.target.name]: e.target.value
        });
    }

    const handleUpdatePasswordSubmit = async () => {
        try {
            const option = {
                headers: {
                Authorization: localStorage.getItem("accessToken")
                }
            };
            const response = await instance.put("/account/password", passwordObj, option);
            if(response) {
                alert("비밀번호가 변경되었습니다.")
                window.location.replace("/account/mypage");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <RootContainer>
            <div>
                <div><input type="password" name='oldPassword' onChange={handleInputChange} placeholder='이전 비밀번호' /></div>
                <div><input type="password" name='newPassword' onChange={handleInputChange} placeholder='새 비밀번호' /></div>
                <div><input type="password" name='checkNewPassword' onChange={handleInputChange} placeholder='새 비밀번호 확인' /></div>
                <button onClick={handleUpdatePasswordSubmit}>변경하기</button>
            </div>
        </RootContainer>
    );
}

export default EditPassword;