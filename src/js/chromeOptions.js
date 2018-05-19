export default class ChromeOptions {

  constructor(){
    this.getOptions();
  }

  getOptions(){
    chrome.storage.sync.get({autotab: true, version: null}, function(items) {
      ChromeOptions.autotab = items.autotab;
      ChromeOptions.version = items.version
    });
  }

}