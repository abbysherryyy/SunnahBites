const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Load the homepage
  mainWindow.loadFile('renderer/index.html');

  // Handle meal plan file operations
  ipcMain.handle('load-meal-plan', async () => {
    try {
      const dataFile = path.join(__dirname, 'data', 'mealplan.json');
      
      if (!fs.existsSync(dataFile)) {
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir);
        }
        // Create empty mealplan.json
        fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
        return {};
      }
      
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading meal plan:', error);
      return {};
    }
  });

  ipcMain.handle('save-meal-plan', async (event, mealPlan) => {
    try {
      const dataFile = path.join(__dirname, 'data', 'mealplan.json');
      const dataDir = path.join(__dirname, 'data');
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      fs.writeFileSync(dataFile, JSON.stringify(mealPlan, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Error saving meal plan:', error);
      return { success: false, error: error.message };
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});