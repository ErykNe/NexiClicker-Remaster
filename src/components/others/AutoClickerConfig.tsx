import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import Interpreter from './Utils/Interpreter';
import Stylizer from './Utils/Stylizer';
import './AutoClickerConfig.css';

const ipcRenderer = (window as any).ipcRenderer


interface IValue {
  HOTKEY: any;
  KEY: any;
  CPS: number;
  TAG_NUMBER: any;
}

export default function AutoClickerConfig(TAG: any) {
  const [autoClickerActive, setAutoClickerActive] = useState(false);
  const [formValues, setFormValues] = useState<IValue>({
    HOTKEY: undefined,
    KEY: undefined,
    CPS: 0,
    TAG_NUMBER: TAG.TAG //xd
  });
  const tagNumId = TAG.TAG.toString();

  const setHotkey = () => {
    window.addEventListener('keydown', handleHotkeyDown);
    window.addEventListener('mousedown', handleHotkeyDown);
  };

  const handleHotkeyDown = (event: KeyboardEvent | MouseEvent) => {
    let interpreter = new Interpreter(event);
    setFormValues(prevValues => ({
      ...prevValues,
      HOTKEY: interpreter.getInterpretedKey()
    }));
    let stylizer = new Stylizer(event);
    let button = document.getElementById("HOTKEY" + tagNumId);
    if(button){
      button.innerHTML = stylizer.getText();
    }
    window.removeEventListener('keydown', handleHotkeyDown);
    window.removeEventListener('mousedown', handleHotkeyDown);
  };

  const setKey = () => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleKeyDown);
  };

  const handleKeyDown = (event: KeyboardEvent | MouseEvent) => {
    let interpreter = new Interpreter(event)
    setFormValues(prevValues => ({
      ...prevValues,
      KEY: interpreter.getInterpretedKey()
    }));
    let stylizer = new Stylizer(event);
    let button = document.getElementById("KEY" + tagNumId);
    if(button){
      button.innerHTML = stylizer.getText();
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleKeyDown);
  };

  const setCPSAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    let button = document.getElementById("CPSLabel" + tagNumId);
    if(button){
      button.innerHTML = event.target.value;
    }
    setFormValues(prevValues => ({
      ...prevValues,
      CPS: parseInt(event.target.value)
    }));
  };

  const handleSubmit = (values: IValue) => {
    values = formValues; // Destructure formValues
    console.log("Submitted values:", values);
    ipcRenderer.send('submit::autoclicker', values); // Send formValues to main process
    setAutoClickerActive(true);
  };

  const handleShutdown = () => {
    setAutoClickerActive(false);
    ipcRenderer.send('autoclicker::shutdown', formValues);
  }

  return (
    <div>
      <Formik initialValues={formValues} onSubmit={handleSubmit}>
        <Form className='ClickerConfig'>
          <div className="buttons">
            <div className="btn-group">
              <button type="button" className="btn btn-primary" name="HOTKEY" id={"HOTKEY" + tagNumId} onClick={setHotkey}>HOTKEY</button>
              <button type="button" className="btn btn-primary" name="KEY" id={"KEY" + tagNumId} onClick={setKey}>BIND</button>
            </div>
            {!autoClickerActive && (
              <button type="submit" className='btn btn-primary startbutton' name="StartButton" id="StartAutoClickerButton">START</button>
            )}
            {autoClickerActive && (
              <button type="button" className='btn btn-primary startbutton' name="StopButton" id="StopAutoClickerButton" onMouseDown={e => handleShutdown()}>STOP</button>
            )}
          </div>
          <div className="slider">
            <p className="CPSCounter" id={"CPSLabel" + tagNumId}>CPS</p>
            <input type="range" name="CPS" defaultValue="0" min="0" max="100" step="1" id={"CPS" + tagNumId} onChange={setCPSAmount} />
          </div>
        </Form>
      </Formik>
    </div>
  );
}