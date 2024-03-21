    localStorage.clear();




    function submitSecretWords() {
        event.preventDefault();

        let word1 = document.getElementById("word1").value;
        let word2 = document.getElementById("word2").value;

        // secretWordPairs.push([word1, word2])
        localStorage.setItem("secretWordPairs", JSON.stringify(secretWordPairs));

        


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
                console.log(response.status);
                // If user is logged in, navigate to waitingRoom.html
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

