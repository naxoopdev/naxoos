// ===============================
// NAXO OS
// ===============================

const desktop = document.getElementById("desktop");
const startMenu = document.getElementById("start-menu");
const startButton = document.getElementById("start-button");
const windowsContainer = document.getElementById("windows-container");
const taskbarApps = document.getElementById("taskbar-apps");

let highestZ = 100;
let windowCounter = 0;


// ===============================
// BOOT
// ===============================

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("boot-screen").classList.add("hidden");
  }, 1800);

  updateClock();
  setInterval(updateClock, 1000);
});


// ===============================
// CLOCK
// ===============================

function updateClock() {
  const now = new Date();

  document.getElementById("clock-time").textContent =
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  document.getElementById("clock-date").textContent =
    now.toLocaleDateString();
}


// ===============================
// START MENU
// ===============================

startButton.addEventListener("click", (event) => {
  event.stopPropagation();
  startMenu.classList.toggle("open");
});

startMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  startMenu.classList.remove("open");
});


// ===============================
// APP INFORMATION
// ===============================

const apps = {
  files: {
    title: "Files",
    icon: "📁",
    width: 760,
    height: 500
  },

  terminal: {
    title: "Terminal",
    icon: "💻",
    width: 700,
    height: 430
  },

  notes: {
    title: "Notes",
    icon: "📝",
    width: 650,
    height: 480
  },

  calculator: {
    title: "Calculator",
    icon: "🧮",
    width: 390,
    height: 520
  },

  settings: {
    title: "Settings",
    icon: "⚙️",
    width: 650,
    height: 480
  }
};


// ===============================
// OPEN APPS
// ===============================

document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => {
    openApp(button.dataset.app);
    startMenu.classList.remove("open");
  });
});


function openApp(appName) {

  const existing = document.querySelector(
    `.window[data-app="${appName}"]`
  );

  if (existing) {
    existing.classList.remove("minimized");
    focusWindow(existing);
    return;
  }

  const app = apps[appName];

  if (!app) return;

  windowCounter++;

  const win = document.createElement("div");

  win.className = "window";
  win.dataset.app = appName;

  win.style.width = app.width + "px";
  win.style.height = app.height + "px";

  win.style.left =
    Math.max(
      20,
      window.innerWidth / 2 -
      app.width / 2 +
      windowCounter * 18
    ) + "px";

  win.style.top =
    Math.max(
      20,
      window.innerHeight / 2 -
      app.height / 2 -
      30 +
      windowCounter * 12
    ) + "px";

  highestZ++;
  win.style.zIndex = highestZ;

  win.innerHTML = `
    <div class="window-titlebar">

      <div class="window-title">
        <span>${app.icon}</span>
        ${app.title}
      </div>

      <div class="window-controls">
        <button class="minimize">—</button>
        <button class="maximize">□</button>
        <button class="close">×</button>
      </div>

    </div>

    <div class="window-content">
      ${getAppContent(appName)}
    </div>
  `;

  windowsContainer.appendChild(win);

  createTaskbarIcon(appName);

  setupWindow(win);

  initializeApp(appName, win);
}


// ===============================
// APP CONTENT
// ===============================

