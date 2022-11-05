
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

var counter;
const doJob = () => {
  counter = 0;
  var timer = 10000;
  interval = setInterval(() => {
    counter += 1;
    alert("you're on working mode!");
    if (counter === 1) chrome.runtime.sendMessage({ closeThis: true });
  }, timer);
};
