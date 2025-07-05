// Load and display existing lists
function loadLists() {
  const listData = JSON.parse(localStorage.getItem("driveLists") || "[]");
  const container = document.getElementById("listCollection");
  container.innerHTML = "";

  listData.forEach((listName, i) => {
    const li = document.createElement("li");
    li.textContent = `📁 ${listName}`;
    container.appendChild(li);
  });
}

// Create a new list and save to localStorage
function createList() {
  const input = document.getElementById("newListName");
  const name = input.value.trim();
  if (!name) return;

  let lists = JSON.parse(localStorage.getItem("driveLists") || "[]");
  if (!lists.includes(name)) {
    lists.push(name);
    localStorage.setItem("driveLists", JSON.stringify(lists));
    loadLists();
    input.value = "";
  }
}

// Toggle the extension sorter setting
function toggleExtensionSort() {
  const enabled = document.getElementById("extSorter").checked;
  localStorage.setItem("autoExtensionFolders", enabled);

  if (enabled) {
    alert("✅ Auto Extension List is ON.\nDrive will sort uploads like JPG, PNG, PDF into folders automatically.");
  }
}

// Show all drive storage
function showStoredInfo() {
  const modal = document.getElementById("infoModal");
  const container = document.getElementById("storedContent");
  modal.style.display = "block";

  const files = JSON.parse(localStorage.getItem("driveFiles") || "[]");
  const folders = JSON.parse(localStorage.getItem("driveFolders") || "[]");
  const lists = JSON.parse(localStorage.getItem("driveLists") || "[]");

  let output = `🗂️ Folders (${folders.length}):\n`;
  folders.forEach(f => output += `   • ${f}\n`);

  output += `\n📄 Files (${files.length}):\n`;
  files.forEach(f => output += `   • ${f.name}${f.folder ? ` (in ${f.folder})` : ""}\n`);

  if (lists.length > 0) {
    output += `\n📝 Custom Lists (${lists.length}):\n`;
    lists.forEach(l => output += `   • ${l}\n`);
  }

  output += `\n📍 This data is stored locally in your browser for:\nfile:///C:/Users/tigne/OneDrive/Desktop/FideDrive/drive.html`;
  output += `\n\n⚙️ To manage lists and settings, visit:\nfile:///C:/Users/tigne/OneDrive/Desktop/FideDrive/page.html`;

  container.innerHTML = `<pre>${output}</pre>`;
}

// Load everything
window.addEventListener("DOMContentLoaded", () => {
  loadLists();

  const extensionPref = localStorage.getItem("autoExtensionFolders") === "true";
  document.getElementById("extSorter").checked = extensionPref;
});
