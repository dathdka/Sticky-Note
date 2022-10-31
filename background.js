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
          chrome.storage.sync.get(["message"], async (items) => {
            if(items.message.length > 0){
              var notification = [];
              //check if new message exsist or new message from new friend
              await listMessage.data.forEach((f, index) => {
                if(items.message.at(index)){
                  if (f.messages != items.message.at(index).messages) {
                    console.log(f);
                    notification.push(f);
                  }
                }else
                  notification.push(f)  
              });
              
              //display notification if there is new messages in array
              if (notification.length > 0) {
                chrome.action.setBadgeText({ text: "N" });
                chrome.storage.sync.set({ unReadMessage: notification });
              }
            }else{
              chrome.storage.sync.set({unReadMessage : listMessage.data})
              chrome.action.setBadgeText({ text: "N" });
            }
          });
        });
    }
  });
}, 5000);
