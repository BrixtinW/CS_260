# CS_260

### Progress
- [x] Specification Deliverable
- [x] HTML Deliverable
- [x] CSS Deliverable
- [ ] JavaScript Deliverable
- [ ] Service Deliverable
- [ ] Database/Login Deliverable
- [ ] WebSocket Deliverable
- [ ] React Deliverable

## Specification Deliverable

### **Elevator Pitch** 
Have you ever played a social game like Mafia or One Night Werewolf and been frustrated about having to download an app or designate someone as a host before you can play it? Have you ever wanted to play remotely or ensure that no one changes their votes last minute? The Odd-One-Out website provides a simple and easy-to-use interface that the whole family can enjoy. With a brand new perspective on traditional social games, players have to figure out what team they are on in the game based on other players' responses. Unlike other social games, Odd-One-Out will keep everyone guessing until the very end!

### **Game Rules**
The game begins when everyone receives the same "secret word" except the Odd-One-Out who receives a similar but slightly different word. Starting with a random player determined by the application, each player takes turns clockwise, describing their "secret word" with another word while trying to avoid giving away their identity as the potential Odd-One-Out. The other players must use their detective skills to figure out who has a different word and vote on who they think the Odd-One-Out is. If they vote the Odd-One-Out, the Odd-One-Out has one chance to guess what everyone else's word is. If the Odd-One-Out guesses the word correctly or if they are never voted out, they win. If not, everyone else wins. 

### **Design**
There are four main pages. The first displays the login where you enter your username.

  ![Instructions page for the web app](Heading.jpg)
  
  The second is the waiting room that the host creates and where players wait to start.
  
  ![Waiting room for the web app](2.jpg)
  
  The third is the page with the instructions that will detail how to play the game. This page can be checked in the middle of the game for reference.
  
  ![Instructions page for the web app](1.jpg)
  
  The last page is the game page that displays the Secret Word and the voting feature. 
  
  ![Main game page for the web app](3.jpg)

### **Key Features**
The project will showcase the following features
- Ability to host and join game groups
- Outline of game instructions
- Distribution of "secret words"
- Moderate player guesses and reveal player teams

### **Technologies**
I will implement the following technologies:
- **HTML** - Four HTML pages for hosting a game, joining a game, and voting on the Odd-One-Out.
- **CSS** - Intuitive game display that fits well on mobile devices, featuring a game instructions tab, voting buttons, and a "secret word card". 
- **JavaScript** - Manages players' votes and creates game rooms.
- **Service** - Backend structure that helps in handling "secret word" choices, voting status, voting verdict, player status, and authentification.
- **Database** - Stores and retrieves "secret word" pairs and players' scores in a database.
- **WebSocket** - communicates players' votes and the voting verdict. 
- **React** - Utilizes the React framework for effective design and a professional display.

## HTML Deliverable
- **HTML** - Four HTML pages; the home page; the join game page; the waiting room page; and the gameroom page.
- **Links** - The Header tag links all four pages together as well as four other buttons that allow joining and hosting a game.
- **Text** - Overview and an About section for the game are listed on the home page as well as Instructions on the waiting room page. 
- **Images** - Spy images are included for each player's voting card as well as a spy icon on the tab for each page
- **Database** - Stores the user's name, votes, and secret words in a database. Also accepts submissions for secret word pairs.
- **WebSocket** - Will display the voting results as well as players' identities after the voting concludes.

 ## CSS Deliverable
- **Prerequisites** - Simon CSS deployed, link to GitHub in the footer, git commits spread throughout the assignment period and notes in README.md file completed
- **Organization** - Header, footer, and main content completed
- **Navigation** - Navigation through links in the header and the buttons on the page
- **Resizing** - Window and elements responsive to resizing
- **Images** - Includes images on the home page, character icons, and the spicon on the tab. 
- **Text** - Text content with imported fonts and detailed instructions on the game. 

<!-- ## JavaScript Deliverable

## Service Deliverable

## Database Deliverable

## WebSocket Deliverable

## React Deliverable --!>


<!-- 
The game is called odd one out or something
everyone gets a word and one person gets a slightly different word (the odd one out). starting with one random player, everyone says a word that indirectly points to their shared word. after everyone says one word to show they have the same word, they guess on one person to eliminate who they think is the odd one out. if they guess correctly, the odd one out has one chance to guess the correct word. If they guess correctly, they win. if they guess incorrectly everyone else wins. if they guess someone who isnt the odd one out, then that last person is eliminated from the game. the odd one out does not know that they are the odd one out. 

--!>
