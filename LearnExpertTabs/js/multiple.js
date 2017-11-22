import StudentQuestion from './studentQuestion'

export function findTab(chatId){
  return document.querySelector('#chat_' + chatId + '_tab')
}


export function checkChatStatus(studentQuestion, tab){
  if (studentQuestion.chat.html.querySelector('.image-frame__badge--color-blue') && tab && !tab.classList.contains("requires-action")) {
    tab.classList.add('unresponded');
    !StudentQuestion.unrespondedChats.includes(studentQuestion.chatId) ? StudentQuestion.unrespondedChats.push(studentQuestion.chatId) : null
  } else if(!studentQuestion.chat.html.querySelector('.image-frame__badge--color-blue') && tab) {
    tab.classList.remove('unresponded');
    StudentQuestion.unrespondedChats = StudentQuestion.unrespondedChats.filter((id)=> id != studentQuestion.chatId )
  }
}
