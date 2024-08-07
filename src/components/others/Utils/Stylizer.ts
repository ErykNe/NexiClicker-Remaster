export default class Stylizer{
    private event: KeyboardEvent | MouseEvent | React.ChangeEvent<HTMLInputElement>;

    constructor(event: KeyboardEvent | MouseEvent | React.ChangeEvent<HTMLInputElement>){
        this.event = event;
    }

    public getButtonText(){
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
        } else {
            return "";
        }
        return text;
    }
    public getSliderText(){
        let text = "";
        if(!(this.event instanceof KeyboardEvent) && !(this.event instanceof MouseEvent)){
            if(this.event.target.value.length == 1){
                text = "⠀⠀" + this.event.target.value + " CPS" + "⠀";
              }
              if(this.event.target.value.length == 2){
                text = "⠀" + this.event.target.value + " CPS" + "⠀";
              }
              if(this.event.target.value.length == 3){
                text = this.event.target.value + " CPS" + "⠀";
              }
        } else {
            return "";
        }
        return text;
    }

    public updateSliderBackground(slider: any, value: number){
        if(slider){
            slider.style.background = 'linear-gradient(to right, #007BFF 0%, #007BFF ' + (value / 85) * 100 + '%, #fff ' + (value / 85) * 100 + '%, white 100%)'
        }
    }
    public updateAppSettingsButton(buttonName: string){
      const btn = document.querySelector('[name="' + buttonName + '"]');
      if(btn && !(btn.classList.contains("btn-transparent-activated"))){
        btn.classList.remove("btn-transparent");
        btn.classList.add("btn-transparent-activated");
      } else if (btn){
        btn.classList.add("btn-transparent");
        btn.classList.remove("btn-transparent-activated");
      }
    }

}