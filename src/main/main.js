const {app, BrowserWindow, Tray, Menu, globalShortcut} = require('electron');
const path = require('path');
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;
let tray;
// Electron 会在初始化后并准备
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus();
            win.show();
        }
    });

    // 创建浏览器窗口时，调用这个函数。
    // 部分 API 在 ready 事件触发后才能使用。
    app.on('ready', () => {
        createWindows();
        loadDocument();
        createGlobalShortcut();
        createTray();
    });
} else {
    app.quit();
}

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

function createWindows() {
// 创建浏览器窗口。
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        opacity: 0.9,
        autoHideMenuBar: true,
        titleBarStyle: "hidden",
        icon: "uninstallerIcon.ico",
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.on("minimize", () => {
        win.hide();
    });
}

function loadDocument() {
    win.loadURL("https://translate.google.cn/");
}

function createTray() {
    tray = new Tray(path.join(__static, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {label: '退出', type: 'normal', role: 'quit'},
    ]);
    tray.setToolTip('DXGoogleTranslate');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        win.show();
    })
}

function createGlobalShortcut() {
    globalShortcut.register('Control+Shift+Alt+T', () => {
        console.log(win.isMinimizable())
        if (win.isFocused()) {
            win.hide();
        } else {
            win.show();
        }
    })
}