function getAppContent(appName) {

  switch (appName) {

    case "files":

      return `
        <div class="file-manager">

          <aside class="file-sidebar">
            <button>🏠 Home</button>
            <button>🖥️ Desktop</button>
            <button>📄 Documents</button>
            <button>⬇️ Downloads</button>
            <button>🖼️ Pictures</button>
          </aside>

          <section class="file-content">

            <h3 style="margin-bottom:18px;">
              Home
            </h3>

            <div class="file-grid">

              <div class="file-item">
                <span>📁</span>
                <p>Documents</p>
              </div>

              <div class="file-item">
                <span>📁</span>
                <p>Downloads</p>
              </div>

              <div class="file-item">
                <span>📁</span>
                <p>Pictures</p>
              </div>

              <div class="file-item">
                <span>🎵</span>
                <p>Music</p>
              </div>

              <div class="file-item">
                <span>🎬</span>
                <p>Videos</p>
              </div>

              <div class="file-item">
                <span>💾</span>
                <p>System</p>
              </div>

            </div>

          </section>

        </div>
      `;


    case "terminal":

      return `
        <div class="terminal-app">

          <div class="terminal-output">
NaxoOS Terminal v1.0

Type "help" to see available commands.
          </div>

          <div class="terminal-line">

            <span class="terminal-prompt">
              naxo@webos:~$
            </span>

            <input
              class="terminal-input"
              autocomplete="off"
              autofocus
            >

          </div>

        </div>
      `;


    case "notes":

      const savedNote =
        localStorage.getItem("naxo-note") || "";

      return `
        <div class="notes-app">

          <textarea
            class="notes-textarea"
            placeholder="Start typing..."
          >${escapeHTML(savedNote)}</textarea>

        </div>
      `;


    case "calculator":

      return `
        <div class="calculator">

          <div class="calc-display">
            0
          </div>

          <div class="calc-grid">

            <button data-calc="clear">C</button>
            <button data-calc="back">⌫</button>
            <button data-value="%">%</button>
            <button
              class="operator"
              data-value="/"
            >÷</button>

            <button data-value="7">7</button>
            <button data-value="8">8</button>
            <button data-value="9">9</button>
            <button
              class="operator"
              data-value="*"
            >×</button>

            <button data-value="4">4</button>
            <button data-value="5">5</button>
            <button data-value="6">6</button>
            <button
              class="operator"
              data-value="-"
            >−</button>

            <button data-value="1">1</button>
            <button data-value="2">2</button>
            <button data-value="3">3</button>
            <button
              class="operator"
              data-value="+"
            >+</button>

            <button data-value="0">0</button>
            <button data-value=".">.</button>
            <button data-calc="negative">±</button>

            <button
              class="equals"
              data-calc="equals"
            >=</button>

          </div>

        </div>
      `;


    case "settings":

      return `
        <h2 class="settings-title">
          Settings
        </h2>

        <div class="setting-card">

          <h4>🎨 Personalization</h4>

          <p>
            Choose your desktop wallpaper.
          </p>

          <div class="wallpaper-options">

            <button
              class="
                wallpaper-option
                wallpaper-purple
              "
              data-wallpaper="purple"
            ></button>

            <button
              class="
                wallpaper-option
                wallpaper-blue
              "
              data-wallpaper="blue"
            ></button>

            <button
              class="
                wallpaper-option
                wallpaper-dark
              "
              data-wallpaper="dark"
            ></button>

          </div>

        </div>

        <div class="setting-card">
          <h4>💻 System</h4>
          <p>NaxoOS Web Edition</p>
        </div>

        <div class="setting-card">
          <h4>ℹ️ About</h4>
          <p>
            NaxoOS 1.0 • Built for the web.
          </p>
        </div>
      `;
  }

}


// ===============================
// WINDOW CONTROLS
// ===============================

function setupWindow(win) {

  const titlebar =
    win.querySelector(".window-titlebar");

  const closeButton =
    win.querySelector(".close");

  const minimizeButton =
    win.querySelector(".minimize");

  const maximizeButton =
    win.querySelector(".maximize");


  win.addEventListener("mousedown", () => {
    focusWindow(win);
  });


  closeButton.addEventListener("click", () => {

    const appName = win.dataset.app;

    win.remove();

    const taskIcon =
      document.querySelector(
        `.taskbar-app[data-app="${appName}"]`
      );

    if (taskIcon) taskIcon.remove();
  });


  minimizeButton.addEventListener("click", () => {
    win.classList.add("minimized");
  });


  maximizeButton.addEventListener("click", () => {
    win.classList.toggle("maximized");
  });


  titlebar.addEventListener("dblclick", () => {
    win.classList.toggle("maximized");
  });


  makeDraggable(win, titlebar);
}


function focusWindow(win) {

  highestZ++;

  win.style.zIndex = highestZ;
}


// ===============================
// DRAG WINDOWS
// ===============================

function makeDraggable(win, handle) {

  let dragging = false;

  let offsetX = 0;
  let offsetY = 0;


  handle.addEventListener("mousedown", event => {

    if (
      event.target.closest(
        ".window-controls"
      )
    ) return;

    if (
      win.classList.contains(
        "maximized"
      )
    ) return;

    dragging = true;

    const rect =
      win.getBoundingClientRect();

    offsetX =
      event.clientX - rect.left;

    offsetY =
      event.clientY - rect.top;

    focusWindow(win);
  });


  document.addEventListener("mousemove", event => {

    if (!dragging) return;

    let x =
      event.clientX - offsetX;

    let y =
      event.clientY - offsetY;

    x = Math.max(
      0,
      Math.min(
        x,
        window.innerWidth -
        win.offsetWidth
      )
    );

    y = Math.max(
      0,
      Math.min(
        y,
        window.innerHeight -
        65
      )
    );

    win.style.left = x + "px";
    win.style.top = y + "px";
  });


  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}


