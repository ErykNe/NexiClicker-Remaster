import React, { Component } from 'react';
import _ from 'lodash';
import AutoClickerConfig from './AutoClickerConfig';
import './NexiClickerApp.css';
import Stylizer from './Utils/Stylizer';

const ipcRenderer = (window as any).ipcRenderer;

export default function NexiClickerApp(){
    let clickers: React.JSX.Element[] = [];
    _.times(2, (index) => {
        clickers.push(<AutoClickerConfig TAG={index}></AutoClickerConfig>);
    });
    function saveSettings(){
        ipcRenderer.send('autoclicker::save_settings')
    }
    function loadSettings(){
        ipcRenderer.send('autoclicker::load_settings')
    }

    let ClickerSettingButtons: React.JSX.Element[] = 
    [
        <button className="btn btn-primary" name="SaveSettings" onClick={e => saveSettings()}>SAVE</button>,
        <button className="btn btn-primary" name="LoadSettings" onClick={e => loadSettings()}>LOAD</button>,
        <button className="btn btn-primary" name="ResetSettings" onClick={e => resetSettings()}>RESET</button> ,
        <button className="btn btn-primary" name="ResetSettings" onClick={e => exit()}>EXIT</button> 
    ]
    let AppSettingButtons: React.JSX.Element[] = 
    [
        <button className="btn btn-primary btn-transparent" name="FSOverlay" onClick={e => enableFullScreenOverlay(e)}>FS OVERLAY</button>
    ]
    return (
    <div className='App'>
        <div className='Clickers'>
            {clickers}
        </div>
        <div className='Settings'>
            <div className="btns btn-group">
                {ClickerSettingButtons}
            </div>
        </div>
        <div className='App-settings'>
            <div className='btnr btn-group'>
                {AppSettingButtons}
            </div>
        </div>
    </div>
    );
}
export function resetSettings(){

}
export function enableFullScreenOverlay(event: any) {
    let stylizer = new Stylizer(event)
    stylizer.updateAppSettingsButton("FSOverlay");
    let btn = document.querySelector('[name="FSOverlay"]');
    let bool = btn && btn.classList.contains("btn-transparent-activated") ? true : false;
    ipcRenderer.send('settings::fullscreen', bool);
}   
export function exit(){

}