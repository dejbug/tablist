function onAddonButtonClicked() {
	browser.tabs.query({"currentWindow":true}).then((tabs) => {
		// console.log("tab count = " + tabs.length);
		text = ""
		for (let i in tabs) {
			let tab = tabs[i];
			text += tab.index + ". [" + tab.title + "](" + tab.url + ")\n";
		}
		// console.log(text);
		navigator.clipboard.writeText(text);
	})
}

browser.browserAction.onClicked.addListener(onAddonButtonClicked);
