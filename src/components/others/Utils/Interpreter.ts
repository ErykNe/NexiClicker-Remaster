export default class Interpreter{
    private UninterpretedEvent: KeyboardEvent | MouseEvent;

    constructor(UninterpretedEvent: KeyboardEvent | MouseEvent){
        this.UninterpretedEvent = UninterpretedEvent;
    }

    public getInterpretedKey(){
        let InterpretedKey = 0;
        if(this.UninterpretedEvent instanceof KeyboardEvent){
            switch(this.UninterpretedEvent.keyCode){
                case 16:
                    if(this.UninterpretedEvent.code == "ShiftLeft"){
                        InterpretedKey = 160;
                    } else {
                        InterpretedKey = 161;
                    }
                    break;
                case 18:
                    InterpretedKey = 164;   
                    break;
                case 17:
                    if(this.UninterpretedEvent.code == "AltRight"){
                        InterpretedKey = 165;  
                    } else if(this.UninterpretedEvent.code == "ControlRight"){
                        InterpretedKey = 163;
                    } else if(this.UninterpretedEvent.code == "ControlLeft"){
                        InterpretedKey = 162;
                    }
                    break;    
                default:
                    InterpretedKey = this.UninterpretedEvent.keyCode       
            }
            return InterpretedKey;
        } else if(this.UninterpretedEvent instanceof MouseEvent){
            switch(this.UninterpretedEvent.button){
                case 0:
                  InterpretedKey = 1;
                  break;
                case 1:
                  InterpretedKey = 3;
                  break;
                case 2:
                  InterpretedKey = 2;
                  break;
                case 3:      
                  InterpretedKey = 4;
                  break;
                case 4:
                  InterpretedKey = 5;
                  break;  
              }
              return InterpretedKey;
        }
    }
    public getInterpretedHotkey(){
        if(this.UninterpretedEvent instanceof KeyboardEvent){
            return this.UninterpretedEvent.key.toLowerCase();
        } else if(this.UninterpretedEvent instanceof MouseEvent){
            let InterpretedKey = "";
            switch(this.UninterpretedEvent.button){
                case 0:
                  InterpretedKey = "left";
                  break;
                case 1:
                  InterpretedKey = "middle";
                  break;
                case 2:
                  InterpretedKey = "right";
                  break;
                default:
                  InterpretedKey = "err";
                  break;
              }
              return InterpretedKey;
        }
    }
}