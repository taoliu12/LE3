import ChromeOptions from './chromeOptions'
export default class UpdateChecker {

  constructor(){
    this.checkVersion()
  }

  checkVersion(){
    const currentVersion = chrome.runtime.getManifest().version
    
    if(ChromeOptions.version != currentVersion){
      chrome.storage.sync.set({version: currentVersion})
      this.createUpdatedDiv()
      this.attachListener()
    }
  }
  

  attachListener(){
    document.querySelector("div.update-notice span").addEventListener('click', (e)=>{
      e.target.parentElement.remove()
    })
  }
  createUpdatedDiv(){
    let div = document.createElement('div')
    div.innerHTML= `<span>x</span><h1>New LE3 update!</h1>
      <h2>To see the changelog, click 
      <a target='_blank' href='https://github.com/NStephenson/LE3/blob/master/changelog.md'>here</a>.
    </h2>`

    div.classList.add('update-notice')

    document.body.appendChild(div)
  }

}
