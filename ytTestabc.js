// function fillInputAndClickButtons(currentUrl) {
//     // Function to attempt filling the input field and clicking buttons
//     function tryActions() {
//         // Try to fill the input field
//         const inputField = document.querySelector("#s_input");
//         if (inputField) {
//             inputField.value = currentUrl;
//             console.log('Input field filled with URL:', currentUrl);
            
//             // Check every second for the search button
//             const searchButtonInterval = setInterval(() => {
//                 const searchButton = document.querySelector("#search-form > button");
//                 if (searchButton) {
//                     searchButton.click();
//                     console.log('Search button clicked');
//                     clearInterval(searchButtonInterval);

//                     // Check every second for the action button
//                     const actionButtonInterval = setInterval(() => {
//                         const actionButton = document.querySelector("#btn-action");
//                         if (actionButton) {
//                             actionButton.click();
//                             console.log('Action button clicked');
//                             clearInterval(actionButtonInterval);

//                             // Check every second for the success button
//                             const successButtonInterval = setInterval(() => {
//                                 const successButton = document.querySelector("#asuccess");
//                                 if (successButton) {
//                                     successButton.click();
//                                     console.log('Success button clicked');
//                                     clearInterval(successButtonInterval);
//                                 } else {
//                                     console.error("Success button not found, retrying...");
//                                 }
//                             }, 1000);
//                         } else {
//                             console.error("Action button not found, retrying...");
//                         }
//                     }, 1000);
//                 } else {
//                     console.error("Search button not found, retrying...");
//                 }
//             }, 1000);
//         } else {
//             console.error("Input field not found, retrying...");
//             setTimeout(tryActions, 1000); // Retry every second
//         }
//     }

//     // Start the actions
//     tryActions();
// }


function fillInputAndClickButtons(currentUrl) {
    // Function to attempt filling the input field and clicking buttons
    function tryActions() {
        // Try to fill the input field
        const inputField = document.querySelector("#s_input");
        if (inputField) {
            inputField.value = currentUrl;
            console.log('Input field filled with URL:', currentUrl);
            
            // Check every second for the search button
            const searchButtonInterval = setInterval(() => {
                const searchButton = document.querySelector("#search-form > button");
                if (searchButton) {
                    searchButton.click();
                    console.log('Search button clicked');
                    clearInterval(searchButtonInterval);

                    // Check every second for the action button
                    const actionButtonInterval = setInterval(() => {
                        const actionButton = document.querySelector("#btn-action");
                        if (actionButton) {
                            actionButton.click();
                            console.log('Action button clicked');
                            clearInterval(actionButtonInterval);

                            // Check every second for the success button
                            const successButtonInterval = setInterval(() => {
                                const successButton = document.querySelector("#asuccess");
                                if (successButton) {
                                    successButton.click();
                                    console.log('Success button clicked');
                                    clearInterval(successButtonInterval);
                                } else {
                                    console.error("Success button not found, retrying...");
                                }
                            }, 1000);
                        } else {
                            console.error("Action button not found, retrying...");
                        }
                    }, 1000);
                } else {
                    console.error("Search button not found, retrying...");
                }
            }, 1000);
        } else {
            console.error("Input field not found, retrying...");
            setTimeout(tryActions, 1000); // Retry every second
        }
    }

    // Start the actions
    tryActions();
}

// Execute the function after DOM is fully loaded
window.onload = () => {
    // Retrieve the URL from chrome.storage.local
    chrome.storage.local.get(['currentUrl'], (result) => {
        if (result.currentUrl) {
            fillInputAndClickButtons(result.currentUrl);
        } else {
            console.error("Current URL not found in storage");
        }
    });
};
