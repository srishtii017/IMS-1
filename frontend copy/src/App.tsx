import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import MainLayout from './layout/MainLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, UserSlicePath } from './provider/slice/user.slice';

function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector(UserSlicePath);

  const fetchUser = async (token: string) => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/user/profile", {token : token});
      console.log(data);
      dispatch(setUser(data.user));
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || '';

    if (!token) {
      navigate("/login");
    } else {
      if (selector?.email) {
        setLoading(false);
      } 
      else {
        fetchUser(token);
      }
    }
  }, [navigate, selector]);

  if (loading) {
    return <div>loading....</div>;
  }

  return (
    <>
      <Header />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
}

export default App;
