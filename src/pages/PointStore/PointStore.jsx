import React, { useEffect } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useNavigate } from 'react-router-dom';

const SStoreContainer = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
`;

const SProductContainer = css`
    margin: 10px;
    width: 30%;
    height: 200px;
`;

function PointStore(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const getProducts = useQuery(["getProducts"], async () => {
        try {
            const option = {
                headers: {
                  Authorization: localStorage.getItem("accessToken")
                }
            }
            return await instance.get("/products", option);
        } catch (error) {
            
        }
    });

    useEffect(() => {
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.head.appendChild(iamport);
        return () => {  //언마운트
            document.head.removeChild(iamport);
        }
    }, []);

    const handlePaymentSubmit = (product) => {
        const principal = queryClient.getQueryState("getPrincipal");
        if(!window.IMP) { return; }
        const { IMP } = window;
        IMP.init("imp25480413");

        const paymentData = {
            pg: "kakaopay",
            pay_method: "kakaopay",                         // 결제 수단
            merchant_uid: `mid_${new Date().getTime()}`,    // 고유 식별 코드
            amount: product.productPrice,                   // 결제 금액
            name: product.productName,                      // 주문명
            buyer_name: principal?.data?.data?.name,        // 구매자 정보
            buyer_email: principal?.data?.data?.email
        }

        IMP.request_pay(paymentData, (response) => {    
            // 결제 응답 처리 메소드
            const { success, error_msg } = response;

            if(success) {   // 결제 성공
                // 우리 서버에 주문 데이터 insert
                const orderData = {
                    productId: product.productId,
                    email: principal?.data?.data?.email
                }
                const option = {
                    headers: {
                      Authorization: localStorage.getItem("accessToken")
                    }
                }
                instance.post("/order", orderData, option)
                .then(response => {
                    alert("포인트 충전이 완료되었습니다.");
                    queryClient.refetchQueries(["getPrincipal"]);   // myPage에서 포인트 정보 refetch
                    navigate("/account/mypage");
                })
            } else {    // 결제 실패
                alert(error_msg);
            }
        });
    }

    return (
        <RootContainer>
            <h1>포인트 충전하기</h1>
            <div css={SStoreContainer}>
                {!getProducts.isLoading && getProducts?.data?.data.map(product => {
                    return  <button onClick={() => {handlePaymentSubmit(product);}} 
                                key={product.productId} 
                                css={SProductContainer}>
                                {product.productName} Point
                            </button>
                })}
            </div>
        </RootContainer>
    );
}

export default PointStore;