    localStorage.clear();




    function submitSecretWords() {
        event.preventDefault();

        let word1 = document.getElementById("word1").value;
        let word2 = document.getElementById("word2").value;

        // secretWordPairs.push([word1, word2])
        // localStorage.setItem("secretWordPairs", JSON.stringify(secretWordPairs));

        


        alert(`Secret word candidates "${word1}" and "${word2}" submitted!`)


        
    }