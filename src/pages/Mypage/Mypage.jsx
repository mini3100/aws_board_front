import React, { useEffect, useRef, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../../api/firebase/firebase';
import { Line } from 'rc-progress';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const infoHeader = css`
    display: flex;
    align-items: center;
    margin: 0px 0px 20px;
    border: 1px solid #DFDDCF;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    background-color: #fffcea ;
`

const imgBox = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    border: 1px solid #DFDDCF;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    background-color: white;
    cursor: pointer;
    overflow: hidden;

    & > img {
        width: 100%;
    }
`

const file = css`
    display: none;
`

const pointBox = css`
    margin-left: 20px;
`

function Mypage(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");
    const principal = principalState?.data?.data;
    const profileFileRef = useRef();
    const [ uploadFiles, setUploadFiles ] = useState([]);
    const [ profileImgSrc, setProfileImgSrc ] = useState("");
    const [ progressPercent, setProgressPercent ] = useState(0);

    useEffect(() => {
        setProfileImgSrc(principal.profileUrl);   // 마운트 됐을 때 기존의 사용자 이미지 들고옴
    }, [])

    const handleProfileUploadClick = () => {
        if(window.confirm("프로필 사진을 변경하시겠습니까?")) {
            profileFileRef.current.click();
        }
    }

    const handleProfileChange = (e) => {
        const files = e.target.files;

        if(!files.length) {    // 파일이 없는 경우 무시
            setUploadFiles([]);
            e.target.value = "";
            return;
        }

        for(let file of files) {
            setUploadFiles([...uploadFiles, file]);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgSrc(e.target.result);
        }
        reader.readAsDataURL(files[0]);
    }

    const handleUploadSubmit = () => {
        // 저장소 참조 생성: 'files/profile' 경로에 첫 번째 업로드 파일의 이름을 사용
        const storageRef = ref(storage, `files/profile/${uploadFiles[0].name}`);
        
        // 업로드 작업 생성 및 진행 상태를 모니터링
        const uploadTask = uploadBytesResumable(storageRef, uploadFiles[0]);

        // 업로드 작업 상태 변경 이벤트 처리
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // 업로드 상태 변경 이벤트가 발생할 때 실행
                setProgressPercent(
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                );
            },
            (error) => {
                console.error(error);
            },
            () => {
                // 업로드가 성공적으로 완료되었을 때 실행
                getDownloadURL(storageRef).then(downloadUrl => {    // 저장된 파일의 다운로드 URL(저장소에 저장된 파일의 경로)
                    const option = {
                        headers: {
                          Authorization: localStorage.getItem("accessToken")
                        }
                    }
                    instance.put("/account/profile/img", {profileUrl: downloadUrl}, option)
                    .then((response) => {
                        alert("프로필 사진이 변경되었습니다.");
                        window.location.reload();
                    })
                });
            }
        );
    }

    const handleUploadCancel = () => {
        setUploadFiles([]);
        profileFileRef.current.value = "";
    }

    const handleSendMail = async () => {
        try {
            const option = {
                headers: {
                  Authorization: localStorage.getItem("accessToken")
                }
              }
            await instance.post("/account/mail/auth", {}, option);  // 주소, 데이터, 옵션
            alert("인증 메일 전송 완료. 인증 요청 메일을 확인해주세요.")
        } catch (error) {
            alert("인증 메일 전송 실패. 다시 시도해주세요.")
        }
    }

    return (
        <RootContainer>
            <div>
                <div css={infoHeader}>
                    <div>
                        <div css={imgBox} onClick={handleProfileUploadClick}>
                            <img src={profileImgSrc} alt="" />
                        </div>
                        <input css={file} type="file" onChange={handleProfileChange} ref={profileFileRef}/>
                        {!!uploadFiles.length && 
                            <div>
                                <Line percent={progressPercent} strokeWidth={4} strokeColor={"#DFDDCF"}/>
                                <button onClick={handleUploadSubmit}>변경</button>
                                <button onClick={handleUploadCancel}>취소</button>
                            </div>
                        }
                    </div>
                    <div css={pointBox}>
                        <h3>누적 포인트: {principal.userPoint} Point</h3>
                        <button onClick={() => {navigate("/store/products");}}>포인트 구매</button>
                    </div>
                </div>
                <div>
                    <div>닉네임: {principal.nickname}</div>
                    <div>이름: {principal.name}</div>
                    <div>이메일: {principal.email} {principal.enabled 
                        ? <button disabled={true}>인증완료</button> 
                        : <button onClick={handleSendMail}>인증하기</button>}</div>
                    <Link to={"/account/password"}>비밀번호 변경</Link>
                </div>
            </div>
        </RootContainer>
    );
}

export default Mypage;