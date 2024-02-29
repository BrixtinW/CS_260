    localStorage.clear();

    let users = [
        { username: "user1", password: "password1" },
        { username: "user2", password: "password2" }
    ];

    console.log(users);


    let secretWordPairs = [
        ["secret", "Octopus"],
        ["word", "Octopus"],
        ["pairs", "Octopus"]]

    console.log(secretWordPairs);


    localStorage.setItem("usersData", JSON.stringify(users));
    localStorage.setItem("secretWordPairs", JSON.stringify(secretWordPairs));
    console.log(localStorage)




    function submitSecretWords() {
        event.preventDefault();
        
        let word1 = document.getElementById("word1").value;
        let word2 = document.getElementById("word2").value;


        secretWordPairs.push([word1, word2])
        localStorage.setItem("secretWordPairs", JSON.stringify(secretWordPairs));

        console.log("Local Storage Updated!!!", localStorage)
        
    }