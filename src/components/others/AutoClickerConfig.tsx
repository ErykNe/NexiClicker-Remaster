import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
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

  const setHotkey = () => {
    window.addEventListener('keydown', handleHotkeyDown);
    window.addEventListener('mousedown', handleHotkeyDown);
  };

  const handleHotkeyDown = (event: KeyboardEvent | MouseEvent) => {
    console.log(event)
    setFormValues(prevValues => ({
      ...prevValues,
      HOTKEY: event instanceof KeyboardEvent ? event.keyCode : event.button
    }));
    window.removeEventListener('keydown', handleHotkeyDown);
    window.removeEventListener('mousedown', handleHotkeyDown);
  };

  const setKey = () => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleKeyDown);
  };

  const handleKeyDown = (event: KeyboardEvent | MouseEvent) => {
    setFormValues(prevValues => ({
      ...prevValues,
      KEY: event instanceof KeyboardEvent ? event.keyCode : event.button
    }));
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleKeyDown);
  };

  const setCPSAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
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
              <button type="button" className="btn btn-primary" name="HOTKEY" id="HOTKEY" onClick={setHotkey}>HOTKEY</button>
              <button type="button" className="btn btn-primary" name="KEY" id="KEY" onClick={setKey}>BIND</button>
            </div>
            {!autoClickerActive && (
              <button type="submit" className='btn btn-primary startbutton' name="StartButton" id="StartAutoClickerButton">START</button>
            )}
            {autoClickerActive && (
              <button type="button" className='btn btn-primary startbutton' name="StopButton" id="StopAutoClickerButton" onMouseDown={e => handleShutdown()}>STOP</button>
            )}
          </div>
          <div className="slider">
            <input type="range" name="CPS" defaultValue="0" min="0" max="100" step="1" id="CPS" onChange={setCPSAmount} />
          </div>
        </Form>
      </Formik>
    </div>
  );
}