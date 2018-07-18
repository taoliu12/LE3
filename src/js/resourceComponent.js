import StudentQuestion from './studentQuestion'
import {apiLinks} from './globals'

export default class ResourceComponent {

  constructor(){
    this.api = apiLinks.development
    document.addEventListener("keydown", (e) => {
      if (e.metaKey  &&  e.altKey  &&  e.code === 'KeyR') {
        if(!document.querySelector('#resource-popup')){
          this.loadResourcePopup()
        } else {
          this.closePopup()
        }

      }
    })  
  }

  loadResourcePopup(){
    this.createResourcePopup();
    this.getResources();
    this.attachListeners()
  }

  attachListeners(){
    document.querySelector('#add-resource').addEventListener('click', () =>
      this.loadResourceForm()
    )
    document.querySelector('#resource-popup span.close').addEventListener('click', ()=> 
      this.closePopup()
    )
  }


  closePopup(){
    document.querySelector('#resource-popup').remove()
    this.resources = {}
  }

  createSelectBox(resource){
    const options =["Lecture", "StackOverflow", "Documentation", "Blog", "Help Center", "Other"].map(r => 
      `<option ${resource && resource.type.name === r.toLowerCase() ? 'selected="selected"' : '' } value="${r}">${r}</option>`
    ).join('')
    return `<select id="new-resource-type">` + options + `</select>`
  }



  loadResourceForm(resource){
    
    let html = `
    <div>
      <form id="new-resource-form">
      <div id="new-resource-errors"></div>
      <input id="new-resource-id" type="hidden" value="${resource ? resource.id : 0}">
      <h3>Name</h3> <br><input id="new-resource-name" type="text" value="${resource ? resource.name : ''}"><br>
      <h3>Link</h3> <br><input ${resource ? "readonly" : ''} id="new-resource-link" type="text" value="${resource ? resource.link : ''}"><br>
      <h3>Description</h3> <br><textarea rows="5" cols="27" id="new-resource-description">${resource ? resource.description : ''}</textarea><br>
      <h3>Type</h3> <br>${this.createSelectBox(resource)}<br>
      <button 
        id="cancel-submit-resource"  
        class="button button--color-red"/> Cancel </button>
      <input 
        id="submit-resource" 
        type="submit" 
        value="${resource ? "Edit" : "Add"} Resource"
        class="button button--color-blue" />
      <form>
    </div>
    `
    document.querySelector('#resource-main').innerHTML = html;
    document.querySelector('#new-resource-form').addEventListener('submit', (e)=>{
      e.preventDefault()
      this.handleSubmit()
    })
    this.cancelAddResource()
  }

  handleError(r){
    const errors = r.errors.map(e =>
      `<li>${e}</li>`
    ).join('')

    document.querySelector('#new-resource-errors').innerHTML =`<p>Please fix the following errors:</p><ul>${errors}</ul>`
  }

  handleSubmit(){
    let data = this.getFormData()
    data.lesson = {name: StudentQuestion.currentStudent.chat.lesson}
    this.postResource(data)
  }

  getFormData(){
    let resource = {}
    const data = ["id", "name", "link", "description", "type"].map((d)=> resource[d] = document.querySelector(`#new-resource-${d}`).value)
    return { resource: resource}
  }

 cancelAddResource(){
  document.querySelector('#cancel-submit-resource').addEventListener('click', (e)=>{
    e.preventDefault()
    this.getResources();
  })
 }


  //Create a resources button to add to the page
  //Add event listener to make it open Resources popup

  // Create resources popup

  createResourcePopup(){
    let elem = document.createElement('div')
    elem.id ='resource-popup'
    elem.innerHTML =`
      <span class="close">x</span>
      <button id="add-resource" class='button button--flush button--layout-block button--color-blue'>
      Add a new resource
      </button>
      <div id="resource-main">
       </div>
    `
    document.body.appendChild(elem)
  }

  createTable(){
    const html = `
      <table id='resource-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th> 
            <th>Description</th>
          </tr>
        </thead>
        <tbody id='resource-list'>
        </tbody>
      </table>
    `
    document.querySelector('#resource-main').innerHTML= html
  }

  getResources(){
    let lesson = StudentQuestion.currentStudent.chat.lesson;
    let lessonSlug = lesson.replace(/[^\w\s]/g, '').split(" ").join("_")
    fetch(`${this.api}/lesson/${lessonSlug}/resources`)
      .then((resp) => {
        if(!resp.ok){
          throw Error()
        }
        return resp.json();
      })
      .then((resources) => {
        this.resources = this.objectify(resources)
        this.populateResources(resources, lessonSlug);
      });
  }


  objectify(resources){
   return resources.reduce((obj, resource)=> {
    return Object.assign({}, obj, {[resource.id]: resource})
   }, {})
  }

  populateResources(resources, lessonSlug){
    this.createTable()
    let resourcesList;
    if (resources.length){
      resourcesList = resources.map((r) => this.createResourceElement(r, lessonSlug)).join('');   
    } else {
      resourcesList = `<tr>No resources for this lab have been added!<tr>`
    }
    document.querySelector('#resource-list').innerHTML = resourcesList;
    this.addResourceListeners()
  }

  addResourceListeners(){
    this.addCopyListeners()
    this.addEditListeners()
    this.addDeleteListeners()
  }

  addCopyListeners(){
    document.querySelectorAll('#resource-list .resource a').forEach(el => { 
      el.addEventListener('click', e => {
        e.preventDefault()
        const desc = this.resources[e.target.dataset.id].description
        const link = e.target.href
        if(e.shiftKey){
          const text = `${desc} ${link}`
          this.copyText(text)
        } else {
          this.copyText(link)
        }
      })
    })
  }

  addEditListeners(){
    document.querySelectorAll('#resource-list .edit-resource').forEach(el => { el.addEventListener('click', e => {
      this.loadResourceForm(this.resources[e.target.dataset.id])
    })
  })
  }

  addDeleteListeners(){
    document.querySelectorAll('#resource-list .delete-resource').forEach(el => { el.addEventListener('click', e => {
      e.preventDefault()
      fetch(e.target.href, {method: "DELETE"})
      .then().then(()=> this.getResources())
    })
  })
  }



  createResourceElement(resource, lessonSlug){
     var link = `${this.api}/lesson/${lessonSlug}/resources/${resource.id}`
    return `<tr class='resource'>
        <td><a data-id="${resource.id}" href='${resource.link}'>${resource.name}</a></td>
        <td>${resource.type.name}</td>
        <td>${resource.description}</td>
        <td> <a data-id="${resource.id}" class="edit-resource" href="${link}">Edit</a> - <a class="delete-resource" href="${link}">Delete</a></td>
      </tr>`
  }

  postResource(data){
    const id = +data.resource.id
    let status;
    return fetch(`${this.api}/resources${id ? '/' + id : ''}`, {
      body: JSON.stringify(data),
      method: id ? "PATCH" : "POST",
      headers: {'content-type': 'application/json'},
      mode: 'cors'
    }).then(response => {
       // if (response.ok) {
        status = response.status
        return response.json();
      // } else {
      //   throw response.json();
      // }
    })
      .catch(e=>{ })
      .then((r)=> {
        if(status != 422){
          this.getResources()
        } else {
          this.handleError(r)
        }      
      })

  }

  copyText(text){
    let ele = this.createCopyElement();
    ele.value = text;

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
  // Fetch resources for current lab

  // Display and format these to page

}