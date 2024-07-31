import React, { useEffect, useState } from 'react';
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
interface JSValue {
  HOTKEY: any;
  HOTKEY_ID: any;
  KEY: any;
  KEY_ID: any;
  CPS: number;
  TAG_NUMBER: any;
}

export default function AutoClickerConfig(TAG: any) {
  const [autoClickerActive, setAutoClickerActive] = useState(false);
  const [formValues, setFormValues] = useState<IValue>({
    HOTKEY: undefined,
    KEY: undefined,
    CPS: 0,
    TAG_NUMBER: TAG.TAG 
  });
  const tagNumId = TAG.TAG.toString();
  useEffect(() => {
    var temp : JSValue = {
      HOTKEY: undefined,
      KEY: undefined,
      CPS: formValues.CPS,
      TAG_NUMBER: TAG.TAG,
      HOTKEY_ID: formValues.HOTKEY,
      KEY_ID: formValues.KEY
    }
    let button = document.getElementById("HOTKEY" + tagNumId);
    if(button?.innerHTML != "HOTKEY"){
      temp.HOTKEY = button?.innerHTML
    }
    let button2 = document.getElementById("KEY" + tagNumId);
    if(button2?.innerHTML != "BIND"){
      temp.KEY = button2?.innerHTML
    }
    ipcRenderer.send('update::autoclicker_data', temp);
  }, [formValues]);

  useEffect(()=>{
    ipcRenderer.on('autoclicker::send_settings', (event:any, args:any) => {
      setFormValues(prevValues => ({
        ...prevValues,
        HOTKEY: args[TAG.TAG].HOTKEY_ID,
        KEY: args[TAG.TAG].KEY_ID,
        CPS: args[TAG.TAG].CPS,
      }));
      let HotkeyButton = document.getElementById("HOTKEY" + tagNumId);
      if(HotkeyButton){
        if(args[TAG.TAG].HOTKEY == "undefined" || args[TAG.TAG].HOTKEY == undefined){
          HotkeyButton.innerHTML = "HOTKEY"
        } else {
        HotkeyButton.innerHTML = args[TAG.TAG].HOTKEY;
        }
      }
      let KeyButton = document.getElementById("KEY" + tagNumId);
      if(KeyButton){
        KeyButton.innerHTML = args[TAG.TAG].KEY;
        if(args[TAG.TAG].KEY == "undefined" || args[TAG.TAG].KEY == undefined){
          KeyButton.innerHTML = "BIND";
        } else {
          KeyButton.innerHTML = args[TAG.TAG].KEY;
        }
      }
      const slider = document.getElementById("CPS" + tagNumId) as HTMLInputElement;
    if (slider) {
        slider.value = args[TAG.TAG].CPS.toString();
        slider.style.background = 'linear-gradient(to right, #007BFF 0%, #007BFF ' + (args[TAG.TAG].CPS / 85) * 100 + '%, #fff ' + (args[TAG.TAG].CPS / 85) * 100 + '%, white 100%)'

        const label = document.getElementById("CPSLabel" + tagNumId);
        if (label) {
            if(args[TAG.TAG].CPS < 10){
              label.innerHTML = `⠀⠀${args[TAG.TAG].CPS} CPS⠀`;
            } else if (args[TAG.TAG].CPS < 100) {
            label.innerHTML = `⠀${args[TAG.TAG].CPS} CPS⠀`;
            } else {
              label.innerHTML = `${args[TAG.TAG].CPS} CPS⠀`;
            }
        }
    }
    })
  }, [])
  
  

  const setHotkey = () => {
    window.addEventListener('keydown', handleHotkeyDown);
    window.addEventListener('mousedown', handleHotkeyDown);
  };

  const handleHotkeyDown = (event: KeyboardEvent | MouseEvent) => {
    let interpreter = new Interpreter(event);
    setFormValues(prevValues => ({
      ...prevValues,
      HOTKEY: interpreter.getInterpretedHotkey()
    }));
    let stylizer = new Stylizer(event);
    let button = document.getElementById("HOTKEY" + tagNumId);
    if(button){
      button.innerHTML = stylizer.getButtonText();
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
      button.innerHTML = stylizer.getButtonText();
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleKeyDown);
  };

  const setCPSAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    let button = document.getElementById("CPSLabel" + tagNumId);
    let stylizer = new Stylizer(event);
    if(button){
      button.innerHTML = stylizer.getSliderText();
    }
    setFormValues(prevValues => ({
      ...prevValues,
      CPS: parseInt(event.target.value)
    }));
    let slider = document.getElementById("CPS" + tagNumId)
    stylizer.updateSliderBackground(slider, parseInt(event.target.value))
  };

  const handleSubmit = (values: IValue) => {
    values = formValues; 
    if (values.CPS == 0){
      return;
    } else if (values.HOTKEY == undefined){
      return;
    } else if (values.KEY == undefined) {
      return;
    } else if (values.TAG_NUMBER == undefined){
      return;
    }
    ipcRenderer.send('submit::autoclicker', values); 
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
            <p className="CPSLabel" id={"CPSLabel" + tagNumId}>⠀⠀0 CPS⠀</p>
            <input type="range" name="CPS" defaultValue="0" min="0" max="85" step="1" id={"CPS" + tagNumId} onChange={setCPSAmount} />
          </div>
        </Form>
      </Formik>
    </div>
  );
}