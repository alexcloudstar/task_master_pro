import './Loader.css';

const Loader = () => (
  <div className='pong relative w-24 h-24' data-testid='loader'>
    <div className='absolute w-1/12 h-1/12 bg-sky-600 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-play'></div>
    <div className='absolute w-1/12 h-3/12 bg-sky-600 top-1/2 animate-moveOne'></div>
    <div className='absolute w-1/12 h-3/12 bg-sky-600 top-1/2 right-0 animate-moveTwo'></div>
  </div>
);

export default Loader;
