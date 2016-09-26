class StudentQuestion{
  constructor(chatNode, chatId){
    this.chatNode = chatNode;
    this.chatId = chatId;
    this.unresponded = !!chatNode.querySelector('.image-frame__badge')
    allStudentQuestions.push(this);
  }

  studentName(){
    return this.chatNode.querySelector('.heading--level-4').textContent
  }

  question(){
    return this.chatNode.querySelector('.util--break-word').textContent
  }

  addTrackerElement(trackerElement){ 
    this.chatNode.querySelector('.media-block__content').innerHTML += trackerElement
  }
}

// initializers

var chatId = 0;
var allStudentQuestions = []; 

function createStudentQuestionsFromDom(){
  var chatNodes = document.querySelectorAll('.fc--question-node');
  chatNodes.forEach(function(chatNode){
    createStudentQuestion(chatNode);
  });
}

// Chat node functions 

function createStudentQuestion(chatNode){
  let newStudentQuestion = new StudentQuestion(chatNode, chatId);
  chatId++;
  newStudentQuestion.addTrackerElement(createTrackerElement(newStudentQuestion.chatId));
  return newStudentQuestion;
}

function addUnrespondedObserverToChatNode(chatNode){
  targetElem = chatNode.querySelector('.image-frame--fixed-size-large');
  config = { attributes: true, childList: true, characterData: true };
  unrespondedObserver.observe(targetElem, config)
}

function getChatIdFromChatNode(chatNode){
  return chatNode.querySelector('.tracker').dataset.chatid 
}

function getTabFromChatId(chatId){
  return document.querySelector('#chat_' + chatId + '_tab');
}

// reloaders
function reloadOrCreateStudentQuestion(chatNode){
  let question = chatNode.querySelector('.util--break-word').textContent;
  let studentName = chatNode.querySelector('.heading--level-4').textContent;
  let found = false;
  let student = '';
  allStudentQuestions.forEach(function(studentQuestion){
    if (!found && studentQuestion.studentName() === studentName && studentQuestion.question() === question){
      reloadTracker(chatNode, studentQuestion);
      found = !found;
      student = studentQuestion
      if(findTab(studentQuestion.chatId)){
        checkChatStatus(studentQuestion, findTab(studentQuestion.chatId))
      }
    }
  });
  if (!found){
    student = createStudentQuestion(chatNode);
    trackStudent(student.chatNode);
  }
  return student;
}

function reloadTracker(chatNode, studentQuestion){
  let trackerElement = createTrackerElement(studentQuestion.chatId);
  chatNode.querySelector('.media-block__content').innerHTML += trackerElement;
  studentQuestion.chatNode = chatNode;
  trackStudent(studentQuestion.chatNode);
}




function createTrackerElement(chatId){
  return '<div class="tracker" data-chatId="'+ chatId +'">Track</div>'
}


// mutators 

var chatNodeObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes[0] && mutation.addedNodes[0].classList[0] === 'fc--question-node'){
      let stuQue = reloadOrCreateStudentQuestion(mutation.addedNodes[0]);
      addUnrespondedObserverToChatNode(stuQue.chatNode)
    }
  });    
});
// This observer needs to be set when nodes are added/removed

var unrespondedObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes[0] || mutation.removedNodes[0]){
      let chatNode = getChatNodeFromUnrespondedObserver(mutation.target);
      let chatId = parseInt(getChatIdFromChatNode(chatNode));
      let studentQuestion = findStudentQuestionByChatId(chatId)
      studentQuestion.chatNode = chatNode;
      let tab = findTab(chatId);
      checkChatStatus(studentQuestion, tab);
    }
  });    
});


function getChatNodeFromUnrespondedObserver(targetNode){
  return targetNode.parentNode.parentNode.parentNode.parentNode
}



// When the unresponded observer triggers, check for matching tab.
// If matching tab exists, change it's unresponded status
// When a tab is created, check it's unresponded status







// Tabs
function createTabBar(){
  let rightChat = document.querySelector('.util--anchor__frame > div'); 
  let tabBar = document.createElement("div");
  tabBar.id = "chat-tab-bar";
  rightChat.insertBefore(tabBar, rightChat.firstChild);
  return tabBar;
}

function createTab(studentQuestion){
  document.querySelector('#chat-tab-bar').innerHTML += buildTabHtml(studentQuestion);
  let tabs = document.querySelectorAll('#chat-tab-bar > .chat-tab')
  let tabElement = document.querySelector('#chat-tab-bar').lastChild;
  attachTabListener(tabs);
  checkChatStatus(studentQuestion, tabElement);
  addUnrespondedObserverToChatNode(studentQuestion.chatNode)
}

function buildTabHtml(studentQuestion){
  let chatTab = '<div class="chat-tab" id="chat_' + studentQuestion.chatId +'_tab" ' 
  chatTab += 'data-chatId="' + studentQuestion.chatId +'">'+ studentQuestion.studentName();
  chatTab += ' <span class="close-tab">x</span></div>';
  return chatTab;
}

function checkChatStatus(studentQuestion, tab){
  if (studentQuestion.chatNode.querySelector('.image-frame__badge--color-blue') && tab) {
    tab.classList.add('unresponded');
  } else if(!studentQuestion.chatNode.querySelector('.image-frame__badge--color-blue') && tab) {
    tab.classList.remove('unresponded');
  }
}

function findStudentQuestionByChatId(chatId){
  var studentQuestionMatch;
  allStudentQuestions.forEach(function(studentQuestion){
    if (studentQuestion.chatId === chatId){
      studentQuestionMatch = studentQuestion;
    }
  })
  return studentQuestionMatch;
}

function toggleUnresponded(tab){
  tab.classList.toggle('unresponded')
} 

function findTab(chatId){
  return document.querySelector('#chat_' + chatId + '_tab')
}

// Event Listeners

function attachTabListener(tabs){
  tabs.forEach(function(tab){
    tabClick(tab);
    closeTab(tab);
  });
}

function closeTab(tab){
  tab.querySelector('.close-tab').addEventListener('click', function(e){
    tab.parentNode.removeChild(tab);
  })
}

function tabClick(tab){
  tab.addEventListener('click', function(e){
    let chatId = parseInt(e.srcElement.dataset.chatid);
    let foundStudentQuestion = findStudentQuestionByChatId(chatId);
    if (foundStudentQuestion) {
      foundStudentQuestion.chatNode.click();
    }  
  });
}

function attachTrackStudentListeners(){
  allStudentQuestions.forEach(function(studentQuestion){
    trackStudent(studentQuestion.chatNode);
  });
}

function trackStudent(studentNode){
 studentNode.querySelector('.tracker').addEventListener('click', function(e){
  let chatId = parseInt(e.srcElement.dataset.chatid);
  let studentQuestionReturn = findStudentQuestionByChatId(chatId);
  if (!document.querySelector('#chat-tab-bar')){
    createTabBar();
    createTab(studentQuestionReturn);
  } else {
    createTab(studentQuestionReturn);
  }
 });
}

function observeSideChat(sideChatWindow){
  var config = { attributes: true, childList: true, characterData: true };
  chatNodeObserver.observe(sideChatWindow, config); 
}

const sideChatWindow = document.querySelector('.list--last-child-border');



// To Run

createStudentQuestionsFromDom();
observeSideChat(sideChatWindow);
attachTrackStudentListeners();
