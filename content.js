chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "start") {
    start();
  }
});

function start() {
  alert("started");
  const timer = 10000;
  setInterval(() => {
    alert(`you had watching youtube for ${timer / 1000}s`);
  }, timer);
}
