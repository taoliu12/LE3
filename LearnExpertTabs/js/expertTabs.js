class StudentQuestion{
  constructor(chatNode, chatId){
    this.chatNode = chatNode;
    this.chatId = chatId;
    this.unresponded = !!chatNode.querySelector('.image-frame__badge')
    allStudentQuestions.push(this);
    this.response = ''
    this.questionLink = chatNode.querySelector('span.util--padding-lm a').href
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
let currentStudent = null
let unrespondedChats = [];

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
  let found = false, student = '', tab = null;
  allStudentQuestions.forEach(function(studentQuestion){
    if (!found && studentQuestion.studentName() === studentName && studentQuestion.question() === question){
      reloadTracker(chatNode, studentQuestion);
      found = !found;
      student = studentQuestion
      if(tab = findTab(studentQuestion.chatId)){
        checkChatStatus(studentQuestion, tab)
        tabActionOnStatus(studentQuestion.chatNode)
      }
    }
  });
  if (!found){
    student = createStudentQuestion(chatNode);
    trackStudent(student.chatNode);
  }
  attachCurrentStudentListener(student)
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

// Tabs
function createTabBar(){
  let rightChat = document.querySelectorAll('.list.list--separators-grey-faint')[1]; 
  let tabBar = document.createElement("div");
  tabBar.id = "chat-tab-bar";
  rightChat.insertBefore(tabBar, rightChat.firstChild);
  return tabBar;
}

function createTab(studentQuestion){
  let tabBar = document.querySelector('#chat-tab-bar')
  let newTab =  buildTab(studentQuestion);
  let tabElement = document.querySelector('#chat-tab-bar').lastChild;

  tabBar.append(newTab)
  attachTabListener(newTab);
  checkChatStatus(studentQuestion, newTab);
  addUnrespondedObserverToChatNode(studentQuestion.chatNode)
  tabActionOnStatus(studentQuestion.chatNode);
}

function buildTab(studentQuestion){
  let tab = document.createElement('div')
  let closeButton = document.createElement('span')
  closeButton.setAttribute('class', 'close-tab')
  tab.classList.add("chat-tab")
  tab.setAttribute('id', `chat_${studentQuestion.chatId}_tab`)
  tab.setAttribute('data-chatId', `${studentQuestion.chatId}`)



  let x = document.createTextNode("x")
  let name = document.createTextNode(normalizedName(studentQuestion.studentName()))
  
  closeButton.appendChild(x)
  tab.appendChild(name)
  tab.appendChild(closeButton);

 return tab
}

function normalizedName(name){
  if (name.includes("@")) {
    return name.slice(0, name.search("@")) + " "
  } else {
    return name
  }
}


function checkChatStatus(studentQuestion, tab){
  if (studentQuestion.chatNode.querySelector('.image-frame__badge--color-blue') && tab && !tab.classList.contains("requires-action")) {
    tab.classList.add('unresponded');
    !unrespondedChats.includes(studentQuestion.chatId) ? unrespondedChats.push(studentQuestion.chatId) : null
  } else if(!studentQuestion.chatNode.querySelector('.image-frame__badge--color-blue') && tab) {
    tab.classList.remove('unresponded');
    unrespondedChats = unrespondedChats.filter((id)=> id != studentQuestion.chatId )
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
    unrespondedChats = unrespondedChats.filter((id)=> id != chatId )
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

function attachCurrentStudentListener(student){
  let response = document.querySelector('#js--admin-txt-input')

  student.chatNode.addEventListener('click', function(e){

    if (currentStudent){
      currentStudent.response = response.value
    }


    currentStudent = student
    response.value = currentStudent.response
    response.focus()
  })

}

function attachTabListener(tab){
  tabClick(tab);
  closeTab(tab);
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
  if(!document.querySelector(`#chat_${chatId}_tab `)){
    let studentQuestionReturn = findStudentQuestionByChatId(chatId);
    addTabToDom(studentQuestionReturn);
  }
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


// Key Commands
function addKeyCommandListener(){
  document.addEventListener ("keydown", function (e) {
    let tabs = document.querySelector('#chat-tab-bar').children

    //keys 1-9
    if (e.metaKey  &&  e.altKey  && e.code.slice(0,-1) === "Digit" && 
        parseInt(e.code[5]) > 0 && parseInt(e.code[5]) < 10) {
      tabs[parseInt(e.code[5]) - 1].click()
    }
    // 0
    if (e.metaKey  &&  e.altKey  &&  e.code === 'Digit0') {
      tabs[tabs.length - 1].click()
    }
    // <,
    if (e.metaKey  &&  e.altKey  &&  e.code === 'Comma') {
      findTab(currentStudent.chatId).previousSibling.click()
    }
    //.>
    if (e.metaKey  &&  e.altKey  &&  e.code === 'Period') {
      findTab(currentStudent.chatId).nextSibling.click()  
    }
    // tab
    if (e.metaKey  &&  e.altKey  &&  e.code === 'Tab') {
      if (currentStudent.chatId === unrespondedChats[0]){
        findTab(unrespondedChats[1]).click()
      } else {
        findTab(unrespondedChats[0]).click()  
      }
    }

    if (e.metaKey  &&  e.altKey  &&  e.code === 'KeyA') {
     copyQueueLink(currentStudent)
    }
  });
}


function copyQueueLink(stQ){
  ele = createCopyElement();
  ele.value = 'qbot queue ' + stQ.questionLink +" "+ normalizedName(stQ.studentName());

  document.body.appendChild(ele);
  ele.select();
  document.execCommand('copy');
  document.body.removeChild(ele);
}

function createCopyElement(){
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  return textArea
}



// To Run
function start(){
  getOptions();
  createStudentQuestionsFromDom();
  observeSideChat(sideChatWindow);
  attachTrackStudentListeners();
  addKeyCommandListener();
}


setTimeout(start, 4000);