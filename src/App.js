import { Route, Routes } from 'react-router-dom';
import './App.css';
import RootLayout from './components/RootLayout/RootLayout';
import Home from './pages/Home/Home';
import { useQuery } from 'react-query';
import { instance } from './api/config/instance';
import AuthRoute from './components/Routes/AuthRoute';
import AccountRoute from './components/Routes/AccountRoute';

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
        <Route path='/board/:category' element={<></>} />
        <Route path='/board/:category/register' element={<></>} />
        <Route path='/board/:category/edit' element={<></>} />
      </Routes>
    </RootLayout>
  );
}

export default App;
