function myfunc(inputSelector, elements, descriptions) {
  console.log("myfunc js code: hu maii");
  // Start the actions
  tryActions(inputSelector, elements, descriptions);
}
let canRunTryActions = true; // Flag to control the execution of tryActions

function tryActions(inputSelector, elements, descriptions) {
  if (!canRunTryActions) {
    return; // Exit if tryActions is not allowed to run
  }

  canRunTryActions = false; // Disable further execution for the next 30 seconds

  // Reset the flag after 30 seconds
  setTimeout(() => {
    canRunTryActions = true;
  }, 30000);


  const inputField = document.querySelector(inputSelector);
  if (inputField) {
    chrome.storage.local.get(["currentUrl"], (result) => {
      if (result.currentUrl) {
        inputField.value = result.currentUrl;
      }
    });
    console.log("Input field filled with URL:");


    if (elements.length !== descriptions.length) {
      console.error("The number of CSS selectors and descriptions must match.");
    } else {
      // Function to process elements sequentially
      const processElements = (index) => {
        if (index >= elements.length) {
          console.log("All elements have been processed.");
          return;
        }

        const selector = elements[index];
        const description = descriptions[index];

        const interval = setInterval(() => {
          const element = document.querySelector(selector);

          if (element) {
            setTimeout(() => {
              if (element.href !== "#") {
              //   window.open(element.href);
              //   console.log(`${description} clicked:`, element.href);
              //   setTimeout(() => {
              //     window.close();
              //   }, 3000);
              // } else {
                element.click();
                console.log(`${description} clicked.`);
              }
              clearInterval(interval);
              processElements(index + 1);
            }, 1000);
          } else {
            console.log(`${description} not found, retrying...`);
          }
        }, 1000);
      };

      // Start processing the first element
      processElements(0);
    }



  }


}