// ===============================
// TASKBAR
// ===============================

function createTaskbarIcon(appName) {

  if (
    document.querySelector(
      `.taskbar-app[data-app="${appName}"]`
    )
  ) return;

  const app = apps[appName];

  const button =
    document.createElement("button");

  button.className = "taskbar-app";
  button.dataset.app = appName;
  button.innerHTML = app.icon;

  button.addEventListener("click", () => {

    const win =
      document.querySelector(
        `.window[data-app="${appName}"]`
      );

    if (!win) return;

    if (
      win.classList.contains(
        "minimized"
      )
    ) {

      win.classList.remove(
        "minimized"
      );

      focusWindow(win);

    } else {

      win.classList.add(
        "minimized"
      );
    }

  });

  taskbarApps.appendChild(button);
}


// ===============================
// INITIALIZE APPS
// ===============================

function initializeApp(appName, win) {
  if (appName === "files") {
    initializeFiles(win);
  }

  if (appName === "terminal") {
    initializeTerminal(win);
  }

  if (appName === "notes") {
    initializeNotes(win);
  }

  if (appName === "calculator") {
    initializeCalculator(win);
  }

  if (appName === "settings") {
    initializeSettings(win);
  }
}


// ===============================
// NOTES
// ===============================

function initializeNotes(win) {

  const textarea =
    win.querySelector(
      ".notes-textarea"
    );

  textarea.addEventListener(
    "input",
    () => {

      localStorage.setItem(
        "naxo-note",
        textarea.value
      );

    }
  );
}


// ===============================
// CALCULATOR
// ===============================

function initializeCalculator(win) {

  const display =
    win.querySelector(
      ".calc-display"
    );

  let expression = "";


  win.querySelectorAll(
    "[data-value]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        expression +=
          button.dataset.value;

        display.textContent =
          expression || "0";
      }
    );

  });


  win.querySelector(
    '[data-calc="clear"]'
  ).addEventListener(
    "click",
    () => {

      expression = "";

      display.textContent = "0";
    }
  );


  win.querySelector(
    '[data-calc="back"]'
  ).addEventListener(
    "click",
    () => {

      expression =
        expression.slice(0, -1);

      display.textContent =
        expression || "0";
    }
  );


  win.querySelector(
    '[data-calc="negative"]'
  ).addEventListener(
    "click",
    () => {

      if (!expression) return;

      expression =
        expression.startsWith("-")
          ? expression.slice(1)
          : "-" + expression;

      display.textContent =
        expression;
    }
  );


  win.querySelector(
    '[data-calc="equals"]'
  ).addEventListener(
    "click",
    () => {

      try {

        if (
          !/^[0-9+\-*/%.() ]+$/.test(
            expression
          )
        ) {
          throw new Error();
        }

        const result =
          Function(
            `"use strict"; return (${expression})`
          )();

        expression =
          String(result);

        display.textContent =
          expression;

      } catch {

        display.textContent =
          "Error";

        expression = "";
      }

    }
  );
}


// ===============================
// TERMINAL
// ===============================

function initializeTerminal(win) {

  const input =
    win.querySelector(
      ".terminal-input"
    );

  const output =
    win.querySelector(
      ".terminal-output"
    );


  input.focus();


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Enter"
      ) return;

      const command =
        input.value.trim();

      output.textContent +=
        "\nnaxo@webos:~$ " +
        command +
        "\n";

      runCommand(
        command,
        output,
        win
      );

      input.value = "";

      const content =
        win.querySelector(
          ".window-content"
        );

      content.scrollTop =
        content.scrollHeight;
    }
  );
}


