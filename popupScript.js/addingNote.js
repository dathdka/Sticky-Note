
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
      if (!items.note) note.push(e.target.value);
      else note = [...items.note, e.target.value];
      img.onclick = (e) =>{
        const list = document.getElementById("note");
          list.removeChild(list.children[note.length-1]);
          note.splice(note.length-1, 1);
          chrome.storage.sync.set({ note: note });
      }
      li.appendChild(img);
      ul.appendChild(li);
      chrome.storage.sync.set({ note: note });
      e.target.value = "";
      //
    });
  }
});