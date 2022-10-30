window.onload = () => {
  //load working mode
  chrome.storage.sync.get(["status"], function (items) {
    if (!items.status) {
      chrome.storage.sync.set({ status: "off" });
    }
    document.getElementById("checkbox").checked =
      items.status === "on" ? true : false;
    document.getElementsByClassName("text")[0].innerHTML =
      document.getElementById("checkbox").checked ? `Working` : `Break`;
    //get new message from storage
    chrome.storage.sync.get(["newMessage"], (items) => {
      //TODO: load message notifications
      if (items) {
        var link = document.createElement("a");
        link.href = "http://localhost:3000/dashboard";
        var newNotifi = document.createElement("li");
        items.newMessage.forEach((f) => {
          link.innerHTML += `you got new message from ${f}`;
        });
        var notifi = document.getElementById("notification");
        newNotifi.appendChild(link);
        notifi.appendChild(newNotifi);
      }
    });
  });
  //load note from storage
  chrome.storage.sync.get(["note"], (items) => {
    var ul = document.getElementById("note");
    items.note.forEach((element, index) => {
      var li = document.createElement("li");
      li.id = element;
      console.log(element);
      li.innerHTML = element;
      li.style.color = "white";
      var img = document.createElement("img");
      img.src = "../public/bin.png";
      img.width = 20;
      img.height = 20;
      li.appendChild(img);
      ul.appendChild(li);
    });
  });
  //add listener for each note
  chrome.storage.sync.get(["note"], function (items) {
    items.note.forEach((element, index) => {
      document
        .getElementById(element)
        .childNodes[1].addEventListener("click", (e) => {
          const list = document.getElementById("note");
          list.removeChild(list.children[index]);
        //   console.log(items.note);
          items.note.splice(index, 1);
        //   console.log(items.note);
          chrome.storage.sync.set({ note: items.note });
        });
    });
  });
};
