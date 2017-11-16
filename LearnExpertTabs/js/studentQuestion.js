export default class StudentQuestion{
  constructor(chat, chatId){
    this.chat = chat;
    this.chatId = chatId;
    this.response = ''
    

     StudentQuestion.all.push(this);
  }

  addTrackerElement(){ 
    this.chatNode.querySelector('.media-block__content').innerHTML += createTrackerElement()
  }


  normalizedName(){
    let name = this.chatNode.name
    if (name.includes("@")) {
      return name.slice(0, name.search("@")) + " "
    } else {
      return name
    }
  }

  createTrackerElement(){
    return '<div class="tracker" data-chatId="'+ this.chatId +'">Track</div>'
  }

  tabActionOnStatus(){
    switch(this.chatNode.findActivityStatus()) {
      case 1:
        requiresActionStatusAction(this.chatId)
        break;
      case 2:
        activeStatusAction(this.chatId)
        break;
      case 3:
        inactiveStatusAction(this.chatId)
        break;
      case 4:
        resolvedStatusAction(this.chatId)
        break;
      default:
        break;
    }
  }

  requiresActionStatusAction(chatId){
    let tab = findTab(chatId);
    if (!tab && options.autotab){
      let studentQuestion = StudentQuestion.find(chatId);
      Tab.create(studentQuestion);
    } else if (tab) {
      tab.classList.remove('unresponded')
      unrespondedChats = unrespondedChats.filter((id)=> id != chatId )
      tab.classList.add('requires-action')
    }
  }

  inactiveStatusAction(chatId){
    let tab = findTab(chatId);
    if (tab) {
      tab.classList.add('inactive-chat')
    }
  }

  resolvedStatusAction(chatId){
    let tab = findTab(chatId);
    if (tab) {
      tab.querySelector('.close-tab').click()
    }
  }

  activeStatusAction(chatId){
    let tab = findTab(chatId);
    if (tab) {
      tab.classList.remove('inactive-chat', 'requires-action')
    }
  }

  trackStudent(){ // should be split into two functions, trackStudent and attachTrackStudent
    this.chat.html.querySelector('.tracker').addEventListener('click', function(e){
    let chatId = parseInt(e.srcElement.dataset.chatid);
    if(!document.querySelector(`#chat_${chatId}_tab `)){
      let foundStudent = StudentQuestion.find(chatId);
      Tab.create(foundStudent);
    }
   });
  }

  reloadTracker(chat){
    chat.html.contentBlock.innerHTML += createTrackerElement();
    studentQuestion.chat = chat;
    studentQuestion.trackStudent();
  }


  attachCurrentStudentListener(student){
    let response = document.querySelector('#js--admin-txt-input')

    this.chat.html.addEventListener('click', e => {

      if (StudentQuestion.currentStudent){
        StudentQuestion.currentStudent.response = response.value
      }


      StudentQuestion.currentStudent = this
      response.value = StudentQuestion.currentStudent.response
      response.focus()
    })

  }


  // CLASS METHODS

  static find(chatId){
    StudentQuestion.all.forEach(function(stQ){
      if (stQ.chatId === chatId){
        return stQ;
      }
    })
  }

  static create(chatNode){
    let newStudentQuestion = new StudentQuestion(chatNode, StudentQuestion.chatId);
    StudentQuestion.chatId++;
    newStudentQuestion.addTrackerElement();
    newStudentQuestion.tabActionOnStatus();
    return newStudentQuestion;
  }

  static init(){
    this.all = [];
    this.chatId = 0;
    this.currentStudent = null;
  }
}




