import React from 'react';
import './App.css';
import RangeSliderTwoPoint from './components/RangeSliderTwoPoint';

const onChange = (value) => {
  // console.log('App >> onchange', value)
}

function App() {



  return (
    <div className="App">
      <header className="App-header">
        <RangeSliderTwoPoint
          range // có range hay không?
          defaultValue={[20, 60]}
          min={1}
          max={20}
          onChange={onChange}
          value={30}
          step={0.01}
        />
      </header>
    </div>
  );
}

export default App;
