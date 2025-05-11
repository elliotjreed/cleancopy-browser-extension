import { normaliseText } from "../utils/textNormaliser";

const createContextMenu = (): void => {
  chrome.contextMenus.create(
    {
      id: "cleanCopy",
      title: "Copy cleaned text",
      contexts: ["selection"]
    },
    (): void => {
      if (chrome.runtime.lastError) {
        console.error("Error creating context menu: ", chrome.runtime.lastError.message);
      }
    }
  );
};

const copyToClipboard = (text: string): void => {
  const textarea: HTMLTextAreaElement = document.createElement("textarea");
  textarea.value = text;

  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.whiteSpace = "pre";

  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } catch (error) {
    console.error("Failed to copy text via document.execCommand('copy'): ", error);
  }

  document.body.removeChild(textarea);
};

const getRawSelection = (): string => {
  const selection: Selection | null = window.getSelection();

  return selection ? selection.toString() : "";
};

createContextMenu();

chrome.contextMenus.onClicked.addListener((info, tab): void => {
  if (info.menuItemId === "cleanCopy" && info.selectionText) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(normaliseText(info.selectionText))
        .catch((error): void => console.error("Failed to copy text via navigator.clipboard.writeText(): ", error));
    } else {
      chrome.scripting
        .executeScript({
          target: { tabId: tab?.id || -1 },
          func: getRawSelection
        })
        .then((results): void => {
          if (results && results[0] && results[0].result) {
            const rawText: string = results[0].result as string;

            chrome.scripting
              .executeScript({
                target: { tabId: tab?.id || -1 },
                func: copyToClipboard,
                args: [normaliseText(rawText)]
              })
              .catch((error): void => console.error("Error calling chrome.scripting.executeScript(): ", error));
          }
        })
        .catch((error): void => console.error("Error getting raw selection: ", error));
    }
  }
});
