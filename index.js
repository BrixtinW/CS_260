    localStorage.clear();

    let users = [
        { username: "user1", password: "password1" },
        { username: "user2", password: "password2" }
    ];

    console.log(users);


    localStorage.setItem("usersData", JSON.stringify(users));
    console.log(localStorage)