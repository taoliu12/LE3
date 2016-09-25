class ChatNode {
  constructor(nodeHtml){
    this.nodeHtml = nodeHtml
    this.imageFrame = nodeHtml.querySelector('.image-frame--fixed-size-large');
    this.studentName = nodeHtml.querySelector('.heading--level-4').textContent
    this.question = nodeHtml.querySelector('.util--break-word').textContent
    this.contentBlock = nodeHtml.querySelector('.media-block__content')
  }


}