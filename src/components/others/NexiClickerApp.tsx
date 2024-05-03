import React, { Component } from 'react';
import _ from 'lodash';
import AutoClickerConfig from './AutoClickerConfig';
import './NexiClickerApp.css';

export default function NexiClickerApp(){
    let clickers: React.JSX.Element[] = [];
    _.times(2, () => {
        clickers.push(<AutoClickerConfig></AutoClickerConfig>);
    });
    let buttons: React.JSX.Element[] = 
    [
        <button className="btn btn-primary" name="SaveSettings" onClick={e => saveSettings()}>SAVE</button>,
        <button className="btn btn-primary" name="LoadSettings" onClick={e => loadSettings()}>LOAD</button>,
        <button className="btn btn-primary" name="ResetSettings" onClick={e => resetSettings()}>RESET</button> ,
        <button className="btn btn-primary" name="ResetSettings" onClick={e => exit()}>EXIT</button> 
    ]
    return (
    <div className='App'>
        <div className='Clickers'>
            {clickers}
        </div>
        <div className='Settings'>
            <div className="btns btn-group">
                {buttons}
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
export function exit(){

}