function runCommand(
  command,
  output,
  win
) {

  const args =
    command.split(" ");

  const cmd =
    args[0].toLowerCase();


  switch (cmd) {

    case "":
      break;


    case "help":

      output.textContent +=
`Available commands:

help       Show commands
clear      Clear terminal
date       Show current date
time       Show current time
whoami     Current user
echo       Print text
about      About NaxoOS
version    OS version
apps       List applications
open       Open an application
reboot     Restart NaxoOS`;

      break;


    case "clear":

      output.textContent = "";
      break;


    case "date":

      output.textContent +=
        new Date().toDateString();

      break;


    case "time":

      output.textContent +=
        new Date().toLocaleTimeString();

      break;


    case "whoami":

      output.textContent +=
        "naxo";

      break;


    case "echo":

      output.textContent +=
        args.slice(1).join(" ");

      break;


    case "about":

      output.textContent +=
        "NaxoOS is a web-based operating system.";

      break;


    case "version":

      output.textContent +=
        "NaxoOS 1.0 Web Edition";

      break;


    case "apps":

      output.textContent +=
`files
terminal
notes
calculator
settings`;

      break;


    case "open":

      const app =
        args[1]?.toLowerCase();

      if (apps[app]) {

        openApp(app);

        output.textContent +=
          `Opening ${app}...`;

      } else {

        output.textContent +=
          "Application not found.";
      }

      break;


    case "reboot":

      location.reload();
      break;


    default:

      output.textContent +=
        `Command not found: ${cmd}`;
  }
}


// ===============================
// SETTINGS
// ===============================

function initializeSettings(win) {

  win.querySelectorAll(
    "[data-wallpaper]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const wallpaper =
          button.dataset.wallpaper;

        setWallpaper(wallpaper);

        localStorage.setItem(
          "naxo-wallpaper",
          wallpaper
        );
      }
    );

  });
}


function setWallpaper(type) {

  if (type === "purple") {

    desktop.style.background = `
      radial-gradient(
        circle at 20% 20%,
        rgba(122,91,255,.35),
        transparent 30%
      ),
      linear-gradient(
        135deg,
        #090814,
        #171231,
        #090a18
      )
    `;

  }


  if (type === "blue") {

    desktop.style.background = `
      radial-gradient(
        circle at 25% 20%,
        rgba(31,129,255,.4),
        transparent 35%
      ),
      linear-gradient(
        135deg,
        #06101d,
        #092a4c,
        #07121f
      )
    `;

  }


  if (type === "dark") {

    desktop.style.background = `
      radial-gradient(
        circle at center,
        #252525,
        transparent 40%
      ),
      linear-gradient(
        135deg,
        #030303,
        #101010,
        #050505
      )
    `;

  }
}


const savedWallpaper =
  localStorage.getItem(
    "naxo-wallpaper"
  );

if (savedWallpaper) {
  setWallpaper(savedWallpaper);
}


// ===============================
// SEARCH APPS
// ===============================

const searchInput =
  document.getElementById(
    "app-search"
  );


searchInput.addEventListener(
  "input",
  () => {

    const query =
      searchInput.value
        .toLowerCase();

    document
      .querySelectorAll(
        ".start-apps button"
      )
      .forEach(button => {

        const name =
          button.textContent
            .toLowerCase();

        button.style.display =
          name.includes(query)
            ? ""
            : "none";
      });
  }
);


// ===============================
// POWER
// ===============================

document
  .getElementById(
    "power-button"
  )
  .addEventListener(
    "click",
    () => {

      startMenu.classList.remove(
        "open"
      );

      const shutdown =
        document.getElementById(
          "shutdown-screen"
        );

      shutdown.classList.add(
        "show"
      );

      setTimeout(() => {

        shutdown.innerHTML = `
          <div>

            <div
              class="shutdown-logo"
              style="
                cursor:pointer;
              "
            >
              N
            </div>

            <h2>
              NaxoOS is powered off
            </h2>

            <p
              style="
                margin-top:12px;
                color:#777;
                font-size:12px;
              "
            >
              Click the logo to restart
            </p>

          </div>
        `;

        shutdown
          .querySelector(
            ".shutdown-logo"
          )
          .addEventListener(
            "click",
            () => location.reload()
          );

      }, 1300);

    }
  );


// ===============================
// UTILITIES
// ===============================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


// ===============================
// NAXO OS 2.0 — QUICK SETTINGS
// ===============================

const wifiButton = document.getElementById("wifi-button");
const soundButton = document.getElementById("sound-button");

let wifiEnabled = true;
let bluetoothEnabled = true;
let nightLightEnabled = false;
let volume = 75;

// Create Quick Settings panel
const quickSettings = document.createElement("section");

