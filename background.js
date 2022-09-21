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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.closeThis) chrome.tabs.remove(sender.tab.id);
});

// chrome.alarms.onAlarm.addListener(() => {
//   chrome.notifications.create({
//     type: 'basic',
//     iconUrl: 'note.png',
//     title: 'Time to Hydrate',
//     message: 'Drink enough 2 litter of water a day !',
//     priority: 0
//   });
// });
