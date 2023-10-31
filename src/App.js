import { Route, Routes } from 'react-router-dom';
import './App.css';
import RootLayout from './components/RootLayout/RootLayout';
import Home from './pages/Home/Home';
import { useQuery } from 'react-query';
import { instance } from './api/config/instance';
import AuthRoute from './components/Routes/AuthRoute';
import AccountRoute from './components/Routes/AccountRoute';
import BoardWrite from './pages/BoardWrite/BoardWrite';
import BoardList from './pages/BoardList/BoardList';
import BoardDetails from './pages/BoardDetails/BoardDetails';
import PointStore from './pages/PointStore/PointStore';
import BoardEdit from './pages/BoardEdit/BoardEdit';

function App() {

  const getPrincipal = useQuery(["getPrincipal"], async () => { // 배열. 첫번째 key값, 두번째부터 dependency
    try {
      const option = {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      }
      return await instance.get("/account/principal", option);
    } catch (error) {
      throw new Error(error);
    }
  }, {
    retry: 0,
    refetchInterval: 1000 * 60 * 10,  // 10분마다 refetch
    refetchOnWindowFocus: false
  });

  if(getPrincipal.isLoading) {
    return <></>;
  }

  return (
    <RootLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/*' element={<AuthRoute />} />
        <Route path='/account/*' element={<AccountRoute />} />
        {/* :category - 매개변수(카테고리 종류마다 텍스트 달라지게) */}
        <Route path='/board/write' element={<BoardWrite/>} />
        <Route path='/board/edit/:boardId' element={<BoardEdit/>} />
        <Route path='/board/:category/:page' element={<BoardList />} />
        <Route path='/board/:category/edit' element={<></>} />
        <Route path="/board/:boardId" element={ <BoardDetails /> } />
        <Route path="/store/products" element={ <PointStore /> } />
      </Routes>
    </RootLayout>
  );
}

export default App;
