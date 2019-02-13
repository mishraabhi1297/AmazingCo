import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './App.css';

class App extends Component {
  constructor(){
		super();

		this.state = {
      value: [0, 0, 0, 0],
			products: []
    }
  }

  componentDidMount(){
    axios.get('/app')
    	.then(res => {
        console.log(res);
        this.setState({ 
          products: res.data
        });
			})
		.catch((error) => {
			console.log(error);
		});
  }

  handleChangeIncrement(e, i){
    console.log(e);
    var values = this.state.value;
    values[e] = this.state.value[e]+1;
    this.setState({ value: values });
  }

  handleChangeDecrement(e, i){
    if(this.state.value[e] > 0)
    {
      var values = this.state.value;
      values[e] = this.state.value[e]-1;
      this.setState({ value: values });
    }
  }
  
  render() {
    return (
      <div className="container">
        <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Event</th>
                <th>Cost</th>
                <th></th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { this.state.products.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.cost}</td>
                  <td><Button className="btn-danger" onClick={this.handleChangeDecrement.bind(this, item.id)}><span className="glyphicon glyphicon-minus"></span></Button></td>
                  <td><input type="text" size="4" value={this.state.value[item.id]} disabled></input></td>
                  <td><Button className="btn-success" onClick={this.handleChangeIncrement.bind(this, item.id)}><span className="glyphicon glyphicon-plus"></span></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
