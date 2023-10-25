import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

const header = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0px;
    border-radius: 10px;
    width: 100%;
    height: 80px;
    background-color: #ffd7a2;
`;

function Header(props) {
    return (
        <div css={header}>
            <Link to={"/"}><h1>Board Project</h1></Link>
        </div>
    );
}

export default Header;