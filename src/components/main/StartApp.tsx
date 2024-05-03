import NexiClickerApp from '../others/NexiClickerApp.tsx';
import './StartApp.css';

const StartApp = () => {
  return (
    <>
    <main>
        <img src={require("../../resources/images/header.png")}></img>
    </main>
    <div>
      <NexiClickerApp></NexiClickerApp>
    </div>
    </>
  );
};

export default StartApp;