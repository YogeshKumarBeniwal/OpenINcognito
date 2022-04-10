chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

chrome.contextMenus.onClicked.addListener(onContextMenuClicked);

function createContextMenus() {
  chrome.contextMenus.create({
    "id": "selectionContextMenu",
    "title": "Search INcognito",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "id": "pageContextMenu",
    "title": "Open Page INcognito",
    "contexts": ["page"]
  });

  chrome.contextMenus.create({
    "id": "linkContextMenu",
    "title": "Open Link INcognito",
    "contexts": ["link"]
  });
}

function onContextMenuClicked(clickData)
{
  if(clickData.menuItemId == "selectionContextMenu" && clickData.selectionText)
  {
    chrome.windows.create({"url": `https://www.google.com/search?q=${clickData.selectionText}`, "incognito": true});
  }
  else if(clickData.menuItemId == "pageContextMenu")
  {
    chrome.windows.create({"url": clickData.pageUrl, "incognito": true});
  }
  else if(clickData.menuItemId == "linkContextMenu")
  {
    chrome.windows.create({"url": clickData.linkUrl, "incognito": true});
  }

}