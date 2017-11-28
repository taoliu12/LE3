export default class ChromeOptions {

  constructor(){
    this.getOptions();
  }

  getOptions(){
    chrome.storage.sync.get({
      autotab: true
    }, function(items) {
      ChromeOptions.autotab = items.autotab;
    });
  }

}