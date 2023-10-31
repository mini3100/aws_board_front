import React, { useEffect } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */

const boardContainer = css`
    position: relative;
    width: 928px;
`;

const SBoardTitle = css`
    width: 100%;
    font-size: 45px;
    word-wrap: break-word;  // 다음 줄로 넘어가고 필요한 경우에 단어의 줄바꿈도 동시에 일어남
    /* white-space: normal;    // normal 기본값, 너비를 초과할 경우 줄바꿈 허용 */
`;

const line = css`
    width: 100%;
    margin: 30px 0px ;
    border-bottom: 2px solid #dbdbdb;
`;

const contentContainer = css`
    width: 100%;
    word-wrap: break-word;
    & * {
        word-wrap: break-word;
    }
    & img {
        max-width: 100%;
    }
`;

const SSideOption = css`
    position: absolute;
    right: -80px;
    height: 100%;
`;

const SLikeButton = (isLike) => css`
    position: sticky;
    top: 150px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: ${isLike ? "#ffce8e" : "#fff"};
    cursor: pointer;
`;

const detailContainer = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    & button {
        width: 60px;
        height: 30px;
    }
`

function BoardDetails(props) {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principal = queryClient.getQueryState("getPrincipal");

    const { boardId } = useParams();
    const [ board, setBoard ] = useState({});

    const getBoard = useQuery(["getBoard"], async () => {
        try {
            return await instance.get(`/board/${boardId}`);
        }catch(error) {
            alert("해당 게시글을 불러올 수 없습니다.");
            navigate("/");
        }
    }, {
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setBoard(response.data);
        }
    })

    const getLikeState = useQuery(["getLikeState"], async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            return await instance.get(`/board/like/${boardId}`, option);
        }catch(error) {
            console.error(error);
        }
    },{
        refetchOnWindowFocus: false,
        retry: 0
    })

    const handleLikeButtonClick = async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            if(!!getLikeState?.data?.data) {
                await instance.delete(`/board/like/${boardId}`, option);
            }else {
                await instance.post(`/board/like/${boardId}`, {}, option);
            }
            getLikeState.refetch();
            getBoard.refetch();
        }catch(error) {
            console.error(error);
        }
    }

    const handleEditClick = () => {
        navigate(`/board/edit/${boardId}`);
    }

    const handleDeleteClick = async () => {
        if(window.confirm("정말 해당 글을 삭제하시겠습니까?")) {
            try {
                const option = {
                    headers: {
                        Authorization: localStorage.getItem("accessToken")
                    }
                }
                await instance.delete(`/board/${boardId}`, option);
                alert("삭제가 완료되었습니다.");
                navigate("/");   // 뒤로가기
            } catch (error) {
                console.error(error);
            }
            
        }
    }

    if(getBoard.isLoading) {
        return <></>
    }

    return (
        <RootContainer>
            <div css={boardContainer}>
                <div css={SSideOption}>
                    {!getLikeState.isLoading && 
                        <button 
                            disabled={!principal?.data?.data} 
                            css={SLikeButton(getLikeState?.data?.data)} 
                            onClick={handleLikeButtonClick}>
                            <div>❤</div>
                            <div>{getBoard?.data?.data?.boardLikeCount}</div>
                        </button>
                    }
                </div>
                <h1 css={SBoardTitle}>{board.boardTitle}</h1>
                <div css={detailContainer}>
                    <p><b>{board.nickname}</b> - {board.createDate}</p>
                    {board.email === principal?.data?.data?.email && 
                        <div>
                            <button onClick={handleEditClick}>수정</button>
                            <button onClick={handleDeleteClick}>삭제</button>
                        </div>
                    }
                    
                </div>
                <div css={line}></div>
                <div css={contentContainer} dangerouslySetInnerHTML={{ __html: board.boardContent }}></div>
            </div>
        </RootContainer>
    );
}

export default BoardDetails;