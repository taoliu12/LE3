import {findTab, checkChatStatus, unrespondedChats} from './multiple'
import Tab from './tab'
import StudentQuestion from './studentQuestion'
import Observers  from './observers'
import KeyCommands from './keyCommands'

export default function Run() {

// initializers
let options = {};
Tab.init()
StudentQuestion.init()
let observer = new Observers
new KeyCommands

// Not needed 
// function createStudentQuestionsFromDom(){
//   var chatNodes = document.querySelectorAll('.fc--question-node');
//   chatNodes.forEach(function(chatNode){
//     let stQ = StudentQuestion.create(chatNode);
//     stQ.trackStudent()
//   });
// }

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

