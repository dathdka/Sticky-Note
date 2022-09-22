var counter;

chrome.tabs.insertCSS()
// popup
var body = document.getElementsByTagName('body')[0];
var div1 = document.createElement('div');
div1.id = 'myModal'
div1.className = 'modal'
var div2 = document.createElement('div');
div2.className = 'modal-content'
div1.appendChild(div2);
body.appendChild(div1);
//


//catch popup event
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


chrome.storage.sync.get(["status"], function (items) {
  if (items.status === "on"){
    doJob();
    chrome.storage.sync.get(["status"], (items) => {
      console.log(items.status);
    });
  } 
  else{
    chrome.storage.sync.set({status: "off"});
    chrome.storage.sync.get(["status"], (items) => {
      console.log(items.status); 
    });
  }
});


var interval;
// catch the message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "start") {
    start();
  } else {
    stop();
  }
});
function start() {
  chrome.storage.sync.set({ status: "on" });
  doJob();
}
function stop() {
  chrome.storage.sync.set({ status: "off" });
  if (interval) clearInterval(interval);
}

const doJob = () => {
  counter = 0;
  var timer = 10000;
  interval = setInterval(() => {
    counter += 1;
    alert("stop doing this shit and back to work");
    // Notification.requestPermission().then((permission) => {
    //   if (permission === "granted")
    //   new Notification("HEY YOU!!!!!!!!!!!", {
    //       body: "stop doing this shit and back to work",
    //     });
    // });
    if (counter === 3) chrome.runtime.sendMessage({ closeThis: true });
  }, timer);
};
