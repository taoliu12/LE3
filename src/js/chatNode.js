export default class Chat {
  constructor(nodeHtml){
    this.html = nodeHtml
    this.imageFrame = nodeHtml.querySelector('.image-frame--fixed-size-large');
    this.name = nodeHtml.querySelector('.heading--level-4').textContent
    this.question = nodeHtml.querySelector('.util--break-word').textContent
    this.contentBlock = nodeHtml.querySelector('.media-block__content')
    this.questionLink = nodeHtml.querySelector('span.util--padding-lm a').href
  }

  unrespondedBadge(){ 
    return this.html.querySelector('.image-frame__badge--color-blue')
  }

  findActivityStatus(){
    let siblings = this.html.parentNode.childNodes;
    let i = 0;
    let headersPassed = 0
    while (siblings[i] != this.html){
      if (siblings[i].classList.contains("fc--question-section-header")){
        headersPassed++
      }
      i++ 
    }
    return headersPassed
  }
}