quickSettings.id = "quick-settings";

quickSettings.innerHTML = `
  <div class="quick-settings-grid">

    <button class="quick-toggle active" data-setting="wifi">
      <span class="quick-icon">◉</span>
      <div>
        <strong>Wi-Fi</strong>
        <small>Connected</small>
      </div>
    </button>

    <button class="quick-toggle active" data-setting="bluetooth">
      <span class="quick-icon">ᛒ</span>
      <div>
        <strong>Bluetooth</strong>
        <small>On</small>
      </div>
    </button>

    <button class="quick-toggle" data-setting="night">
      <span class="quick-icon">☾</span>
      <div>
        <strong>Night light</strong>
        <small>Off</small>
      </div>
    </button>

    <button class="quick-toggle" data-setting="focus">
      <span class="quick-icon">◐</span>
      <div>
        <strong>Focus</strong>
        <small>Off</small>
      </div>
    </button>

  </div>

  <div class="quick-slider">

    <span>🔊</span>

    <input
      id="volume-slider"
      type="range"
      min="0"
      max="100"
      value="75"
    >

    <span id="volume-value">75%</span>

  </div>

  <div class="quick-footer">
    <span>NaxoOS Control Center</span>
    <button id="quick-settings-button">⚙</button>
  </div>
`;

desktop.appendChild(quickSettings);


// Open panel
function toggleQuickSettings(event) {

  event.stopPropagation();

  startMenu.classList.remove("open");

  quickSettings.classList.toggle("open");
}


wifiButton.addEventListener(
  "click",
  toggleQuickSettings
);

soundButton.addEventListener(
  "click",
  toggleQuickSettings
);


// Prevent closing when clicking inside
quickSettings.addEventListener(
  "click",
  event => event.stopPropagation()
);


// Close when clicking desktop
document.addEventListener("click", () => {
  quickSettings.classList.remove("open");
});


// Toggle buttons
quickSettings
  .querySelectorAll(".quick-toggle")
  .forEach(button => {

    button.addEventListener("click", () => {

      const setting = button.dataset.setting;

      button.classList.toggle("active");

      const enabled =
        button.classList.contains("active");

      const status =
        button.querySelector("small");


      if (setting === "wifi") {

        wifiEnabled = enabled;

        status.textContent =
          enabled
            ? "Connected"
            : "Off";

        wifiButton.textContent =
          enabled
            ? "◉"
            : "○";
      }


      if (setting === "bluetooth") {

        bluetoothEnabled = enabled;

        status.textContent =
          enabled
            ? "On"
            : "Off";
      }


      if (setting === "night") {

        nightLightEnabled = enabled;

        status.textContent =
          enabled
            ? "On"
            : "Off";

        document.body.classList.toggle(
          "night-light",
          enabled
        );
      }


      if (setting === "focus") {

        status.textContent =
          enabled
            ? "On"
            : "Off";
      }

    });

  });


// Volume slider
const volumeSlider =
  document.getElementById("volume-slider");

const volumeValue =
  document.getElementById("volume-value");


volumeSlider.addEventListener("input", () => {

  volume = Number(volumeSlider.value);

  volumeValue.textContent =
    volume + "%";


  if (volume === 0) {

    soundButton.textContent = "🔇";

  } else if (volume < 50) {

    soundButton.textContent = "🔉";

  } else {

    soundButton.textContent = "🔊";

  }

});


// Open Settings from Control Center
document
  .getElementById("quick-settings-button")
  .addEventListener("click", () => {

    quickSettings.classList.remove("open");

    openApp("settings");

  });
  // ==========================================
// NAXO OS 2.0 — FILES
// ==========================================

