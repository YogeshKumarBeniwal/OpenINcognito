let openAllButton = document.getElementById("openAllTabs");
openAllButton?.addEventListener("click", OpenAllTabsINcognito);

async function OpenAllTabsINcognito() {
  try {
    incognitoWindowId = -1;

    await chrome.windows.getAll((windows) => {
      windows.forEach(window => {
        if (window.incognito) {
          incognitoWindowId = window.id;
        }
      });
    });

    await chrome.tabs.query({ "currentWindow": true }, async (tabs) => {
      if (incognitoWindowId === -1) {
        await chrome.windows.create({ "url": 'chrome://newtab', "incognito": true }).then(async ()=>
        {
          await chrome.windows.getAll((windows) => {
            windows.forEach(window => {
              if (window.incognito) {
                incognitoWindowId = window.id;
              }
            });

            OpenTabsInWindow(tabs, incognitoWindowId);
          });
        });
      }
      else
      {
        OpenTabsInWindow(tabs, incognitoWindowId);
      }
    });
  }
  catch (e) {
    console.log(e);
  }
}

function OpenTabsInWindow(tabs, windowId){
  tabs.forEach(async tab => {
    chrome.tabs.create(
      { "url": tab.url, "windowId": windowId }
    );
  });
}