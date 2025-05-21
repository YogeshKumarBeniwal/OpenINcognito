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

function searchTextIncognito(selectionText) {
  if (selectionText) {
    chrome.windows.create({"url": `https://www.google.com/search?q=${selectionText}`, "incognito": true});
  }
}

function openPageIncognito(pageUrl) {
  if (pageUrl) {
    chrome.windows.create({"url": pageUrl, "incognito": true});
  }
}

function openLinkIncognito(linkUrl) {
  if (linkUrl) {
    chrome.windows.create({"url": linkUrl, "incognito": true});
  }
}

function onContextMenuClicked(clickData)
{
  if(clickData.menuItemId == "selectionContextMenu" && clickData.selectionText)
  {
    searchTextIncognito(clickData.selectionText);
  }
  else if(clickData.menuItemId == "pageContextMenu")
  {
    openPageIncognito(clickData.pageUrl);
  }
  else if(clickData.menuItemId == "linkContextMenu")
  {
    openLinkIncognito(clickData.linkUrl);
  }
}

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "open_page_incognito") {
    if (tab && tab.url) {
      openPageIncognito(tab.url);
    } else {
      // Fallback if tab is not directly available or doesn't have a URL
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs && tabs.length > 0 && tabs[0].url) {
          openPageIncognito(tabs[0].url);
        } else {
          console.log("Open page shortcut: Could not determine active tab URL.");
        }
      });
    }
  } else if (command === "search_text_incognito") {
    // Attempt to get selected text using executeScript
    // Note: executeScript requires "scripting" permission or host permissions for the active tab.
    // Assuming "scripting" permission is added to manifest.json if this approach is chosen.
    if (tab && tab.id) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => window.getSelection().toString()
        }, (injectionResults) => {
            if (injectionResults && injectionResults.length > 0 && injectionResults[0].result) {
                searchTextIncognito(injectionResults[0].result);
            } else {
                console.log("Search text shortcut: Could not retrieve selected text. Ensure text is selected, or this might require 'scripting' permission and a content script.");
            }
        });
    } else {
         // Fallback for when tab context is not directly available (e.g. global shortcut)
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs && tabs.length > 0 && tabs[0].id) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => window.getSelection().toString()
                }, (injectionResults) => {
                    if (injectionResults && injectionResults.length > 0 && injectionResults[0].result) {
                        searchTextIncognito(injectionResults[0].result);
                    } else {
                        console.log("Search text shortcut: Could not retrieve selected text from active tab. Ensure text is selected or permissions are correctly set.");
                    }
                });
            } else {
                console.log("Search text shortcut: No active tab found to get selection from.");
            }
        });
    }
  } else if (command === "open_link_incognito") {
    console.log("Open link shortcut triggered, but this requires context (e.g., a selected link from a content script) which is not directly available here for a global shortcut. This command is more suitable for context menus or direct interaction with page content.");
  }
});