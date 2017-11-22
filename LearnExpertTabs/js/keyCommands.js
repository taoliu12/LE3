import {findTab, checkChatStatus } from './multiple'
import StudentQuestion from './studentQuestion'
export default class KeyCommands {

  constructor(){
    this.addKeyCommandListener();
  }
  
  addKeyCommandListener(){
    document.addEventListener ("keydown", e => {
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
        findTab(StudentQuestion.currentStudent.chatId).previousSibling.click()
      }
      //.>
      if (e.metaKey  &&  e.altKey  &&  e.code === 'Period') {
        findTab(StudentQuestion.currentStudent.chatId).nextSibling.click()  
      }
      // tab
      if (e.metaKey  &&  e.altKey  &&  e.code === 'Tab') {
        if (!StudentQuestion.unrespondedChats.length){
          console.log("No unresponded Students! Good Job!")
        } else if (StudentQuestion.currentStudent.chatId === StudentQuestion.unrespondedChats[0]){
          findTab(StudentQuestion.unrespondedChats[1]).click()
        } else {
          findTab(StudentQuestion.unrespondedChats[0]).click()  
        }
      }

      if (e.metaKey  &&  e.altKey  &&  e.code === 'KeyA') {
       this.copyQueueLink(StudentQuestion.currentStudent)
      }
    });
  }

  copyQueueLink(stQ){
    let ele = this.createCopyElement();
    ele.value = 'qbot queue ' + stQ.chat.questionLink +" "+ stQ.normalizedName();

    document.body.appendChild(ele);
    ele.select();
    document.execCommand('copy');
    document.body.removeChild(ele);
  }

  createCopyElement(){
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
}