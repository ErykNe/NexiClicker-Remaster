import NexiClickerApp from '../others/NexiClickerApp';
import './StartApp.css';

const StartApp = () => {
  return (
    <>
    <main>
        <img src={require("../../resources/images/header.png")}></img>
    </main>
    <div className='app'>
      <NexiClickerApp></NexiClickerApp>
    </div>
    </>
  );
};

export default StartApp;