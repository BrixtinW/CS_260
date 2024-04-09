import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameRoom } from './gameRoom/gameRoom';
import { Home } from './home/home';
import { Login } from './login/login';
import { WaitingRoom } from './waitingRoom/waitingRoom';
import './app.css';

export default function App() {
  return (
  <div class="app">

        <header>
            <h1 id= "logo">Odd One Out</h1>
            <nav>
            <a href="index.html">Home</a>
            <a onclick="playGame()">Play Game</a>
            </nav>
        </header>

  <main>


    Components go here

    <GameRoom />
    <Home />
    <Login />
    <WaitingRoom />


  </main>

        <footer>
            <span class="footer-info">Brixtin Walker</span>
            <span class="footer-info">brixtinlwalker@gmail.com</span>
            <span class="footer-info">CS 260</span>
            <br />
            <a href="https://github.com/BrixtinW/CS_260">GitHub</a>
        </footer>

</div>
)
}