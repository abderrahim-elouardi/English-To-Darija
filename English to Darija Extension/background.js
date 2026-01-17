chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installée !");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 400,
    height: 600
  });
});