import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import Home from './Pages/Home';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import CreateServer from './Pages/CreateServer';
import GamePage from './Pages/GamePage';
import { useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import JoinServer from './Pages/JoinServer';
import Lobby from './Pages/Lobby';
const socket = io(process.env.REACT_APP_SERVER_URL,{transports:['websocket']});
socket.on('connection_error',(err)=>{
  console.log("Socket error",err);
})
function App() {
  // const socketRef = useRef(socket);
  return (
    <div className="App">
      <Header/>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/create" element={<CreateServer socketRef={socket}/>}/>
          <Route path="/join" element={<JoinServer socketRef={socket}/>}/>
          <Route path="/lobby" element={<Lobby socketRef={socket}/>}/>
          <Route path="/game" element={<GamePage socketRef={socket}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
