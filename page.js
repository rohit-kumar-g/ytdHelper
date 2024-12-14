"use strict";
var activePBRButton;
var screenshotKey = false;
var playbackSpeedButtons = false;
var screenshotFunctionality = 0;
var screenshotFormat = "png";
var extension = "png";

function CaptureScreenshot() {
  var appendixTitle = "screenshot." + extension;

  var title;

  var headerEls = document.querySelectorAll(
    "h1.title.ytd-video-primary-info-renderer"
  );

  function SetTitle() {
    if (headerEls.length > 0) {
      title = headerEls[0].innerText.trim();
      return true;
    } else {
      return false;
    }
  }

  if (SetTitle() == false) {
    headerEls = document.querySelectorAll("h1.watch-title-container");

    if (SetTitle() == false) title = "";
  }

  var player = document.getElementsByClassName("video-stream")[0];

  var time = player.currentTime;

  title += " t@=";

  let minutes = Math.floor(time / 60);

  time = Math.floor(time - minutes * 60);

  if (minutes > 60) {
    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    title += hours + "-";
  }

  title += minutes + "-" + time;

  title += " " + appendixTitle;

  var canvas = document.createElement("canvas");
  canvas.width = player.videoWidth;
  canvas.height = player.videoHeight;
  canvas.getContext("2d").drawImage(player, 0, 0, canvas.width, canvas.height);

  var downloadLink = document.createElement("a");
  downloadLink.download = title;

  function DownloadBlob(blob) {
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.click();
  }

  async function ClipboardBlob(blob) {
    const clipboardItemInput = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([clipboardItemInput]);
  }

  // If clipboard copy is needed generate png (clipboard only supports png)
  if (screenshotFunctionality == 1 || screenshotFunctionality == 2) {
    canvas.toBlob(async function (blob) {
      await ClipboardBlob(blob);
      // Also download it if it's needed and it's in the correct format
      if (screenshotFunctionality == 2 && screenshotFormat === "png") {
        DownloadBlob(blob);
      }
    }, "image/png");
  }

  // Create and download image in the selected format if needed
  if (
    screenshotFunctionality == 0 ||
    (screenshotFunctionality == 2 && screenshotFormat !== "png")
  ) {
    canvas.toBlob(async function (blob) {
      DownloadBlob(blob);
    }, "image/" + screenshotFormat);
  }
}

function AddScreenshotButton() {
  var ytpRightControls =
    document.getElementsByClassName("ytp-right-controls")[0];
  if (ytpRightControls) {
    ytpRightControls.prepend(screenshotButton);
    ytpRightControls.prepend(mp3btn);
  }

  chrome.storage.sync.get("playbackSpeedButtons", function (result) {
    if (result.playbackSpeedButtons) {
      ytpRightControls.prepend(speed3xButton);
      ytpRightControls.prepend(speed25xButton);
      ytpRightControls.prepend(speed2xButton);
      ytpRightControls.prepend(speed15xButton);
      ytpRightControls.prepend(speed1xButton);

      var playbackRate = document.getElementsByTagName("video")[0].playbackRate;
      switch (playbackRate) {
        case 1:
          speed1xButton.classList.add("SYTactive");
          activePBRButton = speed1xButton;
          break;
        case 2:
          speed2xButton.classList.add("SYTactive");
          activePBRButton = speed2xButton;
          break;
        case 2.5:
          speed25xButton.classList.add("SYTactive");
          activePBRButton = speed25xButton;
          break;
        case 3:
          speed3xButton.classList.add("SYTactive");
          activePBRButton = speed3xButton;
          break;
      }
    }
  });
}

// Remove the listener to avoid repeated executions
//   chrome.tabs.onUpdated.removeListener(listener);
function mp3Button() {
  // Retrieve the previously saved URL from storage
  // chrome.storage.local.get(["currentUrl"], (result) => {
  // const previousUrl = result.currentUrl;
  const clickedUrl = window.location.href; // Use window.location.href to get the current URL

  navigator.clipboard.writeText(clickedUrl).then(() => {
    console.log('URL copied to clipboard:', clickedUrl);
  }).catch(err => {
    console.error('Failed to copy URL to clipboard:', err);
  });
  // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  //   console.log("Active tab URL:", tabs[0].url);
  // });

  // if (previousUrl !== clickedUrl) {
  // Save the new URL in storage
  chrome.storage.local.set({ currentUrl: clickedUrl }, () => {
    // console.log(clickedUrl, "URL has been saved.");

    // Retrieve and log the entire storage object
    chrome.storage.local.get(null, (allItems) => {
      console.log("Stored items:", allItems);
      window.open("https://y2mate.nu/en-jyGm/", "_blank");

    });
  });
  // }
  // });

  // Open the URL in a new tab
}


// let canRunTryActions = true; // Flag to control the execution of tryActions
//  function myfunc() {
//   console.log("page js code:");

//   function tryActions() {
//     if (!canRunTryActions) {
//       return; // Exit if tryActions is not allowed to run
//     }

//     canRunTryActions = false; // Disable further execution for the next 30 seconds

//     // Reset the flag after 30 seconds
//     setTimeout(() => {
//       canRunTryActions = true;
//     }, 30000);

//     // Try to fill the input field
//     const inputField = document.querySelector("#s_input");
//     if (inputField) {
//       chrome.storage.local.get(["currentUrl"], (result) => {
//         if (result.currentUrl) {
//           inputField.value = result.currentUrl;
//         }
//       });
//       console.log("Input field filled with URL:");

//       // Check every second for the search button
//       const searchButtonInterval = setInterval(() => {
//         const searchButton = document.querySelector("#search-form > button");
//         if (searchButton) {
//           setTimeout(() => {
//             searchButton.click();

