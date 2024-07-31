const { ipcRenderer } = require('electron');

function getValueOrDefault(value, defaultValue = "n/d") {
    return value !== undefined ? value : defaultValue;
}

ipcRenderer.on('overlay::data', (event, data) => {
    const processedData = data.map(item => ({
        HOTKEY: getValueOrDefault(item.HOTKEY),
        KEY: getValueOrDefault(item.KEY),
        CPS: getValueOrDefault(item.CPS)
    }));

    document.getElementById("para1").innerHTML = `1. ${processedData[0].HOTKEY}, ${processedData[0].KEY}, ${processedData[0].CPS}`;
    document.getElementById("para2").innerHTML = `2. ${processedData[1].HOTKEY}, ${processedData[1].KEY}, ${processedData[1].CPS}`;
});

ipcRenderer.on('overlay::data_enabled_change', (event, data) =>{
    id = data[0] + 1;
    document.getElementById("en" + id).innerHTML = data[1] ? "enabled" : "disabled";
})

ipcRenderer.on('overlay::autoclicker_enabled_change', (event, data) => {
    document.getElementById("ac1").innerHTML = data[0] ? "active" : "inactive";
    document.getElementById("ac1").className = (data[0] ? "active" : "inactive");
    document.getElementById("ac2").innerHTML = data[1] ? "active" : "inactive";
    document.getElementById("ac2").className = (data[1] ? "active" : "inactive");
})