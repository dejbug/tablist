
function saveOptions(e) {
	e.preventDefault();
	browser.storage.sync.set({
		color: document.querySelector("#color").value,
	});
}

function restoreOptions() {
	function setCurrentChoice(result) {
		// document.querySelector("#color").value = result.color || "blue";
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	browser.storage.sync.get("color")
		.then(setCurrentChoice, onError);
}

function updateSepratorChoices(elements) {
	if (elements.preset.value == "text") {
		return [null, ' ', '\\t', ', ', ' '];
	}
	else if (elements.preset.value == "html") {
		return [null, '&nbsp;', '. ', ' : ', ' &mdash; '];
	}
	else if (elements.preset.value == "markdown") {
		return [null, ' ', '. ', ' : ', ' | '];
	}
}

function getSeparator(elements) {
	if (elements.separator.value == 'space') return 1;
	else if (elements.separator.value == 'tab') return 2;
	else if (elements.separator.value == 'comma') return 3;
	else if (elements.separator.value == 'semicolon') return 4;
	return 0;
}

const I = 0;
const T = 1;
const U = 2;

function makeTextFormat(elements) {
	const separators = updateSepratorChoices(elements);
	const separatorIndex = getSeparator(elements);
	const separator = separators[separatorIndex];

	let format = '';

	if (elements.option[I].checked)
	{
		format += '%i';
	}
	if (elements.option[T].checked)
	{
		if (format.length)
			format += separator;
		format += separatorIndex == 4 ? '"%t"' : '%t';
	}
	if (elements.option[U].checked)
	{
		if (format.length)
			format += separator
		format += separatorIndex == 4 ? '<%u>' : '%u';
	}
	if (format.length)
		format += '\\n';

	return format;
}

function makeHtmlFormat(elements) {
	const separators = updateSepratorChoices(elements);
	const separator = separators[getSeparator(elements)];

	let format = '';

	if (elements.option[U].checked)
	{
		format += '<a href="%u">';
	}
	if (elements.option[I].checked)
	{
		format += '%i';
	}
	if (elements.option[T].checked)
	{
		if (elements.option[I].checked)
			format += separator;
		format += '%t';
	}
	else if (elements.option[U].checked)
	{
		if (elements.option[I].checked)
			format += separator;
		format += '%u';
	}
	if (elements.option[U].checked)
		format += '</a>';
	if (format.length)
		format += '<br>'

	return format;
}

function makeMarkdownFormat(elements) {
	const separators = updateSepratorChoices(elements);
	const separator = separators[getSeparator(elements)];

	let format = '[';

	if (elements.option[I].checked)
	{
		format += '%i';
	}
	if (elements.option[T].checked)
	{
		if (elements.option[I].checked)
			format += separator;
		format += '%t';
	}
	else if (elements.option[U].checked)
	{
		if (elements.option[I].checked)
			format += separator;
		format += '%u';
	}
	format += ']';
	if (elements.option[U].checked)
	{
		format += '(%u)';
	}
	format += '\\n';

	return format;
}

function setEditorFromPreset(text) {
	const editor = document.querySelector("#format");
	const elements = document.querySelector('form').elements;

	if (elements.preset.value == "text")
	{
		editor.value = makeTextFormat(elements);
	}
	else if (elements.preset.value == "html")
	{
		editor.value = makeHtmlFormat(elements);
	}
	else if (elements.preset.value == "markdown")
	{
		editor.value = makeMarkdownFormat(elements);
	}
}

function onPresetSelected(e) {
	// console.log(e.target.id);
	setEditorFromPreset(e.target.id);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

document.querySelectorAll("input[name=preset], input[name=option], input[name=separator]")
	.forEach(e => e.addEventListener("input", onPresetSelected));

setEditorFromPreset("text");