//             console.log("Search button clicked");
//           }, 1000);
//           clearInterval(searchButtonInterval);

//           // Check every second for the action button
//           const actionButtonInterval = setInterval(() => {
//             const actionButton = document.querySelector("#btn-action");
//             if (actionButton) {
//               setTimeout(() => {
//                 actionButton.click();
//                 console.log("Action button clicked");
//               }, 1000);

//               clearInterval(actionButtonInterval);

//               // Check every second for the success button
//               const successButtonInterval = setInterval(() => {
//                 const successButton = document.querySelector("#asuccess");
//                 if (successButton && successButton.href !== "#") {
//                   setTimeout(() => {
//                     window.open(successButton.href);
//                     console.log("Success button clicked", successButton);

//                     setTimeout(() => {
//                       window.close();
//                     }, 3000);
//                   }, 2000);

//                   clearInterval(successButtonInterval);
//                 } else {
//                   console.log(
//                     "Success button not found or href is '#', retrying..."
//                   );
//                 }
//               }, 1000);
//             } else {
//               console.log("Action button not found, retrying...");
//             }
//           }, 1000);
//         } else {
//           console.log("Search button not found, retrying...");
//         }
//       }, 1000);
//     } else {
//       console.log("Input field not found, retrying...");
//       setTimeout(tryActions, 1000); // Retry every second
//     }
//   }

//   // Start the actions
//   tryActions();
// }


var screenshotButton = document.createElement("button");
screenshotButton.className = "screenshotButton ytp-button";
screenshotButton.style.width = "auto";
screenshotButton.innerHTML = "Screenshot";
screenshotButton.style.cssFloat = "left";
screenshotButton.onclick = CaptureScreenshot;

var mp3btn = document.createElement("button");
mp3btn.className = "mp3btn ytp-button";
mp3btn.style.width = "auto";
mp3btn.innerHTML = "mp3 down";
mp3btn.style.cssFloat = "left";
mp3btn.onclick = mp3Button;

var speed1xButton = document.createElement("button");
speed1xButton.className = "ytp-button SYText";
speed1xButton.innerHTML = "1×";
speed1xButton.onclick = function () {
  document.getElementsByTagName("video")[0].playbackRate = 1;
  activePBRButton.classList.remove("SYTactive");
  this.classList.add("SYTactive");
  activePBRButton = this;
};

var speed15xButton = document.createElement("button");
speed15xButton.className = "ytp-button SYText";
speed15xButton.innerHTML = "1.5×";
speed15xButton.onclick = function () {
  document.getElementsByTagName("video")[0].playbackRate = 1.5;
  activePBRButton.classList.remove("SYTactive");
  this.classList.add("SYTactive");
  activePBRButton = this;
};

var speed2xButton = document.createElement("button");
speed2xButton.className = "ytp-button SYText";
speed2xButton.innerHTML = "2×";
speed2xButton.onclick = function () {
  document.getElementsByTagName("video")[0].playbackRate = 2;
  activePBRButton.classList.remove("SYTactive");
  this.classList.add("SYTactive");
  activePBRButton = this;
};

var speed25xButton = document.createElement("button");
speed25xButton.className = "ytp-button SYText";
speed25xButton.innerHTML = "2.5×";
speed25xButton.onclick = function () {
  document.getElementsByTagName("video")[0].playbackRate = 2.5;
  activePBRButton.classList.remove("SYTactive");
  this.classList.add("SYTactive");
  activePBRButton = this;
};

var speed3xButton = document.createElement("button");
speed3xButton.className = "ytp-button SYText";
speed3xButton.innerHTML = "3×";
speed3xButton.onclick = function () {
  document.getElementsByTagName("video")[0].playbackRate = 3;
  activePBRButton.classList.remove("SYTactive");
  this.classList.add("SYTactive");
  activePBRButton = this;
};

activePBRButton = speed1xButton;

chrome.storage.sync.get(
  [
    "screenshotKey",
    "playbackSpeedButtons",
    "screenshotFunctionality",
    "screenshotFileFormat",
  ],
  function (result) {
    screenshotKey = result.screenshotKey;
    playbackSpeedButtons = result.playbackSpeedButtons;
    if (result.screenshotFileFormat === undefined) {
      screenshotFormat = "png";
    } else {
      screenshotFormat = result.screenshotFileFormat;
    }

    if (result.screenshotFunctionality === undefined) {
      screenshotFunctionality = 0;
    } else {
      screenshotFunctionality = result.screenshotFunctionality;
    }

    if (screenshotFormat === "jpeg") {
      extension = "jpg";
    } else {
      extension = screenshotFormat;
    }
  }
);

document.addEventListener("keydown", function (e) {
  if (
    document.activeElement.contentEditable === "true" ||
    document.activeElement.tagName === "INPUT" ||
    document.activeElement.tagName === "TEXTAREA" ||
    document.activeElement.contentEditable === "plaintext"
  )
    return true;

  if (playbackSpeedButtons) {
    switch (e.key) {
      case "q":
        speed1xButton.click();
        e.preventDefault();
        return false;
      case "s":
        speed15xButton.click();
        e.preventDefault();
        return false;
      case "w":
        speed2xButton.click();
        e.preventDefault();
        return false;
      case "e":
        speed25xButton.click();
        e.preventDefault();
        return false;
      case "r":
        speed3xButton.click();
        e.preventDefault();
        return false;
    }
  }

  if (screenshotKey && e.key === "p") {
    CaptureScreenshot();
    e.preventDefault();
    return false;
  }
});
