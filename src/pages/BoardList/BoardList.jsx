import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import RootContainer from '../../components/RootContainer/RootContainer';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ReactSelect from 'react-select';
import { useEffect } from 'react';
import { useState } from 'react';
import { instance } from '../../api/config/instance';
import { useQuery } from 'react-query';

const table = css`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #dbdbdb;

    & th, td {
        border: 1px solid #dbdbdb;
        height: 30px;
        text-align: center;
    }

    & td {
        cursor: pointer;
    }

    & th {
        background-color: #fffae1;
    }
`;

const searchContainer = css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    width: 100%;

    & > * {
        margin-left: 5px;
    }
`;

const selectBox = css`
    width: 110px;
`;

const SPageNumbers = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 100%;

    & button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        background-color: #fff5ca;
        width: 20px;
        height: 20px;

        :disabled {
            background-color: white;
            border: none;
        }
    }
`;

const SBoardTitle = css`
    max-width: 500px;
    width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

function BoardList(props) {
    const navigate = useNavigate();
    const { category, page } = useParams();

    const options = [
        {value: "전체", label: "전체"},
        {value: "제목", label: "제목"},
        {value: "작성자", label: "작성자"}
    ];

    const [ pageNumbers, setPageNumbers ] = useState({
        startNumber: 0,
        endNumber: 0
    });

    const search = {
        optionName: options[0].label,
        searchValue: ""
    }

    const [ searchParams, setSearchParams ] = useState(search);

    const getBoardList = useQuery(["getBoardList", page, category], async () => {
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/${page}`, option);
    }, {
        refetchOnWindowFocus: false
    });

    const getBoardCount = useQuery(["getBoardCount", page, category], async () => {
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/count`, option);
    }, {
        refetchOnWindowFocus: false
    });

    const handleSearchInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            searchValue: e.target.value
        });
    }

    const handleSearchOptionSelect = (option) => {
        setSearchParams({
            ...searchParams,
            optionName: option.label
        });
    }

    const handleSearchButtonClick = () => {
        navigate(`/board/${category}/1`);   // 검색 버튼을 눌렀을 때, 1번 페이지로 이동하면서 검색
        // 검색 버튼 클릭 후 데이터 갱신 : 새로운 검색 결과를 표시하고 새로운 페이지로 이동
        // 부분 렌더링 및 상태 유지 : 부분 렌더링이 되기 때문에 검색 부분의 상태가 유지됨. -> category가 바뀌면 검색부분이 날아가도록 useEffect 사용
        getBoardList.refetch();
        getBoardCount.refetch();
    }

    const pagination = () => {
        if(getBoardCount.isLoading) {
            return <></>
        }
        const totalBoardCount = getBoardCount.data.data;
        const lastPage = getBoardCount.data.data % 10 === 0 
            ? totalBoardCount / 10 
            : Math.floor(totalBoardCount / 10) + 1

        const startIndex = page % 5 === 0 ? page - 4 : page - (page % 5) + 1;
        const endIndex = startIndex + 4 <= lastPage ? startIndex + 4 : lastPage;

        const pageNumbers = [];
        
        for(let i = startIndex; i <= endIndex; i++) {
            pageNumbers.push(i);
        }

        return (
            <>
                <button disabled={parseInt(page) === 1} onClick={() => {
                    navigate(`/board/${category}/${parseInt(page) - 1}`);
                }}>&#60;</button>

                {pageNumbers.map(num => {
                    return <button onClick={() => {
                        navigate(`/board/${category}/${num}`);
                    }} key={num}>{num}</button>
                })}

                <button disabled={parseInt(page) === lastPage} onClick={() => {
                    navigate(`/board/${category}/${parseInt(page) + 1}`);
                }}>&#62;</button>
            </>
        )
    }

    return (
        <RootContainer>
            <div>
                <h2>{category === "all" ? "전체게시물" : category}</h2>

                <div css={searchContainer}>
                    <div css={selectBox}>
                        <ReactSelect options={options} defaultValue={options[0]} 
                            onChange={handleSearchOptionSelect}/>
                    </div>
                    <input type="text" onChange={handleSearchInputChange}/>
                    <button onClick={handleSearchButtonClick}>검색</button>
                </div>
                <table css={table}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>추천</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!getBoardList.isLoading && getBoardList?.data?.data.map(board => {
                            return <tr key={board.boardId} 
                                    onClick={() => {navigate(`/board/${board.boardId}`)}}>
                                        <td>{board.boardId}</td>
                                        <td css={SBoardTitle}>{board.title}</td>
                                        <td>{board.nickname}</td>
                                        <td>{board.createDate}</td>
                                        <td>{board.likeCount}</td>
                                        <td>{board.hitsCount}</td>
                                    </tr>
                        })}
                        
                    </tbody>
                </table>

                <div css={SPageNumbers}>
                    {pagination()}
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardList;