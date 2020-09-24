import React from 'react';
import 'antd/dist/antd.css';
import MainPage from './components/mainPage';

function App() {
  const jwtAccessToken = localStorage.getItem('jwtAccessToken');
  console.log(" in app.js "+jwtAccessToken);
  return (
    <div className="App">
     <MainPage isLogin = {jwtAccessToken ? true : false} />
    </div>
  );
}

export default App;