const naxoFileSystem = {
  Home: [
    { name: "Documents", icon: "📁", type: "folder" },
    { name: "Downloads", icon: "📁", type: "folder" },
    { name: "Pictures", icon: "📁", type: "folder" },
    { name: "Music", icon: "📁", type: "folder" },
    { name: "Videos", icon: "📁", type: "folder" },
    { name: "System", icon: "💾", type: "folder" }
  ],

  Documents: [
    {
      name: "Welcome.txt",
      icon: "📄",
      type: "text",
      content:
`Welcome to NaxoOS!

Thanks for trying NaxoOS Web Edition.

This operating system runs completely
inside your browser.

Version: NaxoOS 2.0`
    },

    {
      name: "Ideas.txt",
      icon: "📝",
      type: "text",
      content:
`NaxoOS ideas

• Add more applications
• Improve the terminal
• Add notifications
• Add themes
• Make Files functional`
    }
  ],

  Downloads: [
    {
      name: "README.txt",
      icon: "📃",
      type: "text",
      content:
`Downloads

Your downloaded files would appear here.

NaxoOS Web Edition`
    },

    {
      name: "NaxoOS.zip",
      icon: "🗜️",
      type: "info",
      content: "Archive • 2.4 MB"
    }
  ],

  Pictures: [
    {
      name: "Wallpaper.png",
      icon: "🌄",
      type: "image",
      content: "NaxoOS Default Wallpaper"
    },

    {
      name: "NaxoLogo.png",
      icon: "🖼️",
      type: "image",
      content: "NaxoOS Logo"
    }
  ],

  Music: [
    {
      name: "Startup.mp3",
      icon: "🎵",
      type: "info",
      content: "Audio file • 0:04"
    },

    {
      name: "Ambient.mp3",
      icon: "🎧",
      type: "info",
      content: "Audio file • 3:42"
    }
  ],

  Videos: [
    {
      name: "Welcome.mp4",
      icon: "🎬",
      type: "info",
      content: "Video • 00:18"
    }
  ],

  System: [
    {
      name: "NaxoOS",
      icon: "💿",
      type: "info",
      content: "NaxoOS 2.0 Web Edition"
    },

    {
      name: "kernel.sys",
      icon: "⚙️",
      type: "info",
      content: "Naxo Web Kernel"
    },

    {
      name: "system.info",
      icon: "🖥️",
      type: "text",
      content:
`NaxoOS System Information

Edition: Web
Version: 2.0
Platform: Browser
Kernel: Naxo Web Kernel
Architecture: JavaScript`
    }
  ]
};


