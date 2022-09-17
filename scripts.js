window.onload = () => {
  var status = window.localStorage.getItem("switch");
  if (!status) {
    window.localStorage.setItem("switch", "off");
    status = window.localStorage.getItem("switch");
  }
  document.getElementById("checkbox").checked = status === "on" ? true : false;
  document.getElementsByClassName("text")[0].innerHTML =
    document.getElementById("checkbox").checked
      ? `I'm working`
      : `I'm taking a break`;
};
document.getElementById("checkbox").addEventListener("click", () => {
  if (!document.getElementById("checkbox").checked) {
    document.getElementsByClassName("text")[0].innerHTML = `I'm taking a break`;
    window.localStorage.setItem("switch", "off");
  } else {
    document.getElementsByClassName("text")[0].innerHTML = `I'm working`;
    window.localStorage.setItem("switch", "on");
  }
});

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
