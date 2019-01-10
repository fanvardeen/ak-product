import React, { Component } from 'react';
import Calendar from 'react-calendar';

class App extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
            calShown: false,
            Currentdate: new Date()
        }
    }
    // handleChange(value) {
    //console.log(value); // this will be a moment date object
    // now you can put this value into state
    // this.setState({inputValue: value});
    // }

    FormatDate(selecteddate) {
        console.log(selecteddate);
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        var Date = selecteddate.toLocaleDateString('en-GB', options);
        return Date;
    }
    ShowCal() {
        this.setState({
            calShown: true
        });
        console.log(this.state.calShown);
    }
    HideCal() {
        this.setState({
            calShown: false
        });
        console.log(this.state.calShown);
    }
    onChange = date => this.setState({ date });

    render() {
        return (
            <form className="form-horizontal">
             <div className="form-group">
                <div>
                    <input type="text" className="form-input" placeholder="Departure airport" name="txtDepart" />
                    <input type="text" className="form-input" placeholder="Arrival airport" name="txtArrival" />
                </div>
                <div>
                    <input type="text" value={this.FormatDate(this.state.date)} onFocus={this.ShowCal.bind(this)} className="form-input" name="txtDepartcalendar" />
                    
                    <input type="text" value={this.FormatDate(this.state.date)} className="form-input" name="txtArrcalendar" />
                    <div>
                        <Calendar className={'show-' + this.state.calShown}
                            onChange={this.onChange}
                            value={this.state.date}
                            minDate={this.state.Currentdate}
                            showNeighboringMonth={true}                            
                        />
                    </div>
                </div>
              </div>
            </form>
        );
    }
}
export default App;
