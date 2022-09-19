var counter;

chrome.storage.sync.get(["status"], function (items) {
  if (items.start === "on") doJob();
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
  var timer = 30000;
  interval = setInterval(() => {
    counter += 1;
    Notification.requestPermission().then((permission) => {
      if (permission === "granted")
        new Notification("HEY YOU!!!!!!!!!!!", {
          body: "stop doing this shit and back to work",
        });
    });
    if (counter === 3) chrome.runtime.sendMessage({ closeThis: true });
  }, timer);
};
