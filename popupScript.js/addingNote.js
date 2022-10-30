
var note = [];

//add new note
document.getElementById("inputNote").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    var ul = document.getElementById("note");
    chrome.storage.sync.get(["note"], (items) => {
      var li = document.createElement("li");
      li.id = items.note.length > 0 ? items.note.length : 0;
      li.innerHTML = e.target.value;
      li.style.color = "white";
      var img = document.createElement("img");
      img.src = "../public/bin.png";
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
        .childNodes[1].addEventListener("click", (e) => {
          const list = document.getElementById("note");
          list.removeChild(list.children[note.length]);
          note.pop();
          chrome.storage.sync.set({ note: note });
        });
      e.target.value = "";
      //
    });
  }
});