"use strict";

function getMaxIndexLengthFromMaxCount(maxCount) {
	return Math.ceil(Math.log10(maxCount));
}

function getPaddedIndexString(i, maxIndexLength) {
	const index = "" + i;
	return "000000000000".substr(0, maxIndexLength - index.length) + index;
}

function onAddonButtonClicked() {
	browser.tabs.query({"currentWindow": true}).then((tabs) => {
		const maxIndexLength = getMaxIndexLengthFromMaxCount(tabs.length);
		console.log("tab count = " + tabs.length);
		console.log("tab count length = " + maxIndexLength);
		let text = "";
		for (let key in tabs) {
			const tab = tabs[key];
			const i = parseInt(key);
			const index = getPaddedIndexString(i + 1, maxIndexLength);
			text += index + " [" + tab.title + "](" + tab.url + ")\n";
		}
		// console.log(text);
		navigator.clipboard.writeText(text);
	})
}

browser.browserAction.onClicked.addListener(onAddonButtonClicked);

function onError(error) {
	console.log(`Error: ${error}`);
}

function onGot(item) {
	let color = "blue";
	if (item.color) {
		color = item.color;
	}
	console.log(`10px solid ${color}`);
}

browser.storage.sync.get("color").then(onGot, onError);
