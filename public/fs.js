const { exec } = require('child_process');
const path = require('path');


function isWindowFullscreen(callback) {
  const psScriptPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'public', 'script.ps1');
  exec(`powershell.exe -ExecutionPolicy Bypass -File "${psScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      throw new Error((`Error executing PowerShell script: ${error}`).toString());
    }
    if (stderr) {
      throw new Error((`PowerShell error: ${stderr}`).toString());
    }

    const output = stdout.trim().split('\n');
    const isFullscreen = output[0].toLowerCase() === 'true';
    const monitorInfo = output.length > 1 ? output[1] : 'No monitor information available';

    callback(null, { isFullscreen, monitorInfo });
  });
}

module.exports = { isWindowFullscreen };