import React from 'react';
import '/./src/app.css';


export function Login() {


    function authenticate() {
        let usernameInput = document.getElementById("username").value;
        let passwordInput = document.getElementById("password").value;

        const postData = {
          "username": `${usernameInput}`,
          "password": `${passwordInput}`
        };

        const userExists = fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        })
        .then(response => {
          if (!response.ok) {
            alert("Invalid username or password");
          }
          return response.json();
        })
        .then(data => {
          console.log('Player logged in called:', data);

          if (data) {

            const currentUrl = window.location.href;
            let newUrl = currentUrl.replace('login', 'waitingRoom');
            window.location.href = newUrl;
 
        } else {
            alert("Invalid username or password");
        }

        })
        .catch(error => {
          console.error('Error adding player:', error);
        });
    }

    function registerUser() {
        let usernameInput = document.getElementById("username").value;
        let passwordInput = document.getElementById("password").value;

        const postData = {
          "username": `${usernameInput}`,
          "password": `${passwordInput}`
        };

        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        })
        .then(response => {
          if (!response.ok) {
            alert("User already exists")
            
          } else {


            const currentUrl = window.location.href;
            let newUrl = currentUrl.replace('login', 'waitingRoom');
            window.location.href = newUrl;


          }
          return response.json();
        })
        .then(data => {
          console.log('Player registered successfully:', data);
        })
        }




    return (
        <main className="smallPage">
        <h1>Sign in</h1>
        <p>Enter your information and sign in if you've played Odd One Out previouly, or register if its your first time.</p>
  
        <form>
          <a className="button" onClick={authenticate}>Sign In</a>   
          <a className="button" onClick={registerUser}>Register</a>   
          <input type="text" className="textbox" id="username" placeholder="Enter username" /> 
          <input type="text" className="textbox" id="password" placeholder="Enter password" /> 
        </form>
      </main>
    );
  }