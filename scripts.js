window.onload = () => {
  chrome.storage.sync.get(["status"], function (items) {
    if (!items.status) {
      chrome.storage.sync.set({ status: "off" });
    }
    document.getElementById("checkbox").checked =
      items.status === "on" ? true : false;
    document.getElementsByClassName("text")[0].innerHTML =
      document.getElementById("checkbox").checked
        ? `I'm working`
        : `I'm taking a break`;
  });
};
document.getElementById("checkbox").addEventListener("click", () => {
  if (!document.getElementById("checkbox").checked) {
    document.getElementsByClassName("text")[0].innerHTML = `I'm taking a break`;
    chrome.storage.sync.set({ status: "off" });
  } else {
    document.getElementsByClassName("text")[0].innerHTML = `I'm working`;
    chrome.storage.sync.set({ status: "on" });
    // chrome.alarms.create({ periodInMinutes: 1 });
  }
});

// send message from popup to content script
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("checkbox")
    .addEventListener("click", function popup() {
      if (document.getElementById("checkbox").checked)
        chrome.tabs.query(
          { currentWindow: true, active: true },
          function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { message: "start" });
          }
        );
      else
        chrome.tabs.query(
          { currentWindow: true, active: true },
          function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { message: "stop" });
          }
        );
    });
});
