import React from 'react';
import '/./src/app.css';

export function Home() {

    sessionStorage.clear();




    function submitSecretWords() {
        event.preventDefault();

        let word1 = document.getElementById("word1").value;
        let word2 = document.getElementById("word2").value;

        // secretWordPairs.push([word1, word2])
        sessionStorage.setItem("secretWordPairs", JSON.stringify(secretWordPairs));

        


        alert(`Secret word candidates "${word1}" and "${word2}" submitted!`)


        
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



    return (
        <main>
        <h1 id="welcome">Welcome to Odd One Out</h1>
        <p id="pitch">Odd One Out is a game of deception, strategy and espionage. Do you have what it takes to survive being the Odd One Out?</p>
        
      <form method="get">
        <a className="button" onClick="playGame()">Play Game</a>      
      </form>
        
        <p id="guide">If you're ready to join in the fun, click Sign in to sign up or register</p>
  
        
        <h2 className="tab" id="overview">Overview</h2>
        <p className="folder">The game begins when everyone receives the same "secret word" except the Odd-One-Out who receives a similar but slightly different word. Starting with a random player, each player takes turns clockwise, describing their "secret word" with another word while trying to not give away their identity as the potential Odd-One-Out. The other players must use their detective skills to figure out who has a different word and vote on who they think the Odd-One-Out is. If they vote the Odd-One-Out, the Odd-One-Out has one chance to guess what everyone else's word is. If the Odd-One-Out guesses the word correctly or if they are never voted out, they win. If not, everyone else wins. </p>
        
         <h2 className="tab" id="SSWP">Submit Secret Word Pairs</h2>
        <p className="folder" id="wordPairInstructions">You have the chance to submit your own secret word pairs and help the Odd One Out community! Simply enter your word pair in the boxes below.</p>
        <form>
          <button className="button" onClick="submitSecretWords()">Submit Words</button>
          <input type="text" className="textbox" id="word1" placeholder="Enter first word" /> 
          <input type="text" className="textbox" id="word2" placeholder="Enter second word" /> 
        </form>
        
        <h2 className="tab" id="about">About</h2>
        <p className="folder" id="aboutParagraph">This page was completed by Brixtin Walker as a part of the coursework for CS 260, Web Development.</p>
      
      </main>
    );
  }