// Every Student should have a "Track Chat" buttton added to the sidebar
// On click of that button, a tab will open up over the full chat
// The track button will change to "untrack" which will remove that chat from tab bar
// The tab bar is created when the user is following at least one person, otherwise remove the bar
// Multiple clicks of track button must not create duplicate tabs
// When chats change status, they should be restored as a current chat, not made into a new chat

// Tabs should appear over full window
// Tabs contain a students name and an x button to close the chat
// The tab should know when a student has responded by looking at the blue circle element
// If that is triggered, the chat bar will change from gray to blue
// When the tab is clicked, it should open that student's chat


var chatNodes = document.querySelectorAll('.fc--question-node'); //grabs all questions from side

var fullQuestionList = document.querySelector('.fc--questions-list'); //give dom element of all the questions

chatNodes.forEach(function(chat){
  chat.querySelector()
})

chatNodes[0].querySelector('.heading--level-4').textContent //grabs name

chatNodes[0].querySelector('.media-block__media').innerHtml += '<div>Track Me</div>'; //adds button

chatNodes[0].querySelector('.image-frame__badge--color-blue') // gets unanswered response number if present

// Tab Functions 

rightChat = document.querySelector('.util--anchor__frame > div'); // grab right window

var tabBar = document.createElement("div"); //creates tab bar

tabBar.id = "chat-tab-bar";

tabBar.innerHTML += '<div class="chat-tab" id="chat_1_tab">Student Name - 2 <span class="close-tab">X</span></div>'; //creates tabs Html

rightChat.insertBefore(tabBar, rightChat.firstChild); //adds Tabs

chatNodes.forEach(function(chatNode){
 foo = chatNode.querySelector('.image-frame--fixed-size-large');
 config = { attributes: true, childList: true, characterData: true };
 unrespondedObserver.observe(foo,config)
})



