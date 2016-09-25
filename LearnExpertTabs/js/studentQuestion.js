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

function addUnrespondedObserverToChatNode(chatNode){
  targetElem = chatNode.querySelector('.image-frame--fixed-size-large');
  config = { attributes: true, childList: true, characterData: true };
  unrespondedObserver.observe(targetElem, config)
}
