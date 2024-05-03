import React, { useState } from 'react';
import './AutoClickerConfig.css';

export let AutoClickerActive = false;
export let HOTKEY: React.KeyboardEvent | React.MouseEvent;
export let KEY: React.KeyboardEvent;
export let CPS: number;

export default function AutoClickerConfig(){
    const [autoClickerActive, setAutoClickerActive] = useState(false);

    const startAutoClicker = () => {
      setAutoClickerActive(true); //here ended
      console.log("gowno");
    };

    const stopAutoClicker = () => {
      setAutoClickerActive(false);
      console.log("gowno");
    };

    const setCPSAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
      CPS = parseInt(event.target.value); 
      console.log(CPS)
    };

    return (
    <div className='ClickerConfig'>
      <div className="buttons">
        <div className="btn-group">
          <button className="btn btn-primary" name="Hotkey">HOTKEY</button>
          <button className="btn btn-primary" name="Bind">BIND</button> 
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