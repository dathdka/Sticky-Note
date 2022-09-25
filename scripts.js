window.onload = () => {
  chrome.storage.sync.get(["status"], function (items) {
    if (!items.status) {
      chrome.storage.sync.set({ status: "off" });
    }
    document.getElementById("checkbox").checked =
      items.status === "on" ? true : false;
    document.getElementsByClassName("text")[0].innerHTML =
      document.getElementById("checkbox").checked
        ? `Working`
        : `Break`;
    chrome.storage.sync.get(["note"], function (items) {
      items.note.forEach((element, index) => {
        document
          .getElementById(index)
          .childNodes[1].addEventListener("click", (e) => {
            console.log(items.note);
            items.note.splice(index, 1);
            console.log(items.note);
            chrome.storage.sync.set({ note: items.note });
            const list = document.getElementById("note");
            list.removeChild(list.children[index]);
          });
      });
    });
    chrome.storage.sync.get(["newMessage"], (items) => {
      //TODO: load message notifications
      if(items){
        var link = document.createElement('a')
        link.href = 'http://localhost:3000/dashboard';
        var newNotifi = document.createElement('li')
        items.newMessage.forEach(f =>{
          link.innerHTML += f
        })
        var notifi = document.getElementById('notification');
        newNotifi.appendChild(link);
        notifi.appendChild(newNotifi);
      }

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

// setInterval(()=>{
//   chrome.storage.sync.get(['newMessage'], (items)=>{
//     console.log(items)
//   })
// }, 5000)
document.getElementById("checkbox").addEventListener("click", () => {
  if (!document.getElementById("checkbox").checked) {
    document.getElementsByClassName("text")[0].innerHTML = `Break`;
    chrome.storage.sync.set({ status: "off" });
  } else {
    document.getElementsByClassName("text")[0].innerHTML = `Working`;
    chrome.storage.sync.set({ status: "on" });
    // chrome.alarms.create({ periodInMinutes: 1 });
  }
});

chrome.runtime.onMessage.addListener(function (
  message,
  messageSender,
  sendResponse
) {
  // message is the message you sent, probably an object
  // messageSender is an object that contains info about the context that sent the message
  // sendResponse is a function to run when you have a response
  alert(message);
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
        .childNodes[1].addEventListener("click", (e) => {
          const list = document.getElementById("note");
          list.removeChild(list.children[note.length - 1]);
          note.pop();
          chrome.storage.sync.set({ note: note });
        });
      e.target.value = "";
      //
    });
  }
});

chrome.storage.sync.get(["userDetails"], (items) => {
  if (items.userDetails) {
    document.getElementById("login").setAttribute("hidden", "");
    document.getElementById("logout").removeAttribute("hidden");
  }
});

document.getElementById("loginButton").addEventListener("click", () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:1250/api/auth/login", true);
  xhttp.setRequestHeader("content-type", "application/json");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  xhttp.send(
    JSON.stringify({
      mail: email.value,
      password: password.value,
    })
  );
  xhttp.onload = () => {
    if (xhttp.status === 200) {
      chrome.storage.sync.set({
        userDetails: JSON.parse(xhttp.response).userDetails,
      });
      document.getElementById("login").setAttribute("hidden", "");
      document.getElementById("logout").removeAttribute("hidden");
      chrome.storage.sync.get(["userDetails"], (items) => {
        var getMessage = new XMLHttpRequest();
        getMessage.open(
          "POST",
          "http://localhost:1250/api/message/get-message",
          true
        );
        getMessage.setRequestHeader("content-type", "application/json");
        getMessage.send(JSON.stringify({ id: items.userDetails._id }));
        getMessage.onload = () => {
          if (getMessage.status === 200) {
            var res = JSON.parse(getMessage.response);
            chrome.storage.sync.set({ message: res.data });
            chrome.storage.sync.get(["message"], (items) => {
              console.log(items);
            });
          }
        };
      });
    } else alert("login fail");
  };
});

document.getElementById("logoutButton").addEventListener("click", () => {
  document.getElementById("logout").setAttribute("hidden", "");
  document.getElementById("login").removeAttribute("hidden");
  chrome.storage.sync.set({ userDetails: "" });
  document.getElementById("loginButton").addEventListener("click", () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:1250/api/auth/login", true);
    xhttp.setRequestHeader("content-type", "application/json");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    xhttp.send(
      JSON.stringify({
        mail: email.value,
        password: password.value,
      })
    );
    xhttp.onload = () => {
      if (xhttp.status === 200) {
        chrome.storage.sync.set({
          userDetails: JSON.parse(xhttp.response).userDetails,
        });
        document.getElementById("login").setAttribute("hidden", "");
        document.getElementById("logout").removeAttribute("hidden");
        chrome.storage.sync.get(["userDetails"], (items) => {
          const getMessage = new XMLHttpRequest();
          getMessage.open(
            "POST",
            "http://localhost:1250/api/message/get-message",
            true
          );
          getMessage.setRequestHeader("content-type", "application/json");
          getMessage.send(JSON.stringify({ id: items.userDetails._id }));
          getMessage.onload = () => {
            if (getMessage.status === 200) {
              var res = JSON.parse(getMessage.response);
              chrome.storage.sync.set({ message: res.data });
              chrome.storage.sync.get(["message"], (items) => {
                console.log(items);
              });
            }
          };
        });
      } else alert("login fail");
    };
  });
});

// setInterval(() => {
//   chrome.storage.sync.get(["userDetails"], (items) => {
//     if (items.userDetails) {
//       const update = { id: items.userDetails._id };
//       const options = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(update),
//       };
//       fetch("http://localhost:1250/api/message/get-message", options)
//         .then((data) => {
//           if (!data.ok) {
//             throw Error(data.status);
//           }
//           return data.json();
//         })
//         .then((listMessage) => {
//           // console.log(response.data)
//           chrome.storage.sync.get(["message"], async (items) =>  {
//             var notification =[] ;
//             await listMessage.data.forEach((f, index) => {
//               if (f.messages != items.message.data.at(index).messages) {
//                 notification.push(f.username);
//               }
//             });
//             if (notification.length > 0){
//               chrome.action.setBadgeText({ text: "N" });
//               // console.log(notification)
//               chrome.storage.sync.set({newMessage : notification})
//             } 
//           });
//         });
//     }
//   });
// }, 10000);

