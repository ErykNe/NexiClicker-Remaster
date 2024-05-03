import React, { useState } from 'react';
import './AutoClickerConfig.css';
import AutoClicker from './AutoClicker';

export let HOTKEY: any;
export let KEY: any;
export let CPS: number;
export let AC: AutoClicker;

export default function AutoClickerConfig(){
    const [autoClickerActive, setAutoClickerActive] = useState(false);

    const startAutoClicker = () => {
      setAutoClickerActive(true); //here ended
      console.log(HOTKEY, KEY, CPS);
      AC = new AutoClicker(HOTKEY, KEY, CPS);
      AC.execute();
    };

    const stopAutoClicker = () => {
      setAutoClickerActive(false);
    };

    const setHotkey = () => {
      window.addEventListener('keydown', handleHotkeyDown);
      window.addEventListener('mousedown', handleHotkeyDown);
    };
    const handleHotkeyDown = (event: KeyboardEvent | MouseEvent) => {
      HOTKEY = event instanceof KeyboardEvent ? event.key : event.button
      console.log(HOTKEY)
      window.removeEventListener('keydown', handleHotkeyDown);
      window.removeEventListener('mousedown', handleHotkeyDown);
    };



    const setKey = () => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('mousedown', handleKeyDown);
    };
    const handleKeyDown = (event: KeyboardEvent | MouseEvent) => {
      KEY = event instanceof KeyboardEvent ? event.key : event.button
      console.log(KEY);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleKeyDown);
    };

    const setCPSAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
      CPS = parseInt(event.target.value); 
      console.log(CPS)
    };

    return (
    <div className='ClickerConfig'>
      <div className="buttons">
        <div className="btn-group">
          <button className="btn btn-primary" name="Hotkey" id="HotkeyButton" onClickCapture={setHotkey}>HOTKEY</button>
          <button className="btn btn-primary" name="Bind" onClickCapture={setKey}>BIND</button> 
        </div>
        {!autoClickerActive && (
            <button className='btn btn-primary startbutton' name="StartButton" onMouseDown={startAutoClicker}>START</button>
        )}
        {autoClickerActive && (
            <button className='btn btn-primary startbutton' name="StopButton" onMouseDown={stopAutoClicker}>STOP</button>
        )}
      </div>
      <div className="slider">
        <input type="range" min="0" max="100" defaultValue="0" step="1" onChange={setCPSAmount}></input>
      </div>
    </div>
    );
}