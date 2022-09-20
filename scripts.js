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
  chrome.storage.sync.get(["note"], (items) => {
    var ul = document.getElementById("note");
    console.log(items.note);
    items.note.forEach((element, index) => {
      var li = document.createElement("li");
      li.id = index;
      li.innerHTML = element;
      li.style.color = "white";
      ul.appendChild(li);
    });
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

var note = [];
document.getElementById("inputNote").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    var ul = document.getElementById("note");
    chrome.storage.sync.get(["note"], (items) => {
      var li = document.createElement("li");
      li.id = note.length > 0 ? note.length : 0;
      li.innerHTML = e.target.value;
      li.style.color = "white";
      ul.appendChild(li);

      if (!items.note) note.push(e.target.value);
      else note = [...items.note, e.target.value];
      chrome.storage.sync.set({ note: note });
    });
  }
});

document.getElementById("content").addEventListener("load", () => {});
