const { exec } = require('child_process');
const path = require('path');

function isWindowFullscreen(callback) {
  const psScriptPath = path.join(__dirname, 'script.ps1');
  exec(`powershell.exe -File "${psScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing PowerShell script: ${error}`);
      callback(error, null);
      return;
    }
    if (stderr) {
      console.error(`PowerShell error: ${stderr}`);
      callback(new Error(stderr), null);
      return;
    }

    // Parsing the output
    const output = stdout.trim().split('\n');
    const isFullscreen = output[0].toLowerCase() === 'true';
    const monitorInfo = output.length > 1 ? output[1] : 'No monitor information available';

    callback(null, { isFullscreen, monitorInfo });
  });
}

module.exports = { isWindowFullscreen };