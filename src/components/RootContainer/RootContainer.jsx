import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Sidebar from '../Sidebar/Sidebar';

const rpptContainer = css`
    display: flex;
    width: 100%;
    height: 100%;
`;

const mainContainer = css`
    flex-grow: 1;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    height: 100%;
`;

function RootContainer({ children }) {
    return (
        <div css={rpptContainer}>
            <Sidebar />
            <div css={mainContainer}>
                { children }
            </div>
        </div>
    );
}

export default RootContainer;