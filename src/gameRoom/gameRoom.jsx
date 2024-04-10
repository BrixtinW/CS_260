import React from 'react';
import '/./src/app.css';

export function GameRoom() {


// implement vote, votes, secretWord and players API

const code = sessionStorage.getItem('code')
const myName = sessionStorage.getItem("myName");
console.log(myName);
let currentVote = null;
const socket = createGameSocket(code, myName);


window.addEventListener('beforeunload', function(event) {
    alert("before unload called!");
      const message = { type: "leaveRoom", code: code, name: myName, startGame: false}
      socket.send(JSON.stringify(message));
      alert("this should ahve a stop");
});



function createGameSocket(code, name) {
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

socket.addEventListener('open', () => {
  console.log("connected sucessfully to WebSocket!");
  socket.send(JSON.stringify({ type: "joinRoom", code: code, name: name }));
  socket.send(JSON.stringify({ type: "Get Secret Word", code: code, name: myName }));
});


socket.onmessage = async (event) => {
  console.log("hey THIS WAS CALLED YOU DIDN't kmnpw what would daca;lkj;alsdf;j");
  console.log(event)
  console.log(event.data)
  const msg = JSON.parse(await event.data);
  if (msg.type === "updatePlayers") {
  var carousel = document.getElementById("carousel");

  // Remove all existing child elements of the carousel
  while (carousel.firstChild) {
      carousel.removeChild(carousel.firstChild);
  }






  console.log(msg.players)

// var targetDiv = document.getElementById("carousel");

msg.players.forEach(function(playerName) {
var newItem = document.createElement("div");
newItem.classList.add("item"); 
newItem.textContent = playerName; 
newItem.dataset.selected = "false"; 

newItem.addEventListener("click", function() {
if (newItem.dataset.selected == "false") {

var children = carousel.children;

for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.dataset.selected == "true"){
    child.classList.toggle("selected");
    child.dataset.selected = "false";
    console.log(child);
    // vote = div.textContent;
  }

}

    currentVote = newItem.textContent;
    console.log(currentVote);
    newItem.classList.toggle("selected");
    newItem.dataset.selected = "true";
} else {
    currentVote = null;
    console.log(currentVote);
    newItem.dataset.selected = "false";
    newItem.classList.toggle("selected");
}
});

carousel.appendChild(newItem);

});





  } else if (msg.type === "Recieve Secret Word") {
    
    const secretWord = msg.secretWord; 

    console.log('Secret word obtained:', secretWord);
    var secretWordDisplay = document.getElementById("secretWordDisplay");
    secretWordDisplay.textContent = secretWord; 

  } else if (msg.type == "Verdict") {

    document.getElementById('voteButton').disabled = false;

    if (msg.gameOver == true){
      alert("The odd one out was voted! The group wins!!");
      const currentUrl = window.location.href;
      let newUrl = currentUrl.replace('/gameRoom.html', '/index.html');
      window.location.href = newUrl;
    } else if (msg.winners != null ){

    const carousel = document.getElementById('carousel');

    for (const winner of msg.winners){

      carousel.childNodes.forEach(child => {

          if (child.nodeType === 1 && child.tagName.toLowerCase() === 'div' && child.textContent == winner) {
              console.log(child.textContent);
              child.remove();
          }
      });

      if (winner == myName){
        alert("you were voted out!");
        const currentUrl = window.location.href;
        let newUrl = currentUrl.replace('/gameRoom.html', '/index.html');
        window.location.href = newUrl;
      }


    }
    }
    
  }
};

return socket;
}


function readTheVotes(){
event.preventDefault();

if(currentVote == null) {
  return;
}

document.getElementById('voteButton').disabled = true;

const postData = {
      type: "Submit Vote",
      vote: currentVote,
      voter: myName,
      code: code
  };
socket.send(JSON.stringify(postData))

}








function playGame() {
    // Make a GET request to the /user endpoint
    fetch('/user', {
        method: 'GET',
        credentials: 'same-origin' // Include cookies in the request
    })
    .then(response => {
        if (response.ok) {
            var playerName = prompt("Please enter your player name:");
            sessionStorage.setItem("myName", playerName);
            window.location.href = 'waitingRoom.html';
        } else {
            // If user is not logged in, navigate to invitation.html
            window.location.href = 'invitation.html';
        }
    })
    .catch(error => {
        console.error('Error checking user login status:', error);
    });
}

function logout() {
fetch('/logout', {
    method: 'GET',
    credentials: 'same-origin' // Include cookies in the request
})
.then(response => {
    if (response.ok) {
        // Redirect user to the homepage or login page upon successful logout
        window.location.href = 'index.html';
    } else {
        // Handle logout error, e.g., display error message to user
        console.error('Logout failed:', response.statusText);
    }
})
.catch(error => {
    console.error('Error logging out:', error);
});
}




    return (
        <main class="smallPage">
        <table border="1" cellspacing="2" cellpadding="5" >
            <tr>
                <th>
                    Your Secret Word:
                </th>
                 <td id="secretWordDisplay">
                      {/* <!-- Secret Word Generated Here --> */}
                    </td>
            </tr>
            </table>

            <div id="carousel">
              {/* <!-- DIV ELEMENTS INSERTED HERE --> */}
            </div>
      
            <form><button class="button" id="voteButton" onclick="readTheVotes()" >Submit Vote</button></form>
    </main>
    );
  }