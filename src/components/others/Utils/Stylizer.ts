export default class Stylizer{
    private event: KeyboardEvent | MouseEvent;

    constructor(event: KeyboardEvent | MouseEvent){
        this.event = event;
    }

    public getText(){
        let text = "";
        if(this.event instanceof KeyboardEvent){
            text = this.event.key.toString().toUpperCase()
        } else if(this.event instanceof MouseEvent){
            switch(this.event.button){
                case 0:
                  text = "LMB";
                  break;
                case 1:
                  text = "SCROLL";
                  break;
                case 2:
                  text = "RMB";
                  break;
                case 3:      
                  text = "RSMB";
                  break;
                case 4:
                  text = "LSMB";
                  break;  
                default:
                  text = "OTHER";  
                  break;
            }
        }
        return text;
    }

}