// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "sampleContextMenu",
//     title: "Sample Context Menu",
//     contexts: ["selection"]
//   });
//   chrome.bookmarks.onCreated.addListener(() => {
//     console.log('working');
//   });
// });

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
}, 6000);

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
//           var notification = [];
//           chrome.storage.sync.get(["message"], (items) => {
//             listMessage.data.forEach((f, index) => {
//               if (f.messages != items.message.data.at(index).messages) {
//                 notification.push(f.username);
//               }
//             });
//           });
//           if (notification){
//             chrome.action.setBadgeText({ text: "N" });
//             chrome.storage.sync.set({newMessage : notification})
//             chrome.storage.sync.set({message: listMessage})
//           } 
//         });
//     }
//   });
// }, 5000);
// chrome.alarms.onAlarm.addListener(() => {
//   chrome.notifications.create({
//     type: 'basic',
//     iconUrl: 'note.png',
//     title: 'Time to Hydrate',
//     message: 'Drink enough 2 litter of water a day !',
//     priority: 0
//   });
// });
