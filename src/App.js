import { useState, useRef } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Input, InputLabel, TextField } from "@mui/material";
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);

  const [roomName, setRoomName] = useState("");

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <div className="App">
      <section>
        {room ? (
          <div>
            <Chat room={room} />
          </div>
        ) : (
          <div className="room">
            <TextField
              label="Enter Room Name"
              color="primary"
              margin="normal"
              focused
              id="outlined-basic"
              variant="outlined"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <br></br>
            <Button
              disabled={!roomName}
              variant="contained"
              onClick={() => setRoom(roomName)}
            >
              Enter Room
            </Button>
          </div>
        )}
        <div className="sign-out">
          <Button onClick={signUserOut} variant="contained" color="error">
            Log Out <LogoutIcon></LogoutIcon>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default App;
