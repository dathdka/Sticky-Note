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
    chrome.storage.sync.set({message: ''})
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