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
    chrome.storage.sync.get(["unReadMessage"], (items) => {
      console.log(items)
      if (items) {
        var newNotifi = document.createElement("li");
        var messageFromUsers = ''
        messageFromUsers += `${items.unReadMessage.at(0).username} and ${items.unReadMessage.length - 1} another people`
        newNotifi.innerHTML += `You got new message from ${messageFromUsers} !`;
        // remove all unread messages if user click
        newNotifi.onclick = (e) => {
          const body = document.getElementById('content')
          body.style.width = `750px`
          body.style.height = `600px`
          var frame = document.getElementById('frame')
          frame.removeAttribute('hidden')
          frame.width = `740px`
          frame.height = `400px`
          frame.setAttribute('src',"http://localhost:3000/dashboard")
          chrome.storage.sync.set({ message: items.unReadMessage });
          chrome.action.setBadgeText({ text: "" });
          chrome.storage.sync.set({unReadMessage : ''})
        };
        newNotifi.style.cursor = "pointer";
        var notifi = document.getElementById("notification");
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
      // console.log(element);
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
