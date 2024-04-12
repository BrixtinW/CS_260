import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import '/./src/app.css';

export function GameRoom() {


// implement vote, votes, secretWord and players API
const toggleSelectedClass = (name) => {
    setSelectedPlayer(name === selectedPlayer ? null : name);
  };

  let [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  let [secretWord, setSecretWord] = useState("");
  let [voteButton, setVoteButton] = useState(false);
  const [currentVote, setCurrentVote] = useState(null);
  const [socket, setSocket] = useState();
  const code = sessionStorage.getItem('code');
  const myName = sessionStorage.getItem("myName");

//   const [code, setCode] = useState();
//   const [myName, setMyName] = useState();
  

  useEffect(() => {
    // const gameCode = sessionStorage.getItem('code');
    // const newName = sessionStorage.getItem("myName")

    // setCode(gameCode);
    // setMyName(newName);



setSocket(createGameSocket(code, myName));

}, []);
window.addEventListener('beforeunload', function(event) {
    alert("before unload called!");
    logout();
      const message = { type: "leaveRoom", code: code, name: myName, startGame: false}
      socket.send(JSON.stringify(message));
      alert("this should ahve a stop");
});



function createGameSocket(code, name) {
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

socket.addEventListener('open', () => {

  socket.send(JSON.stringify({ type: "joinRoom", code: code, name: name }));
  socket.send(JSON.stringify({ type: "Get Secret Word", code: code, name: name }));
});


socket.onmessage = async (event) => {
  const msg = JSON.parse(await event.data);
  if (msg.type === "updatePlayers") {

  setPlayers([]);

  for (let playerName of msg.players) {
      addPlayer(playerName);
  }

  } else if (msg.type === "Recieve Secret Word") {
    
    setSecretWord(msg.secretWord);

  } else if (msg.type == "Verdict") {

    setVoteButton(false);

    if (msg.gameOver == true){
      alert("The odd one out was voted! The group wins!!");
      const currentUrl = window.location.href;
      let newUrl = currentUrl.replace(/gameRoom*/, '');
      window.location.href = newUrl;
    } else if (msg.winners != null ){
        alert(`${msg.winners} voted out!`)
    for (const winner of msg.winners){

      players.forEach(player => {

          if (player.name == winner) {
            //   console.log(child.textContent);
            const newSet = players.filter(player => player.name !== winner);
              setPlayers(newSet);
          }
      });

      if (winner == myName){
        alert("you were voted out!");
        const currentUrl = window.location.href;
        let newUrl = currentUrl.replace(/gameRoom*/, '');
        window.location.href = newUrl;
      }


    }
}
    
  }
}






return socket;
}



function selectPlayer(playerName) {

    const playerObject = players.find(player => player.name === playerName);

    if (playerObject.selected == false) {


    players.forEach(player => {
        if (player.selected == true){
            player.selected = false;
            toggleSelectedClass(player.name);
            console.log(player);
          }
      });

        setCurrentVote(playerObject.name);
        console.log(currentVote);
        playerObject.selected = true;
        toggleSelectedClass(playerObject.name);
    } else {
        setCurrentVote(null);
        console.log(currentVote);
        playerObject.selected = false;
        toggleSelectedClass(playerObject.name);
    }}
    

function addPlayer(newName) {
    // Generate a unique identifier for the player (you may use UUID or any other method)
    const playerId = players.length + 1;
    const newPlayer = { id: playerId, name: newName, selected: false};

    // Update the players state by adding the new player to the list
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
  };


function readTheVotes(){
event.preventDefault();

if(currentVote == null) {
  return;
}

setVoteButton(true);

const postData = {
      type: "Submit Vote",
      vote: currentVote,
      voter: myName,
      code: code
  };
socket.send(JSON.stringify(postData))

}









function logout() {
fetch('/logout', {
    method: 'GET',
    credentials: 'same-origin' // Include cookies in the request
})
.then(response => {
    if (response.ok) {
        // Redirect user to the homepage or login page upon successful logout
        console.log("logout successful");
    } else {
        // Handle logout error, e.g., display error message to user
        console.log("logout unsuccessful");
    }
})
.catch(error => {
    console.error('Error logging out:', error);
});
}




    return (
        <main className="smallPage">
        <table border="1" cellSpacing="2" cellPadding="5" >
            <tbody>
            <tr>
                <th>
                    Your Secret Word:
                </th>
                 <td id="secretWordDisplay">
                      {secretWord}
                    </td>
            </tr>
            </tbody>
            </table>

            <div id="carousel">
                {players.map(player => (
                    <div 
                    key={player.id} 
                    className={"item" + (player.name === selectedPlayer ? " selected" : "")} 
                    onClick={() => selectPlayer(player.name)}
                    >
                    {player.name}
                    </div>
                ))}
            </div>
      
            <form>
                <button className="button" id="voteButton" onClick={readTheVotes} disabled={voteButton}>
                    Submit Vote
                </button>
            </form>
    </main>
    );
  }