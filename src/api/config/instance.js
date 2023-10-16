import axios from "axios";

export const instance = axios.create({     // axios 공통 설정
    baseURL: "http://localhost:8080/"
});
