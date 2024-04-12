// globalState.js

import { useState } from 'react';

// Initialize global state variables
export const useGlobalState = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [secretWord, setSecretWord] = useState("");
  const [voteButton, setVoteButton] = useState(false);
  let currentVote = null;
  let socket = null;
  const code = sessionStorage.getItem('code');
  const myName = sessionStorage.getItem('myName');

  return {
    selectedPlayer,
    setSelectedPlayer,
    players,
    setPlayers,
    secretWord,
    setSecretWord,
    voteButton,
    setVoteButton,
    currentVote,
    socket,
    code,
    myName
  };
};