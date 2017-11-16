export default class Observers {

  constructor(){
    this.sideChatWindow = document.querySelector('.list--last-child-border');
    this.observeSideChat()
  }

  //Exterior function calls
  //  reloadOrCreateStudentQuestion()
  //  findTab()
  //  checkChatStatus()

  observeSideChat(){
    let config = { attributes: true, childList: true, characterData: true };
    this.chatNodeObserver().observe(this.sideChatWindow, config); 
  }


  chatNodeObserver(){
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.addedNodes[0] && mutation.addedNodes[0].classList[0] === 'fc--question-node'){ //possible isQuestionNode function
          let stuQue = reloadOrCreateStudentQuestion(mutation.addedNodes[0]);

          addUnrespondedObserverToChatNode(stuQue.chatNode)
        }
      });    
    });
    return observer
  }

  addUnrespondedObserverToChatNode(chatNode){
    var targetElem = chatNode.querySelector('.image-frame--fixed-size-large');
    var config = { attributes: true, childList: true, characterData: true };
    unrespondedObserver().observe(targetElem, config)
  }

  unrespondedObserver(){
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(mutation) {
        if(mutation.addedNodes[0] || mutation.removedNodes[0]){
          let chatNode = getChatNodeFromUnrespondedObserver(mutation.target);
          let chatId = getChatIdFromChatNode(chatNode);
          let studentQuestion = StudentQuestion.find(chatId);
          studentQuestion.chatNode = chatNode;
          let tab = findTab(chatId);
          checkChatStatus(studentQuestion, tab);
        }
      });     
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