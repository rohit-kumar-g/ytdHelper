// Listener for history state updates
chrome.webNavigation.onHistoryStateUpdated.addListener(
  function (data) {
    chrome.tabs.get(data.tabId, function (tab) {
      if (tab.url.includes(".youtube.com")) {
        chrome.scripting.executeScript({
          target: { tabId: data.tabId },
          func: () => {
            console.log("rajuu11: History state");
            if (typeof AddScreenshotButton !== "undefined") {
              AddScreenshotButton();
            }
          },
          injectImmediately: true,
        });
      } 
    });
  },
  { url: [{ hostSuffix: ".youtube.com" }] }
);

// Listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url.includes("https://y2mate.nu/")) {
    console.log("New tab URL matched");
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        console.log("rajuu: tab URL");
        if (typeof myfunc !== "undefined") {
          console.log("mila myfunc:tab URL");
          // Try to fill the input field
          const inputSelector = "input#video";
          // Define the array of CSS selectors and corresponding descriptions
          const elements = [
            "body > form > div:nth-child(2) > button:nth-child(3)",
            "body > form > div:nth-child(2) > button:nth-child(1)"];

          const descriptions = [
            "Search button",
            "Action button"
          ];

          myfunc(inputSelector, elements, descriptions);
        } else {
          console.log("undef myfunc: tab URL");
        }
      },
      injectImmediately: true,
    });
  }
});

// Set default rules on installation or update
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install" || details.reason === "update") {
    const defaultRules = [
      { extension: "jpg,jpeg,gif,png", foldername: "images" },
      {
        extension: "mp4,mp3,3gp,webm,wav,ogg,mkv,aac,m4a",
        foldername: "media",
      },
      { extension: "zip,z7,tar,gz", foldername: "compression" },
      { extension: "exe", foldername: "exe" },
      { extension: "pdf,hwp,doc,docx", foldername: "document" },
      { extension: "z*", foldername: "z_start_all_file" },
    ];

    const defaultSettings = {
      defaultFolder: "default",
      rules: JSON.stringify(defaultRules),
    };

    // Set default settings and currentUrl in local storage
    chrome.storage.local.set(
      { currentUrl: "clickedUrl", ...defaultSettings },
      () => {
        // Retrieve and log the entire storage object once settings are saved
        chrome.storage.local.get(null, (allItems) => {
          console.log("Stored items:", allItems);

          // chrome.tabs.create({ url: "options-dd.html" });
        });
      }
    );
  }
});

// Listen for changes in chrome.storage.sync
chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (areaName === "sync") {
    for (let key in changes) {
      let storageChange = changes[key];
      if (key === "defaultFolder") {
        chrome.storage.local.set({ defaultFolder: storageChange.newValue });
      } else if (key === "rules") {
        chrome.storage.local.set({ rules: storageChange.newValue });
      }
    }
  }
});

// Function to check if the filename matches the extension rule
function matches(extension, filename) {
  if (!extension) return false;

  const index = filename.lastIndexOf(".");
  if (index === -1) return false;

  const type = filename.substring(index + 1).toLowerCase();
  let extensionLower = extension.toLowerCase().replace(/ /g, "");

  if (
    extensionLower.includes("*") ||
    extensionLower.includes("|") ||
    extensionLower.includes(",")
  ) {
    extensionLower = extensionLower
      .replace(/,/g, "|")
      .replace(/\*/g, "[a-z0-9]*");
    const pattern = new RegExp(`^${extensionLower}$`, "i");
    return pattern.test(type);
  }

  return type === extensionLower;
}

// Download filename determination listener
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  chrome.storage.local.get(["rules", "defaultFolder"], (items) => {
    const rules = JSON.parse(items.rules || "[]");
    const defaultFolder = items.defaultFolder || "default";
    let tempFolder = defaultFolder;

    // Check if the download is from a blob URL on youtube.com
    const blobYoutubePattern = /^blob:https:\/\/www\.youtube\.com\/.*/;
    if (blobYoutubePattern.test(item.url)) {
      const today = new Date().toISOString().split("T")[0];
      tempFolder = `ytss/${today}`;
    } else {
      for (const rule of rules) {
        if (matches(rule.extension, item.filename)) {
          tempFolder = rule.foldername;
          break;
        }
      }
    }

    console.log(`Folder: ${tempFolder}`);
    suggest({ filename: `${tempFolder}/${item.filename}` });
  });

  // Return true to indicate we will call suggest asynchronously
  return true;
});
