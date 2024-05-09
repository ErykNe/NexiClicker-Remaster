import React, { Component } from 'react';
import _ from 'lodash';
import AutoClickerConfig from './AutoClickerConfig';
import './NexiClickerApp.css';

export default function NexiClickerApp(){
    let clickers: React.JSX.Element[] = [];
    _.times(2, (index) => {
        clickers.push(<AutoClickerConfig TAG={index}></AutoClickerConfig>);
    });
    let ClickerSettingButtons: React.JSX.Element[] = 
    [
        <button className="btn btn-primary" name="SaveSettings" onClick={e => saveSettings()}>SAVE</button>,
        <button className="btn btn-primary" name="LoadSettings" onClick={e => loadSettings()}>LOAD</button>,
        <button className="btn btn-primary" name="ResetSettings" onClick={e => resetSettings()}>RESET</button> ,
        <button className="btn btn-primary" name="ResetSettings" onClick={e => exit()}>EXIT</button> 
    ]
    let AppSettingButtons: React.JSX.Element[] = 
    [
        <button className="btn btn-primary btn-transparent" name="FSOverlay" onClick={e => enableFullScreenOverlay()}>FS OVERLAY</button>,
        <button className="btn btn-primary btn-transparent" name="Notify" onClick={e => enableNotifications()}>NOTIFICATIONS</button>
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
export function saveSettings(){
    
}
export function loadSettings(){

}
export function resetSettings(){

}
export function enableFullScreenOverlay() {
    const btn = document.querySelector('[name="FSOverlay"]');
    if(btn && !(btn.classList.contains("btn-transparent-activated"))){
        btn.classList.remove("btn-transparent");
        btn.classList.add("btn-transparent-activated");
    } else if (btn){
        btn.classList.add("btn-transparent");
        btn.classList.remove("btn-transparent-activated");
    }
}   
export function enableNotifications(){
    const btn = document.querySelector('[name="Notify"]');
    if(btn && !(btn.classList.contains("btn-transparent-activated"))){
        btn.classList.remove("btn-transparent");
        btn.classList.add("btn-transparent-activated");
    } else if (btn){
        btn.classList.add("btn-transparent");
        btn.classList.remove("btn-transparent-activated");
    }
}
export function exit(){

}