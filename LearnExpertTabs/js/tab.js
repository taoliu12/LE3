export default class Tab {

//External functions
//  checkChatStatus()
//  addUnrespondedObserverToChatNode()
//  tabActionOnStatus()
 

  constructor(elem){
    this.elem = elem

  }


  tabClick(){
    this.ele.addEventListener('click', function(e){
      let chatId = parseInt(e.srcElement.dataset.chatid);
      let found = StudentQuestion.find(chatId);
      if (found) {
        found.chat.html.click();
      }  
    });
  }

  attachTabListeners(){
    this.ele.tabClick();
    this.ele.closeTab();
  }

  closeTab(){ //name needs to be changed 
    this.ele.querySelector('.close-tab').addEventListener('click', e =>{
      this.ele.remove();
    })
  }

 // CLASS METHODS

  static create(stQ){
    let newTab =  new Tab(this.buildTab(stQ));

    Tab.tabBar.append(newTab)
    attachTabListeners(newTab);
    checkChatStatus(stQ, newTab);
    addUnrespondedObserverToChatNode(stQ.chat.html)
    tabActionOnStatus(stQ.chat.html);
  }

  static buildTab(stQ){
    let tab = document.createElement('div')
    let closeButton = document.createElement('span')
    closeButton.setAttribute('class', 'close-tab')
    tab.classList.add("chat-tab")
    tab.setAttribute('id', `chat_${stQ.chatId}_tab`)
    tab.setAttribute('data-chatId', `${stQ.chatId}`)

    let x = document.createTextNode("x")
    let name = document.createTextNode(stQ.normalizedName())
    
    closeButton.appendChild(x)
    tab.appendChild(name)
    tab.appendChild(closeButton);

   return tabElem
  }

  static init(){
    let rightChat = document.querySelectorAll('.list.list--separators-grey-faint')[1]; 
    this.tabBar = document.createElement("div");
    this.tabBar.id = "chat-tab-bar";
    rightChat.insertBefore(this.tabBar, rightChat.firstChild);
  }

}