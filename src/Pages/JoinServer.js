import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const JoinServer = (props)=>{
    const [player,setPlayer] = useState("");
    const [serverCode,setServerCode] = useState("test1");
    const navigate = useNavigate();
    return (
        <>
        <div className="home">
            <div className="innerBlock joinServer">
                <span>
                    Player
                    <input type="text" name="player" onInput={(e)=>{setPlayer(e.target.value)}}/>
                </span>
                <span>
                    Server code
                    <input type="text" name="server" onInput={(e)=>{setServerCode(e.target.value)}}/>
                </span>
                <div className="createButton" onClick={async ()=>{
                        let pushData = {'players':[{name:player,score:0}],serverCode};
                        let resp = await axios({method:'PUT',url:`${process.env.REACT_APP_SERVER_URL}/games`,data:pushData});
                        navigate('/lobby',{state:{...resp.data,currentPlayer:player}})
                    }}>
                    <span>Join Server</span>
                </div>
            </div>
        </div>
        </>
    );

}
export default JoinServer;
