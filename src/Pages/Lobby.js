import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Lobby(props){
    const location = useLocation();
    const navigate = useNavigate();
    const [players,setPlayers] = useState(location.state.players);
    const [playerIsOwner,setPlayerAsOwner] = useState(false);
    const {socketRef} = props;
    const fetchGames = async ()=>{
        const {data} = await axios({
            method:'GET',
            url:`${process.env.REACT_APP_SERVER_URL}/games?serverCode=${location.state.serverCode}`
        });
        console.log("test",data,location.state.currentPlayer);
        setPlayers(data[location.state.serverCode].players);
        data[location.state.serverCode].players.map(player=>{
            if(player.name === location.state.currentPlayer && player.isOwner){
                console.log('is owner',true);
                setPlayerAsOwner(true);
            }
        })
    }
    useEffect(()=>{
        fetchGames()
    },[]);
    socketRef.on(`${location.state.serverCode}_joined`,async (msg)=>{
        console.log("New user joined lobby",msg);
        const {data} = await axios({
            method:'GET',
            url:`${process.env.REACT_APP_SERVER_URL}/games?serverCode=${location.state.serverCode}`
        });
        console.log(data);
        setPlayers(data[Object.keys(data)[0]].players);
    })
    socketRef.on(`${location.state.serverCode}_started`,async (msg)=>{
        console.log("Game started joined lobby",msg);
        if(!playerIsOwner){
            navigate('/game',{state:location.state});
        }
    })
    return(
        <div className="lobby">
            <div className="title"><span>Lobby</span></div>
            <div className="topSection"><span>Server Code: {location.state.serverCode}</span></div>
            <div className="playersList">
                <ul>
                {
                    players.map(player=>{
                        return(
                            <li><span>{player.name}</span></li>
                        )
                    })
                }
                </ul>
            </div>
            <div className="start"><Button variant="contained" disabled={(playerIsOwner)?(false):(true)} onClick={()=>{
                socketRef.emit(`gameStarted`,JSON.stringify({serverCode:location.state.serverCode,players}));
                navigate('/game',{state:location.state});
            }}> start</Button></div>
        </div>
    );
}
export default Lobby;