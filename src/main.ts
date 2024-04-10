import { invoke } from "@tauri-apps/api/tauri";

let targetFileInputEl: HTMLInputElement | null;
let targetFileButtonEl: HTMLButtonElement | null;
let outputDirInputEl: HTMLInputElement | null;
let outputDirButtonEl: HTMLButtonElement | null;
let outputNameInputEl: HTMLInputElement | null;
let outputTypeDropdownEl: HTMLSelectElement | null;

let resultMessageEl: HTMLParagraphElement | null;

let convertButtonEl: HTMLButtonElement | null;
let clearButtonEl: HTMLButtonElement | null;

function sanitiseInput(inputEl: HTMLInputElement | null, regex: RegExp) {
	if (inputEl?.value) {
		inputEl.value = inputEl.value.replace(regex, "");
	}
}

function setResultMessage(text: string, success: boolean) {
	resultMessageEl!.textContent = text;

	if (success) {
		resultMessageEl?.classList.remove("u-red-text");
		resultMessageEl?.classList.add("u-green-text");
	} else {
		resultMessageEl?.classList.add("u-red-text");
		resultMessageEl?.classList.remove("u-green-text");
	}
}

async function selectTargetFile() {
	const filePath: string = await invoke("select_file");
	targetFileInputEl!.value = filePath ? filePath : targetFileInputEl!.value;
}

async function selectOutputDirectory() {
	const dirPath: string = await invoke("select_directory");
	outputDirInputEl!.value = dirPath ? dirPath : outputDirInputEl!.value;
}

async function convertFile() {
	if (!(targetFileInputEl!.value.trim() && outputDirInputEl!.value.trim() && outputNameInputEl!.value.trim())) {
		setResultMessage("Fill in all the inputs before converting", false);
		return;
	}

	const result: [resultMessage: string, success: boolean] = await invoke("convert_image_file", {
		imgPath: targetFileInputEl!.value,
		outDir: outputDirInputEl!.value,
		outName: outputNameInputEl!.value,
		outType: outputTypeDropdownEl!.value,
	});

	const [resultMessage, success] = result;
	setResultMessage(resultMessage, success);
}

async function clear() {
	targetFileInputEl!.value = "";
	outputDirInputEl!.value = "";
	outputNameInputEl!.value = "";

	resultMessageEl!.textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
	targetFileInputEl = document.querySelector("#target-input");
	targetFileButtonEl = document.querySelector("#target-btn");
	outputDirInputEl = document.querySelector("#out-dir-input");
	outputDirButtonEl = document.querySelector("#out-dir-btn");
	outputNameInputEl = document.querySelector("#out-name-input");
	outputTypeDropdownEl = document.querySelector("#out-name-dropdown");

	resultMessageEl = document.querySelector("#result-msg");

	convertButtonEl = document.querySelector("#convert-btn");
	clearButtonEl = document.querySelector("#clear-btn");

	targetFileButtonEl?.addEventListener("click", (e) => {
		e.preventDefault();
		selectTargetFile();
	});

	targetFileInputEl?.addEventListener("input", (_) => {
		sanitiseInput(targetFileInputEl, /^[a-z]:((\\|\/)[a-z0-9\s_@^!#$%&+={}[\]-]+)$/i);
	});

	outputDirInputEl?.addEventListener("input", (_) => {
		sanitiseInput(outputDirInputEl, /^[a-z]:((\\|\/)[a-z0-9\s_@^!#$%&+={}[\]-]+)$/i);
	});

	outputNameInputEl?.addEventListener("input", (_) => {
		sanitiseInput(outputNameInputEl, /[^a-zA-Z0-9 ]/g);
	});

	outputDirButtonEl?.addEventListener("click", (e) => {
		e.preventDefault();
		selectOutputDirectory();
	});

	convertButtonEl?.addEventListener("click", (e) => {
		e.preventDefault();
		convertFile();
	});

	clearButtonEl?.addEventListener("click", (e) => {
		e.preventDefault();
		clear();
	});
});
