import React from 'react';
import ReactDOM from 'react-dom';
import { Karaoke as TestComponent } from '../src/index';
const lyrics = require('./assets/test.json');
const musicURL = require('./assets/test.mp3').default;

ReactDOM.render(
  <div
    style={{
      width: 400,
      height: 500
    }}
  >
    <TestComponent
      lyrics={lyrics}
      musicURL={musicURL}
    />
  </div>,
  document.getElementById('app')
);
