chrome.storage.sync.get(["status"], function (items) {
  doJob();
});

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
  doJob()  
}
function stop() {
  chrome.storage.sync.set({ status: "off" });
}

const doJob = () => {
  var timer = 10000;
  setInterval(()=>{
    Notification.requestPermission().then((permission) => {
      if (permission === "granted")
        new Notification("HEY YOU!!!!!!!!!!!", {
          body: 'stop doing this shit and back to work'
        });
    });
  },timer)
};
