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

let chatId = 0;
let allStudentQuestions = [];
let options = {}

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
  tabActionOnStatus(newStudentQuestion.chatNode);
  return newStudentQuestion;
}

function addUnrespondedObserverToChatNode(chatNode){
  targetElem = chatNode.querySelector('.image-frame--fixed-size-large');
  config = { attributes: true, childList: true, characterData: true };
  unrespondedObserver.observe(targetElem, config)
}

function getChatIdFromChatNode(chatNode){
  return parseInt(chatNode.querySelector('.tracker').dataset.chatid) 
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
        tabActionOnStatus(studentQuestion.chatNode)
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
  let rightChat = document.querySelectorAll('.list.list--separators-grey-faint')[1]; 
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
  tabActionOnStatus(studentQuestion.chatNode);
}

function buildTabHtml(studentQuestion){
  let chatTab = '<div class="chat-tab" id="chat_' + studentQuestion.chatId +'_tab" ' 
  chatTab += 'data-chatId="' + studentQuestion.chatId +'">'+ normalizedName(studentQuestion.studentName());
  chatTab += ' <span class="close-tab">x</span></div>';
  return chatTab;
}

function normalizedName(name){
  if (name.includes("@")) {
    return name.slice(0, name.search("@"))
  } else {
    return name
  }
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

function tabActionOnStatus(chatNode){
  let chatId = getChatIdFromChatNode(chatNode);
  switch(findActivityStatus(chatNode)) {
    case 1:
      requiresActionStatusAction(chatId)
      break;
    case 2:
      activeStatusAction(chatId)
      break;
    case 3:
      inactiveStatusAction(chatId)
      break;
    case 4:
      resolvedStatusAction(chatId)
      break;
    default:
      break;
  }
}

function findActivityStatus(chatNode){
  let siblings = chatNode.parentNode.childNodes;
  let i = 0;
  let headersPassed = 0
  while (siblings[i] != chatNode ){
    if (siblings[i].classList.contains("fc--question-section-header")){
      headersPassed++
    }
    i++ 
  }
  return headersPassed
}

function requiresActionStatusAction(chatId){
  let tab = findTab(chatId);
  if (!tab && options.autotab){
    let studentQuestion = findStudentQuestionByChatId(chatId);
    addTabToDom(studentQuestion);
  } else if (tab) {
    tab.classList.remove('unresponded')
    tab.classList.add('requires-action')
  }
}

function inactiveStatusAction(chatId){
  let tab = findTab(chatId);
  if (tab) {
    tab.classList.add('inactive-chat')
  }
}

function resolvedStatusAction(chatId){
  let tab = findTab(chatId);
  if (tab) {
    tab.querySelector('.close-tab').click()
  }
}

function activeStatusAction(chatId){
  let tab = findTab(chatId);
  if (tab) {
    tab.classList.remove('inactive-chat', 'requires-action')
  }
}


// Event Listeners

function attachTabListener(tabs){
  tabs.forEach(function(tab){
    tabClick(tab);
    closeTab(tab);
  });
}

function closeTab(tab){ //name needs to be changed 
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
  addTabToDom(studentQuestionReturn);
 });
}

function addTabToDom(studentQuestion){
  if (!document.querySelector('#chat-tab-bar')){
    createTabBar();
    createTab(studentQuestion);
  } else {
    createTab(studentQuestion);
  }
}

function observeSideChat(sideChatWindow){
  let config = { attributes: true, childList: true, characterData: true };
  chatNodeObserver.observe(sideChatWindow, config); 
}

const sideChatWindow = document.querySelector('.list--last-child-border');

function getOptions(){
  chrome.storage.sync.get({
    autotab: true
  }, function(items) {
    options.autotab = items.autotab;
  });
}



// To Run


function start(){
  getOptions();
  createStudentQuestionsFromDom();
  observeSideChat(sideChatWindow);
  attachTrackStudentListeners();
}

start()

