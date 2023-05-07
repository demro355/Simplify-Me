// Set the initial state of the extension to OFF
let focusStatus = 'OFF';

// Define a function to toggle the extension state and update the badge text
async function toggleExtensionState(tab) {
  // Next state will always be the opposite
  focusStatus = focusStatus === 'ON' ? 'OFF' : 'ON';
  
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: focusStatus
  });

  // Will now load or unload the CSS file depending on the extension state
  const cssFile = 'focus.css';
  const fileAction = focusStatus === 'ON' ? 'insertCSS' : 'removeCSS';
  await chrome.scripting[fileAction]({
    files: [cssFile],
    target: { tabId: tab.id }
  });
}

// Badge text set to 'OFF' when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

// It will listen for clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // Only toggle the extension state if the tab is active and the URL is valid
  if (tab && tab.url && tab.active) {
    // Toggle the extension state and update the badge text
    await toggleExtensionState(tab);
  }
});


  /*Adapted from/inspired by -
  GOOGLE, 2022. Inject scripts into the active tab. 
  [online]. Available at:
  https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-focus-mode/ 
  [Accessed: 06 March 2023]. */