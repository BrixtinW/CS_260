import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home } from './home/home';
import { Login } from './login/login';
import { WaitingRoom } from './waitingRoom/waitingRoom';
import './app.css';

export default function App() {

    const [authorized, setAuthState] = React.useState(false);

    // function playGame() {

        // Make a GET request to the /user endpoint
        fetch('/user', {
            method: 'GET',
            credentials: 'same-origin' // Include cookies in the request
        })
        .then(response => {
            if (response.ok) {
                setAuthState(true);
            } else {
                setAuthState(false);
            }
        })
        .catch(error => {
            console.error('Error checking user login status:', error);
        });
    // }




  return (

  <div className="app">


    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    
    
    
    {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap"> */}

    <title>Odd One Out</title>
    <link rel="icon" href="spy_icon_205840.ico" />
    {/* </head> */}

        {/* <header>
            <h1 id= "logo">Odd One Out</h1>
            <nav>
            <a href="index.html">Home</a>
            <a onclick="playGame()">Play Game</a>
            </nav>
        </header> */}


  <BrowserRouter>
      <div>
        <header >
        <h1 id= "logo">Odd One Out</h1>
          <nav >
            <menu className='navbar-nav'>
              <li className='nav-item'>
                <NavLink className='nav-link' to=''>
                  Home
                </NavLink>
              </li>
                <li className='nav-item'>
                  <NavLink className='nav-link' onClick="login">
                    Login
                  </NavLink>
                </li>
                {authorized === true && (
                <li className='nav-item'>
                  <NavLink className='nav-link' to='waitingRoom'>
                    Play Game
                  </NavLink>
                </li>
              )}
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/waitingRoom' element={<WaitingRoom />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>



        <footer>
            <span className="footer-info">Brixtin Walker</span>
            <span className="footer-info">brixtinlwalker@gmail.com</span>
            <span className="footer-info">CS 260</span>
            <br />
            <a href="https://github.com/BrixtinW/CS_260">GitHub</a>
        </footer>

      </div>
    </BrowserRouter>


        {/* <footer>
            <span class="footer-info">Brixtin Walker</span>
            <span class="footer-info">brixtinlwalker@gmail.com</span>
            <span class="footer-info">CS 260</span>
            <br />
            <a href="https://github.com/BrixtinW/CS_260">GitHub</a>
        </footer> */}

</div>

)}


function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }
  