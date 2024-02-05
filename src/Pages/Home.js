
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate= useNavigate();
    return (
        <>
        <div className="home">
            <div className="innerBlock">
                <div className="joinButton" onClick={()=>{navigate('/join')}}>
                    <span>Join Server</span>
                </div>
                <div className="createButton" onClick={()=>{navigate('/create')}}>
                    <span>Create Server</span>
                </div>
            </div>
        </div>
        </>
    );

}
export default Home;