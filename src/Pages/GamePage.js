import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import TextField from '@mui/material/TextField';
import { Button, Snackbar } from "@mui/material";
import axios from 'axios';
let socket;
function GamePage(props){
    const [message,setMessage] = useState("");
    const {socketRef} = props;
    const [messageList,setMessageList] = useState([]);
    const [snackMessage,setSnackMessage] = useState("");
    const location = useLocation();
    const [playersList,setPlayersList] = useState(location.state.players);
    const [showSnack,setShowSnack] = useState(false);
    console.log(location.state);
    const [counter,incrementCounter] = useState(0);
    let intervalId = setInterval(()=>{
        incrementCounter(counter+1);
    },1000);
    useEffect(()=>{
        axios({
            method:'GET',
            url:`${process.env.REACT_APP_SERVER_URL}/chats?serverId=${location.state.serverCode}`
        }).then(resp=>{
            console.log("response",resp.data);
            setMessageList(resp.data);
        }).catch(err=>{
            console.log("err",err);
        });
        axios({
            method:'GET',
            url:`${process.env.REACT_APP_SERVER_URL}/games?serverCode=${location.state.serverCode}`
        }).then(resp=>{
            console.log("responsePlayers",resp.data);
            setPlayersList(resp.data[location.state.serverCode].players);
        }).catch(err=>{
            console.log("err",err);
        });
    },[]);
    useEffect(()=>{
        //console.log("counter updated",counter);
    },[counter])
    if(!socketRef){
        try{
        socketRef.on('connect_error',err=>{
            alert(err.message);
        })
        }catch(err){
            alert("test",err.message);
        }
    }
    socketRef.on(`${location.state.serverCode}_joined`,(msg)=>{
        console.log("New user joined game",msg);
    })
    socketRef.on('receiveMessage',(msg)=>{
        let parsed = (JSON.parse(msg)).chat;
        setMessageList([...messageList,parsed]);
        //alert( parsed.username+","+location.state.players[0].name)
        let messageSection = document.getElementById('messageSection');
        console.log(messageSection);
        messageSection.scrollTop = messageSection.scrollHeight + 1;
        if(parsed.userName !== location.state.currentPlayer){
            setShowSnack(true);
            setSnackMessage(`${parsed.userName}: ${parsed.message}`);
        }
    });
    useEffect(()=>{
        console.log(messageList);
    },[messageList])
    return (
        <>
        <div className="home">
            <div className="gamePage">
                <div className="topSection"><span>Server Code: {location.state.serverCode}</span></div>
                <div className="gameBodySection">
                    <div className="leftSection">
                        {
                            playersList.map((player)=>{
                                return (
                                    <div className="playerCard">
                                        <span>{player.name} {player.score}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="gameSection">
                        <div className="broadcastSection">
                            Game is about to start in {counter}
                        </div>
                        <div className="audioSection">
                            
                        </div>
                        <div className="messageSection" id="messageSection">
                            <ul>
                            {
                                messageList.map((message)=>{
                                    return(
                                        <li>{message.userName}: {message.message}</li>
                                    )
                                })
                            }
                            </ul>
                        </div>
                        <div className="inputSection">
                            <span><TextField variant="outlined" label="Answer" onKeyUp={(e)=>{
                                if(e.key === 'Enter'){
                                    socketRef.emit("sendMessage",JSON.stringify({serverId:location.state.serverCode,chat:{userName:location.state.currentPlayer,createdAt:new Date(),message:message}}));
                                    e.target.value="";
                                }
                            }} onInput={(e)=>{setMessage(e.target.value)}}/></span>
                            <div className="submitButton">
                                <Button variant="contained" onClick={()=>{socketRef.emit("sendMessage",JSON.stringify({serverId:location.state.serverCode,chat:{userName:location.state.currentPlayer,createdAt:new Date(),message:message}}))}}>Send</Button>
                            </div>
                        </div>
                    </div>
                    <div className="adSection">

                    </div>
                </div>
            </div>
            <Snackbar
            open={showSnack}
            autoHideDuration={6000}
            onClose={()=>{setShowSnack(false)}}
            message={snackMessage}
            action={()=>{}}
            />
        </div>
        </>
    );

}
export default GamePage;