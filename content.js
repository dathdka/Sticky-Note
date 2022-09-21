var counter;

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
