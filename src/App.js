import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import RootLayout from './components/RootLayout/RootLayout';
import Home from './pages/Home/Home';
import { useQuery } from 'react-query';
import { instance } from './api/config/instance';

function App() {
  const navigate = useNavigate();

  const getPrincipal = useQuery(["getPrincipal"], async () => {
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
    refetchInterval: 1000 * 60 * 10,  // 10분마다 refetch,
    refetchOnWindowFocus: false
  });

  return (
    <RootLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/*' element={<Auth />} />
        <Route path='/board/:category' element={<></>} />
        <Route path='/board/:category/register' element={<></>} />
        <Route path='/board/:category/edit' element={<></>} />
      </Routes>
    </RootLayout>
  );
}

export default App;