function initializeFiles(win) {

  const content =
    win.querySelector(".window-content");

  let currentFolder = "Home";

  let history = ["Home"];

  let historyIndex = 0;


  content.innerHTML = `
    <div class="files-app">

      <div class="files-toolbar">

        <button
          class="files-nav files-back"
          title="Back"
        >
          ←
        </button>

        <button
          class="files-nav files-forward"
          title="Forward"
        >
          →
        </button>

        <button
          class="files-nav files-home"
          title="Home"
        >
          ⌂
        </button>

        <div class="files-address">
          <span>💻</span>
          <span class="files-path">Home</span>
        </div>

        <input
          class="files-search"
          type="text"
          placeholder="Search"
        >

      </div>


      <div class="files-layout">

        <aside class="files-sidebar">

          <p>Quick access</p>

          <button data-folder="Home">
            🏠 Home
          </button>

          <button data-folder="Documents">
            📄 Documents
          </button>

          <button data-folder="Downloads">
            ⬇️ Downloads
          </button>

          <button data-folder="Pictures">
            🖼️ Pictures
          </button>

          <button data-folder="Music">
            🎵 Music
          </button>

          <button data-folder="Videos">
            🎬 Videos
          </button>

          <div class="files-sidebar-divider"></div>

          <p>System</p>

          <button data-folder="System">
            💾 NaxoOS
          </button>

        </aside>


        <main class="files-main">

          <div class="files-heading">

            <div>
              <h2 class="files-folder-title">
                Home
              </h2>

              <span class="files-count"></span>
            </div>

            <button
              class="files-view-button"
              title="View"
            >
              ▦
            </button>

          </div>


          <div class="files-grid-v2"></div>


          <div class="files-empty">
            No files found
          </div>

        </main>

      </div>


      <div class="files-statusbar">

        <span class="files-status">
          Ready
        </span>

        <span>NaxoFS</span>

      </div>

    </div>
  `;


  const grid =
    content.querySelector(".files-grid-v2");

  const title =
    content.querySelector(".files-folder-title");

  const path =
    content.querySelector(".files-path");

  const count =
    content.querySelector(".files-count");

  const status =
    content.querySelector(".files-status");

  const search =
    content.querySelector(".files-search");

  const empty =
    content.querySelector(".files-empty");

  const backButton =
    content.querySelector(".files-back");

  const forwardButton =
    content.querySelector(".files-forward");


  function renderFolder(folder, query = "") {

    currentFolder = folder;

    title.textContent = folder;

    path.textContent =
      folder === "Home"
        ? "Home"
        : `Home  ›  ${folder}`;


    content
      .querySelectorAll(
        ".files-sidebar button"
      )
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.folder === folder
        );

      });


    const files =
      naxoFileSystem[folder] || [];


    const filtered =
      files.filter(file =>
        file.name
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
      );


    grid.innerHTML = "";


    filtered.forEach(file => {

      const item =
        document.createElement("button");

      item.className =
        "files-item-v2";

      item.innerHTML = `
        <span class="files-item-icon">
          ${file.icon}
        </span>

        <span class="files-item-name">
          ${escapeHTML(file.name)}
        </span>

        <small>
          ${
            file.type === "folder"
              ? "File folder"
              : file.type === "text"
                ? "Text document"
                : file.type === "image"
                  ? "Image"
                  : "File"
          }
        </small>
      `;


      item.addEventListener(
        "dblclick",
        () => {

          if (file.type === "folder") {

            navigateTo(file.name);

          } else {

            openFilePreview(
              win,
              file
            );

          }

        }
      );


      item.addEventListener(
        "click",
        () => {

          grid
            .querySelectorAll(
              ".files-item-v2"
            )
            .forEach(el =>
              el.classList.remove(
                "selected"
              )
            );

          item.classList.add(
            "selected"
          );

          status.textContent =
            file.name;

        }
      );


      grid.appendChild(item);

    });


    count.textContent =
      `${filtered.length} item${
        filtered.length === 1
          ? ""
          : "s"
      }`;


    empty.style.display =
      filtered.length
        ? "none"
        : "grid";


    backButton.disabled =
      historyIndex <= 0;

    forwardButton.disabled =
      historyIndex >=
      history.length - 1;


    status.textContent =
      `${filtered.length} items`;
  }


  function navigateTo(folder) {

    if (folder === currentFolder) {
      return;
    }


    history =
      history.slice(
        0,
        historyIndex + 1
      );

    history.push(folder);

    historyIndex++;

    search.value = "";

    renderFolder(folder);
  }


  content
    .querySelectorAll(
      "[data-folder]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          navigateTo(
            button.dataset.folder
          );

        }
      );

    });


  backButton.addEventListener(
    "click",
    () => {

      if (historyIndex <= 0) {
        return;
      }

      historyIndex--;

      search.value = "";

      renderFolder(
        history[historyIndex]
      );

    }
  );


  forwardButton.addEventListener(
    "click",
    () => {

      if (
        historyIndex >=
        history.length - 1
      ) {
        return;
      }

      historyIndex++;

      search.value = "";

      renderFolder(
        history[historyIndex]
      );

    }
  );


  content
    .querySelector(".files-home")
    .addEventListener(
      "click",
      () => {

        navigateTo("Home");

      }
    );


  search.addEventListener(
    "input",
    () => {

      renderFolder(
        currentFolder,
        search.value
      );

    }
  );


  renderFolder("Home");
}



function openFilePreview(win, file) {

  const existing =
    win.querySelector(
      ".file-preview-overlay"
    );

  if (existing) {
    existing.remove();
  }


  const preview =
    document.createElement("div");

  preview.className =
    "file-preview-overlay";


  let previewContent = "";


  if (file.type === "text") {

    previewContent = `
      <pre class="file-text-preview">${
        escapeHTML(file.content)
      }</pre>
    `;

  } else if (file.type === "image") {

    previewContent = `
      <div class="file-image-preview">

        <div class="fake-image">
          <span>🌄</span>
          <strong>
            ${escapeHTML(file.content)}
          </strong>
        </div>

      </div>
    `;

  } else {

    previewContent = `
      <div class="file-info-preview">

        <span>${file.icon}</span>

        <h3>
          ${escapeHTML(file.name)}
        </h3>

        <p>
          ${escapeHTML(file.content)}
        </p>

      </div>
    `;
  }


  preview.innerHTML = `
    <div class="file-preview">

      <div class="file-preview-header">

        <div>
          <span>${file.icon}</span>
          ${escapeHTML(file.name)}
        </div>

        <button
          class="file-preview-close"
        >
          ×
        </button>

      </div>

      <div class="file-preview-content">
        ${previewContent}
      </div>

    </div>
  `;


  win
    .querySelector(".window-content")
    .appendChild(preview);


  preview
    .querySelector(
      ".file-preview-close"
    )
    .addEventListener(
      "click",
      () => preview.remove()
    );


  preview.addEventListener(
    "mousedown",
    event => {

      if (
        event.target === preview
      ) {
        preview.remove();
      }

    }
  );
}
// ==========================================
// NAXO OS 2.0 — NOTIFICATION CENTER
// ==========================================

