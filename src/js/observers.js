import findTab from './multiple';
import Chat from './chatNode';
import StudentQuestion from './studentQuestion'
export default class Observers {

  constructor(){
    this.sideChatWindow = document.querySelector('.list--last-child-border');
    this.observeSideChat()
  }

  reloadOrCreateStudentQuestion(chatHtml){ 
    let chat = new Chat(chatHtml)
    let found = false, student = '', tab = null;
    for (let studentQuestion of StudentQuestion.all){
      if (!found && studentQuestion.chat.name === chat.name && studentQuestion.chat.timeOpened === chat.timeOpened){
        studentQuestion.reloadTracker(chat);
        found = !found;
        student = studentQuestion
        if(tab = findTab(studentQuestion.chatId)){
          studentQuestion.checkChatStatus(tab)
          studentQuestion.tabActionOnStatus();
        }
      }
    }

    if (!found){
      student = StudentQuestion.create(chat);
      student.trackStudent();
      student.tabActionOnStatus();
    }
    student.attachCurrentStudentListener();
    return student;
  }

  observeSideChat(){
    let config = { attributes: true, childList: true, characterData: true };
    this.chatNodeObserver().observe(this.sideChatWindow, config); 
  }


  chatNodeObserver(){
    var observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if(mutation.addedNodes[0] && mutation.addedNodes[0].classList[0] === 'fc--question-node'){ //possible isQuestionNode function
          let stuQue = this.reloadOrCreateStudentQuestion(mutation.addedNodes[0]);

          this.addUnrespondedObserverToChatNode(stuQue.chat.html)
        }
      }    
    });
    return observer
  }

  addUnrespondedObserverToChatNode(chatNode){
    var targetElem = chatNode.querySelector('.image-frame--fixed-size-large');
    var config = { attributes: true, childList: true, characterData: true };
    this.unrespondedObserver().observe(targetElem, config)
  }

  unrespondedObserver(){
    var observer = new MutationObserver(mutations => {
      for (let mutation of mutations){
        if(mutation.addedNodes[0] || mutation.removedNodes[0]){
          let chatNode = this.getChatNodeFromUnrespondedObserver(mutation.target);
          let chatId = this.getChatIdFromChatNode(chatNode);
          let studentQuestion = StudentQuestion.find(chatId);
          var tab = findTab(chatId);
          studentQuestion.checkChatStatus(tab);
        }
      }     
    });
    return observer;
  }


  getChatNodeFromUnrespondedObserver(targetNode){
    return targetNode.parentNode.parentNode.parentNode.parentNode
  }


  getChatIdFromChatNode(chatNode){
    return parseInt(chatNode.querySelector('.tracker').dataset.chatid) 
  }

}