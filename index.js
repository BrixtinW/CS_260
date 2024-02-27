document.addEventListener("DOMContentLoaded", function() {
    // Get the host game button
    var hostGameButton = document.getElementById("hostGameButton");

    // Add click event listener to the host game button
    hostGameButton.addEventListener("click", function(event) {
        // Navigate to the waiting room page
        window.location.href = "waitingRoom.html";
    });
});












function loadGameRoom() {

    console.log("BUTTON PRESSED BUT NOTHING HAPPENED?????")

        // Find and copy all div elements under the carousel
        var carouselDivs = document.querySelectorAll("#carousel .item");
        var copiedDivs = [];
        carouselDivs.forEach(function(div) {
            var copiedDiv = div.cloneNode(true); // Clone the div element
            copiedDivs.push(copiedDiv); // Add the cloned div to the copiedDivs array
        });

        // Store the copied divs in localStorage to pass them to the next page
        sessionStorage.setItem("copiedDivs", JSON.stringify(copiedDivs));

        // Navigate to the next page
        window.location.href = "gameRoom.html";
};