const clockElement = document.getElementById("clock");

let naxoNotifications = [
  {
    icon: "✨",
    title: "Welcome to NaxoOS",
    message: "NaxoOS 2.0 is ready to use.",
    time: "Now"
  },
  {
    icon: "📁",
    title: "Files upgraded",
    message: "The new NaxoOS file explorer is now available.",
    time: "Now"
  },
  {
    icon: "🛡️",
    title: "System",
    message: "Your system is running normally.",
    time: "Now"
  }
];

const notificationCenter = document.createElement("section");
notificationCenter.id = "notification-center";

desktop.appendChild(notificationCenter);


function renderNotificationCenter() {

  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const fullDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  notificationCenter.innerHTML = `
    <div class="nc-header">

      <div>
        <h2>${fullDate}</h2>
        <span>NaxoOS Calendar</span>
      </div>

      <button
        id="nc-close"
        title="Close"
      >
        ×
      </button>

    </div>

    <div class="nc-calendar">

      <div class="calendar-header">
        <strong>${monthName}</strong>

        <div>
          <button
            class="calendar-nav"
            title="Previous month"
          >
            ‹
          </button>

          <button
            class="calendar-nav"
            title="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div class="calendar-weekdays">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div class="calendar-days">
        ${createCalendarDays(now)}
      </div>

    </div>

    <div class="notifications-section">

      <div class="notifications-title">

        <div>
          <strong>Notifications</strong>

          <span class="notification-count">
            ${naxoNotifications.length}
          </span>
        </div>

        ${
          naxoNotifications.length
            ? `
              <button id="clear-notifications">
                Clear all
              </button>
            `
            : ""
        }

      </div>

      <div class="notification-list">

        ${
          naxoNotifications.length
            ? naxoNotifications.map((notification, index) => `
                <article class="notification-card">

                  <div class="notification-icon">
                    ${notification.icon}
                  </div>

                  <div class="notification-content">

                    <div class="notification-top">
                      <strong>
                        ${escapeHTML(notification.title)}
                      </strong>

                      <span>
                        ${escapeHTML(notification.time)}
                      </span>
                    </div>

                    <p>
                      ${escapeHTML(notification.message)}
                    </p>

                  </div>

                  <button
                    class="notification-remove"
                    data-notification="${index}"
                    title="Dismiss"
                  >
                    ×
                  </button>

                </article>
              `).join("")
            : `
              <div class="no-notifications">
                <span>✓</span>
                <strong>You're all caught up</strong>
                <p>No new notifications.</p>
              </div>
            `
        }

      </div>

    </div>
  `;


  document
    .getElementById("nc-close")
    .addEventListener("click", () => {
      notificationCenter.classList.remove("open");
    });


  const clearButton =
    document.getElementById("clear-notifications");

  if (clearButton) {

    clearButton.addEventListener("click", () => {

      naxoNotifications = [];

      renderNotificationCenter();

    });

  }


  notificationCenter
    .querySelectorAll(".notification-remove")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.notification);

        naxoNotifications.splice(index, 1);

        renderNotificationCenter();

      });

    });
}


function createCalendarDays(date) {

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  let html = "";


  for (let i = 0; i < firstDay; i++) {
    html += `<span class="calendar-empty"></span>`;
  }


  for (let day = 1; day <= daysInMonth; day++) {

    const isToday =
      day === date.getDate();

    html += `
      <button
        class="calendar-day ${
          isToday ? "today" : ""
        }"
      >
        ${day}
      </button>
    `;
  }


  return html;
}


clockElement.addEventListener("click", event => {

  event.stopPropagation();

  startMenu.classList.remove("open");

  if (
    typeof quickSettings !== "undefined"
  ) {
    quickSettings.classList.remove("open");
  }

  renderNotificationCenter();

  notificationCenter.classList.toggle("open");

});


notificationCenter.addEventListener(
  "click",
  event => {
    event.stopPropagation();
  }
);


document.addEventListener("click", () => {
  notificationCenter.classList.remove("open");
});