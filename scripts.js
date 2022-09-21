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
    chrome.storage.sync.get(["note"], function (items) {
      items.note.forEach((element, index) => {
        document
          .getElementById(index)
          .childNodes[1].addEventListener("click", (e) => {
            console.log(items.note)
            items.note.splice(index, 1);
            console.log(items.note)
            chrome.storage.sync.set({ note: items.note });
            const list = document.getElementById("note");
            list.removeChild(list.children[index]);
          });
      });
    });
  });
  chrome.storage.sync.get(["note"], (items) => {
    var ul = document.getElementById("note");
    items.note.forEach((element, index) => {
      var li = document.createElement("li");
      li.id = index;
      li.innerHTML = element;
      li.style.color = "white";
      var img = document.createElement("img");
      img.src = "bin.png";
      img.width = 20;
      img.height = 20;
      li.appendChild(img);
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
      li.id = items.note.length > 0 ? items.note.length : 0;
      li.innerHTML = e.target.value;
      li.style.color = "white";
      var img = document.createElement("img");
      img.src = "bin.png";
      img.width = 20;
      img.height = 20;
      li.appendChild(img);
      ul.appendChild(li);
      if (!items.note) note.push(e.target.value);
      else note = [...items.note, e.target.value];
      chrome.storage.sync.set({ note: note });
      // add listenner for new element
   
      document
        .getElementById(note.length - 1)
        .childNodes[1]
        .addEventListener("click", (e) => {
          const list = document.getElementById("note");
          list.removeChild(list.children[note.length-1]);
          note.pop();
          chrome.storage.sync.set({ note: note });
        });
      e.target.value = ''
      //
    });
  }
});
