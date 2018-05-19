import Tab from './tab'
import StudentQuestion from './studentQuestion'
import Observers  from './observers'
import KeyCommands from './keyCommands'
import UpdateChecker from './updateChecker'
import ChromeOptions from './chromeOptions'



// initializers
new ChromeOptions
Tab.init()
StudentQuestion.init()
new Observers
new KeyCommands
setTimeout(()=>{new UpdateChecker
}, 8000) // Shouldn't need to do this, options may need to be handled first as a promise prior to remaining code running



 