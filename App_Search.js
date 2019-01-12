import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import "react-datepicker/dist/react-datepicker.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectedDepartDate: '',
      selectedReturnDate: '',
      startDate: new Date(),
      currentDate: new Date(),
      depart:'',
      arrival:''

    };

    //this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDepartDateChange = this.handleDepartDateChange.bind(this);
    this.handleReturnDateChange = this.handleReturnDateChange.bind(this);
    this.handleDepartChange = this.handleDepartChange.bind(this);
    this.handleArrivalChange = this.handleArrivalChange.bind(this);
    //this.handleChangeRaw = this.handleChangeRaw.bind(this);
    
  }

  //handleChange(event) {
  // this.setState({ value: event.target.value });
  //}
  //handleChangeRaw = (date) => {
   // console.log(date);
  //  let s=document.getElementById("departDate")
   // s.value =moment(this.props.input.value).format("DD/MM/YYYY");
  //}
  
  handleDepartChange(evt) {
    this.setState({
      depart: evt.target.value
    });
  }
  handleArrivalChange(evt) {
    this.setState({
      arrival: evt.target.value
    });
  }
  handleDepartDateChange(date) {
    this.setState({
      selectedDepartDate: date
    });
  }
  handleReturnDateChange(date) {
    this.setState({
      selectedReturnDate: date
    });
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state);
    //event.preventDefault();
   // const form = event.target;
    //const data = new FormData(form);
    //console.log(data);


    const SeachReq={
      depart:this.state.depart,
      arrival:this.state.arrival,
      departdate:this.state.departdate,
      arrivaldate:this.state.arrivaldate,
      pax:1
    }
    alert(SeachReq.depart+SeachReq.arrival+SeachReq.arrivaldate+SeachReq.departdate);
    
    //axios.post('/api/users/register',newUser)
    //.then(res=> console.log(res.data))
    //.catch(err=>console.log(err.response.data));
    //}

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="flight-engine"></div>
        
        <div className="container">
          <div className="tabing">
             <ul>
              <li>
                <a className="active" href="#1">
                <img id="ctl00_IBEHeader_NEW_EK_LOGO" alt="Emirates" src="https://fly4.ek.aero/english/images/Inline_Logo_global_tcm233-4096794.svg"></img>
                <i className="fa fa-plane ml-2" aria-hidden="true">
                </i> Flight Search</a>
              </li>
            </ul>
            <div className="tab-content">
              <div id="1" className="tab1 active">
                <div className="flight-tab row">
                  <div className="persent-one">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <input type="text" onChange={this.handleDepartChange} name="depart" required className="form-input textboxstyle" id="depart" placeholder="From City or airport" />
                  </div>
                  <div className="persent-one">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <input type="text" onChange={this.handleArrivalChange} name="arrival" required className="form-input textboxstyle" id="arival" placeholder="To City or airport" />
                  </div>
                  <div className="persent-one less-per">
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                     <DatePicker placeholderText="Depart Date" className="form-input textboxstyle" id="departDate"
                      minDate={this.state.currentDate}
                      onChange={this.handleDepartDateChange}                      
                      selected={this.state.selectedDepartDate}  
                      required     
                      //onChangeRaw={(e)=>this.handleChangeRaw(e)}    
                                
                                                              
                    />
                  </div>
                  <div className="persent-one less-per">
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    <DatePicker placeholderText="Return Date" className="form-input textboxstyle" id="arrivalDate"
                      minDate={this.state.currentDate}
                      onChange={this.handleReturnDateChange}                      
                      selected={this.state.selectedReturnDate}  
                      required     
                      //onChangeRaw={(e)=>this.handleChangeRaw(e)}    
                                   
                                                             
                    />
                  </div>
                  <div className="persent-one">
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <div className="textboxstyle" id="passenger">01 Passenger</div>
                  </div>
                  <div className="persent-one less-btn">
                    <input type="Submit" name="submit" value="Search" className="btn btn-info cst-btn" id="srch" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default App;