
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.closeThis) chrome.tabs.remove(sender.tab.id);
});

setInterval(() => {
  chrome.storage.sync.get(["userDetails"], (items) => {
    if (items.userDetails) {
      const update = { id: items.userDetails._id };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      };
      fetch("http://localhost:1250/api/message/get-message", options)
        .then((data) => {
          if (!data.ok) {
            throw Error(data.status);
          }
          return data.json();
        })
        .then((listMessage) => {
          // console.log(response.data)
          chrome.storage.sync.get(["message"], async (items) =>  {
            var notification =[] ;
            await listMessage.data.forEach((f, index) => {
              if (f.messages != items.message.data.at(index).messages) {
                notification.push(f.username);
              }
            });
            if (notification.length > 0){
              chrome.action.setBadgeText({ text: "N" });
              // console.log(notification)
              chrome.storage.sync.set({newMessage : notification})
            } 
          });
        });
    }
  });
}, 5000);



