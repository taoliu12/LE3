import StudentQuestion from './studentQuestion'
import Tab from './tab'
import Observers  from './observers'
import KeyCommands from './keyCommands'

export default function Run() {

// initializers
let options = {}
let unrespondedChats = [];
Tab.init()
StudentQuestion.init()
observer = new Observers
new KeyCommands

//Page interaction logic

function createStudentQuestionsFromDom(){
  var chatNodes = document.querySelectorAll('.fc--question-node');
  chatNodes.forEach(function(chatNode){
    let stQ = StudentQuestion.create(chatNode);
    stQ.trackStudent()
  });
}

function findTab(chatId){
  return document.querySelector('#chat_' + chatId + '_tab')
}


function checkChatStatus(studentQuestion, tab){
  if (studentQuestion.chatNode.html.querySelector('.image-frame__badge--color-blue') && tab && !tab.classList.contains("requires-action")) {
    tab.classList.add('unresponded');
    !unrespondedChats.includes(studentQuestion.chatId) ? unrespondedChats.push(studentQuestion.chatId) : null
  } else if(!studentQuestion.chatNode.html.querySelector('.image-frame__badge--color-blue') && tab) {
    tab.classList.remove('unresponded');
    unrespondedChats = unrespondedChats.filter((id)=> id != studentQuestion.chatId )
  }
}

// reloaders
function reloadOrCreateStudentQuestion(chatHtml){
  let chat = new Chat(chatHtml)
  let found = false, student = '', tab = null;
  StudentQuestion.all.forEach(function(studentQuestion){
    if (!found && studentQuestion.chat.name === chat.name && studentQuestion.chat.question === chat.question){
      reloadTracker(chatNode.html, studentQuestion);
      found = !found;
      student = studentQuestion
      if(tab = findTab(studentQuestion.chatId)){
        checkChatStatus(studentQuestion, tab)
        studentQuestion.tabActionOnStatus()
      }
    }
  });

  if (!found){
    student = StudentQuestion.create(chat);
    student.trackStudent();
  }
  student.attachCurrentStudentListener();
  return student;
}




// Event Listeners


function getOptions(){
  chrome.storage.sync.get({
    autotab: true
  }, function(items) {
    options.autotab = items.autotab;
  });
}


// To Run
function start(){
  getOptions(); //CHECK!
  createStudentQuestionsFromDom();
}



}

