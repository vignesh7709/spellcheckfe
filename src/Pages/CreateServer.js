import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function CreateServer(props){
    const [player,setPlayer] = useState("");
    const { socketRef } = props;
    const navigate = useNavigate();
    return (
        <>
        <div className="home">
            <div className="innerBlock createServer">
                <span>
                    Player
                    <input type="text" name="player" onInput={(e)=>{setPlayer(e.target.value)}}/>
                </span>
                <div className="createButton" onClick={async ()=>{
                        const gameData = {'players':[{name:player,score:0,isOwner:true}]}
                        let response = await axios({
                            method:"POST",
                            url:`${process.env.REACT_APP_SERVER_URL}/games`,
                            data:gameData
                        })
                        navigate('/lobby',{state:{...response.data,currentPlayer:player}})
                    }}>
                    <span>Create Server</span>
                </div>
            </div>
        </div>
        </>
    );

}
export default CreateServer;