import React, { useState } from 'react';

export default class AutoClicker {
    public HOTKEY: any;
    public KEY: any;
    public CPS: number;
    constructor(HOTKEY: any, KEY: any, CPS: number){
        this.HOTKEY = HOTKEY;
        this.KEY = KEY;
        this.CPS = CPS;
    }
    
    public execute() {
        //Config RobotJS and IoHook or other libraries required to Listen keys globally and executing them afterwards
    }
}
