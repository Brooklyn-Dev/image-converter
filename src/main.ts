import { invoke } from "@tauri-apps/api/tauri";

let targetFileInputEl: HTMLInputElement | null;
let targetFileButtonEl: HTMLButtonElement | null;
let outputDirInputEl: HTMLInputElement | null;
let outputDirButtonEl: HTMLButtonElement | null;
let outputNameInputEl: HTMLInputElement | null;
let outputTypeDropdownEl: HTMLSelectElement | null;

let convertButtonEl: HTMLButtonElement | null;
let clearButtonEl: HTMLButtonElement | null;

function sanitiseInput(inputEl: HTMLInputElement | null, regex: RegExp) {
	if (inputEl?.value) {
		inputEl.value = inputEl.value.replace(regex, "");
	}
}

async function selectTargetFile() {
	if (targetFileInputEl) {
		let filePath: string = await invoke("select_file");
		targetFileInputEl.value = filePath ? filePath : targetFileInputEl.value;
	}
}

async function selectOutputDirectory() {
	if (outputDirInputEl) {
		let dirPath: string = await invoke("select_directory");
		outputDirInputEl.value = dirPath ? dirPath : outputDirInputEl.value;
	}
}

async function clearInputs() {
	if (targetFileInputEl && outputDirInputEl && outputNameInputEl) {
		targetFileInputEl.value = ""; // !.
		outputDirInputEl.value = "";
		outputNameInputEl.value = "";
	}
}

window.addEventListener("DOMContentLoaded", () => {
	targetFileInputEl = document.querySelector("#target-input");
	targetFileButtonEl = document.querySelector("#target-btn");
	outputDirInputEl = document.querySelector("#out-dir-input");
	outputDirButtonEl = document.querySelector("#out-dir-btn");
	outputNameInputEl = document.querySelector("#out-name-input");
	outputTypeDropdownEl = document.querySelector("#out-name-btn");

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

	clearButtonEl?.addEventListener("click", (e) => {
		e.preventDefault();
		clearInputs();
	});
});
