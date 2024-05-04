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
        AutoClickerExecutable(this.HOTKEY, this.KEY, this.CPS)
    }
}
function AutoClickerExecutable(HOTKEY: any, KEY: any, CPS: any){

}