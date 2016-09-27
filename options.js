function saveOptions(){
  alert('hello!');
  var autotab = document.getElementById('autotab').checked;
  chrome.storage.sync.set({
    autotab: autotab
  }, function(){
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

function restoreOptions(){
chrome.storage.sync.get({
    autotab: true
  }, function(items) {
    document.getElementById('autotab').checked = items.autotab;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
