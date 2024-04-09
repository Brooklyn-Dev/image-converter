import { invoke } from "@tauri-apps/api/tauri";

let targetFileInputEl: HTMLInputElement | null;
let targetFileButtonEl: HTMLButtonElement | null;
let outputDirInputEl: HTMLInputElement | null;
let outputDirButtonEl: HTMLButtonElement | null;
let outputNameInputEl: HTMLButtonElement | null;
let outputTypeDropdownEl: HTMLSelectElement | null;

let convertButtonEl: HTMLButtonElement | null;
let clearButtonEl: HTMLButtonElement | null;

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

	clearButtonEl?.addEventListener("click", (e) => {
		e.preventDefault();
		clearInputs();
	});
});
