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