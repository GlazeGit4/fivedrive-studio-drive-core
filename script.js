let entries = JSON.parse(localStorage.getItem("fiveDriveEntries")) || [];

function saveEntries() {
  localStorage.setItem("fiveDriveEntries", JSON.stringify(entries));
}

function renderFileList() {
  const list = document.getElementById('fileList');
  list.innerHTML = "";
  entries.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.type === "folder" ? "📁" : "📄"} ${item.name}</span>
      <span>
        ${item.type === "file" ? `<button onclick="downloadFile('${item.id}')">⬇ Download</button>` : ""}
        <button onclick="deleteEntry('${item.id}')">🗑 Delete</button>
      </span>
    `;
    list.appendChild(li);
  });
}

function createFolder(name) {
  const folder = {
    id: `folder-${Date.now()}`,
    name: name || "New Folder",
    type: "folder",
    files: []
  };
  entries.push(folder);
  saveEntries();
  renderFileList();
}

function handleFileUpload() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    entries.push({
      id: `file-${Date.now()}`,
      name: file.name,
      type: "file",
      data: e.target.result,
      fileType: file.type
    });
    saveEntries();
    renderFileList();
  };
  reader.readAsDataURL(file);
}

function handleFolderUpload() {
  const files = document.getElementById("folderInput").files;
  if (!files.length) return;

  showFolderNamingModal(files);
}

function finalizeFolderUpload(folderName, files) {
  const folder = {
    id: `folder-${Date.now()}`,
    name: folderName || "Uploaded Folder",
    type: "folder",
    files: []
  };

  let remaining = files.length;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      folder.files.push({
        name: file.webkitRelativePath || file.name,
        data: e.target.result,
        type: file.type
      });

      remaining--;
      if (remaining === 0) {
        entries.push(folder);
        saveEntries();
        renderFileList();
      }
    };
    reader.readAsDataURL(file);
  }
}

function downloadFile(id) {
  const file = entries.find(f => f.id === id);
  if (!file) return;

  const link = document.createElement("a");
  link.href = file.data;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  saveEntries();
  renderFileList();
}

window.onload = renderFileList;
