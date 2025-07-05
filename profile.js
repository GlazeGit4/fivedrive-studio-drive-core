// 💾 Save profile info and sync with localStorage + UI
function saveProfile() {
  // Get profile values from inputs
  const username = document.getElementById("usernameInput").value.trim() || "Anonymous";
  const bio = document.getElementById("bioInput").value.trim() || "";

  // Save to localStorage
  localStorage.setItem("profileUsername", username);
  localStorage.setItem("bio", bio);

  // Update displayed values
  document.getElementById("bioText").textContent = bio;
  document.getElementById("usernameMini").textContent = username;
  document.getElementById("usernameInput").value = username;

  // === Profile Image Upload & Validation ===
  const picFile = document.getElementById("profilePicUpload").files[0];
  if (picFile) {
    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/x-icon", "image/svg+xml",
      "image/tiff", "image/raw", "image/vnd.adobe.photoshop", "application/indesign"
    ];

    if (!allowedTypes.includes(picFile.type)) {
      alert("❌ Invalid image format. Please use one of the following: JPG, JPEG, PNG, ICO, SVG, TIFF, RAW, PSD, INDD");
    } else {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          if (img.width === 100 && img.height === 100) {
            localStorage.setItem("profileImage", event.target.result);
            document.getElementById("profilePreview").src = event.target.result;
            document.getElementById("avatarMini").src = event.target.result;
          } else {
            alert("⚠️ Profile picture must be exactly 100×100 pixels for best appearance in the profile widget.");
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(picFile);
    }
  }

  // === Banner Image Upload ===
  const bannerFile = document.getElementById("bannerUpload").files[0];
  if (bannerFile) {
    const bannerReader = new FileReader();
    bannerReader.onload = function (e) {
      const dataURL = e.target.result;
      localStorage.setItem("profileBanner", dataURL);
      document.getElementById("bannerPreview").src = dataURL;
      document.getElementById("bannerMini").style.backgroundImage = `url(${dataURL})`;
    };
    bannerReader.readAsDataURL(bannerFile);
  }
}

// 🎨 Theme switching logic
function applyTheme(theme) {
  const body = document.body;

  // Reset all theme styles
  body.className = "";
  body.style.removeProperty("--custom-bg");
  body.removeAttribute("data-custom-bg");

  // Apply selected theme
  if (theme === "custom") {
    const customColor = localStorage.getItem("customColor") || "#111";
    body.classList.add("theme-custom");
    body.style.setProperty("--custom-bg", customColor);
    body.dataset.customBg = customColor;
  } else {
    body.classList.add(`theme-${theme}`);
  }

  localStorage.setItem("selectedTheme", theme);
}

// 🎨 Custom color picker logic
function setCustomTheme() {
  const color = document.getElementById("customColorPicker").value;
  document.body.className = "theme-custom";
  document.body.style.setProperty("--custom-bg", color);
  document.body.dataset.customBg = color;

  localStorage.setItem("selectedTheme", "custom");
  localStorage.setItem("customColor", color);
}

// 🚀 Load all saved profile data and themes on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("profileUsername") || "Anonymous";
  const bio = localStorage.getItem("bio") || "";
  const profileImage = localStorage.getItem("profileImage");
  const bannerImage = localStorage.getItem("profileBanner");
  const selectedTheme = localStorage.getItem("selectedTheme") || "normal";
  const customColor = localStorage.getItem("customColor");

  // Populate input fields and UI
  document.getElementById("usernameInput").value = username;
  document.getElementById("bioInput").value = bio;
  document.getElementById("bioText").textContent = bio;
  document.getElementById("usernameMini").textContent = username;

  if (profileImage) {
    document.getElementById("profilePreview").src = profileImage;
    document.getElementById("avatarMini").src = profileImage;
  }

  if (bannerImage) {
    document.getElementById("bannerPreview").src = bannerImage;
    document.getElementById("bannerMini").style.backgroundImage = `url(${bannerImage})`;
  }

  // Load theme
  applyTheme(selectedTheme);
  document.getElementById("themeSelect").value = selectedTheme;

  if (customColor) {
    document.getElementById("customColorPicker").value = customColor;
  }
});
