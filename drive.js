let currentFolder = null;
let fileDB = JSON.parse(localStorage.getItem("driveFiles") || "[]");
let folderDB = JSON.parse(localStorage.getItem("driveFolders") || "[]");

function renderFiles() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  const filtered = currentFolder
    ? fileDB.filter(f => f.folder === currentFolder)
    : fileDB.filter(f => !f.folder);

  filtered.forEach((item, index) => {
    const trueIndex = fileDB.indexOf(item);
    const li = document.createElement("li");
    li.innerHTML = `<span class="name">📄 ${item.name}${item.folder ? ` (in ${item.folder})` : ""}</span>
      <a href="${item.url}" download="${item.name}"><button>⬇️</button></a>
      <button onclick="deleteFile(${trueIndex})">🗑️</button>`;
    list.appendChild(li);
  });
}

function renderFolders() {
  const list = document.getElementById("folderList");
  list.innerHTML = "";

  // Show all folders only on home
  if (currentFolder === null) {
    folderDB.forEach((folder, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="name folder-link" onclick="openFolder('${folder}')">📁 ${folder}</span>
        <button onclick="deleteFolder(${index})">🗑️</button>`;
      list.appendChild(li);
    });
  }
}

function handleFileUpload() {
  const input = document.getElementById("fileInput");
  const autoSort = localStorage.getItem("autoExtensionFolders") === "true";

  [...input.files].forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : "UNKNOWN";
      const extFolder = `${extension}s`;
      const targetFolder = autoSort ? extFolder : currentFolder;

      if (autoSort && !folderDB.includes(extFolder)) {
        folderDB.push(extFolder);
        localStorage.setItem("driveFolders", JSON.stringify(folderDB));
        renderFolders();
      }

      fileDB.push({
        name: file.name,
        url: e.target.result,
        folder: targetFolder
      });

      localStorage.setItem("driveFiles", JSON.stringify(fileDB));
      renderFiles();
    };
    reader.readAsDataURL(file);
  });
}

function handleFolderUpload() {
  const input = document.getElementById("folderInput");
  const seen = new Set(folderDB);

  for (const file of input.files) {
    const folder = file.webkitRelativePath.split("/")[1];
    if (!seen.has(folder)) {
      folderDB.push(folder);
      seen.add(folder);
    }
  }

  localStorage.setItem("driveFolders", JSON.stringify(folderDB));
  renderFolders();
}

function createFolder() {
  const name = prompt("📁 New Folder Name:");
  if (name && !folderDB.includes(name)) {
    folderDB.push(name);
    localStorage.setItem("driveFolders", JSON.stringify(folderDB));
    renderFolders();
  }
}

function deleteFile(index) {
  fileDB.splice(index, 1);
  localStorage.setItem("driveFiles", JSON.stringify(fileDB));
  renderFiles();
}

function deleteFolder(index) {
  const name = folderDB[index];
  folderDB.splice(index, 1);
  fileDB = fileDB.filter(f => f.folder !== name);
  localStorage.setItem("driveFolders", JSON.stringify(folderDB));
  localStorage.setItem("driveFiles", JSON.stringify(fileDB));
  renderFolders();
  renderFiles();
}

function openFolder(name) {
  currentFolder = name;
  document.querySelector("h1").textContent = `📁 Inside folder: ${name}`;
  document.querySelector(".upload-actions").innerHTML = `
    <button onclick="document.getElementById('fileInput').click()">📄 Add file to "${name}"</button>
    <button onclick="goBack()">⬅️ Back to Drive</button>`;
  renderFiles();
  renderFolders(); // This will now hide folders when inside a folder
}

function goBack() {
  currentFolder = null;
  document.querySelector("h1").textContent = "🗃️ Your Current Drive";
  document.querySelector(".upload-actions").innerHTML = `
    <button onclick="document.getElementById('fileInput').click()">📄 Upload File</button>
    <button onclick="document.getElementById('folderInput').click()">📂 Upload Folder</button>
    <button onclick="createFolder()">📁 New Folder</button>`;
  renderFiles();
  renderFolders();
}

window.addEventListener("DOMContentLoaded", () => {
  renderFiles();
  renderFolders();
});

