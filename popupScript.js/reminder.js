document.getElementById("checkbox").addEventListener("click", () => {
    if (!document.getElementById("checkbox").checked) {
      document.getElementsByClassName("text")[0].innerHTML = `Break`;
      chrome.storage.sync.set({ status: "off" });
    } else {
      document.getElementsByClassName("text")[0].innerHTML = `Working`;
      chrome.storage.sync.set({ status: "on" });
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