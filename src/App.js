import React, { Component } from 'react';
import { BehaviorSubject, combineLatest } from 'rxjs';

import './App.css';
import { debounceTime } from 'rxjs/operators';

class ValueEmitter {

  value = new BehaviorSubject(1);
  type;

  constructor(_type) {
    this.emitValue();
    this.type = _type;
  }

  emit() {
    return new Promise((resolve, reject) => {
      const delay = Math.random() * 1900 + 100;
      setTimeout(() => {
        const v = Math.random() * 10;
        this.value.next(v);
        resolve();
      }, delay);
    });
  }

  async emitValue() {

    let i = 0;
    while (i < 10000000) {
      await this.emit();
      i++;
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      temperature: 0,
      airPressure: 0,
      humidity: 0,
    };
  }
  
  componentDidMount() {
    const temperature$ = new ValueEmitter('A'),
      airPressure$ = new ValueEmitter('B'),
      humidity$ = new ValueEmitter('C');
  
    combineLatest(
      temperature$.value,
      airPressure$.value,
      humidity$.value,
      (temperature, airPressure, humidity) => ({
        temperature,
        airPressure,
        humidity
      })
    ).pipe(debounceTime(101)).subscribe(values => {
      const { temperature, airPressure, humidity } = this.state;

      if (
        values.temperature !== temperature
        && values.airPressure !== airPressure
        && values.humidity !== humidity
      ) {
        this.setState({
          temperature: values.temperature,
          airPressure: values.airPressure,
          humidity: values.humidity,
        });
      }
    });
  }

  render() {
    const { temperature, humidity, airPressure } = this.state;
    return (
      <div className="App">
        <div className="display-container">
          <h2 className="title">Temperature</h2>
          <p className="value">{temperature.toFixed(2)}</p>
        </div>
        <div className="display-container">
          <h2 className="title">Humidity</h2>
          <p className="value">{humidity.toFixed(2)}</p>
        </div>
        <div className="display-container">
          <h2 className="title">Air Pressure</h2>
          <p className="value">{airPressure.toFixed(2)}</p>
        </div>
      </div>
    );
  }
}

export default App;
