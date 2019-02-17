import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './App.css';
import { deepStrictEqual } from 'assert';

/* This class is to display the checkout item list */
class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <Button className="btn btn-primary" onClick={this.props.closePopup}>Close</Button>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(){
		super();

		this.state = {
      fifthItem: null,
      totalQuantity: 0,
      totalPrice: 0,
      products: [],
      showPopup: false,
      promotionApplied: false
    }
  }

  /* This function retrieves the event data from the server and stores it in local variable */
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

  /* All these discount functions are parameterized so they can be used in multiple scenarios */
  /* This function applies 20% discount off the 5th experience */
  getPercentOffSpecificExperience(product, percentage){
    return product.cost*percentage;
  }

  /* This is a discount function (Buy 4, Pay for 3) */
  buySomePayForFew(product, discountQty){
    if(product.qty%4 === 0){
      return product.cost*discountQty;
    }

    return 0;
  }

  /* This is a discount function (Buy 2 for $1500) */
  buyFewForSpecificAmount(product, qty, discountAmount){
    if(product.qty === qty){
      return discountAmount;
    }

    return 0;
  }

  /* To calculate the price of the event added to the bag */
  calculatePrice(product){
    var result = product.cost;

    if(this.state.totalQuantity === 5){      
      if(this.state.fifthItem === null){
        this.state.fifthItem = product.id;
      }

      if(product.id === this.state.fifthItem){
        result -= this.getPercentOffSpecificExperience(product, 0.2);
      }
      else{
        switch(product.name){
          case "Kids Party":
            //No promotions available
            break;
          case "Wine Tour":
            result -= this.buySomePayForFew(product, 1);
            break;
          case "Team Building":
            result -= this.buyFewForSpecificAmount(product, 2, 100);
            break;
          case "Picnic":
            result -= this.buySomePayForFew(product, 1);
            break;
        }

        const products = this.state.products.slice();
        products.forEach((product) => {
          if (product.id === this.state.fifthItem) {
            product.price += this.getPercentOffSpecificExperience(product, 0.2);
            this.state.fifthItem = null;
          }
        });

        this.setState({ products });
      }
    }
    else{
      switch(product.name){
        case "Kids Party":
          //No promotions available
          break;
        case "Wine Tour":
          result -= this.buySomePayForFew(product, 1);
          break;
        case "Team Building":
          result -= this.buyFewForSpecificAmount(product, 2, 100);
          break;
        case "Picnic":
          result -= this.buySomePayForFew(product, 1);
          break;
      }
    }

    return result;
  }

  /* Claculating the total price of the shopping cart */
  calculateTotalPrice(){
    this.state.totalPrice = 0;
    const products = this.state.products.slice();
    products.forEach((product) => {
      this.state.totalPrice += product.price;
    });
  }

  /* To handle the increment change */
  handleChangeIncrement(e, i){
    const products = this.state.products.slice();
    products.forEach((product) => {
      if (product.id === e) {
        product.qty++;
        this.state.totalQuantity++;
        product.price += this.calculatePrice(product);
      }
    });

    this.calculateTotalPrice() 
    this.setState({ products });
    console.log(this.state);
  }

  /* To handle the decrement change */
  handleChangeDecrement(e, i){
    if(this.state.products[e].qty > 0)
    {
      const products = this.state.products.slice();
      products.forEach((product) => {
        if (product.id === e) {
          product.price -= this.calculatePrice(product);
          product.qty--;
          this.state.totalQuantity--;
          if(this.state.totalQuantity === 4){
            this.state.fifthItem = null;
          }
        }
      });

      this.calculateTotalPrice()
      this.setState({ products });
      console.log(this.state);
    }
  }

  originalList(){
    const products = this.state.products.slice();
    products.forEach((product) => {
      if(product.name === "Picnic" && product.qty === 3){
        product.qty = 2;
      }
    });
  }

  /* To show and hide the checkout popup window */
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });

    if(this.state.showPopup){
      this.originalList();
    }
  }

  /* Prepare the text that needs to be displayed in checkout popup */
  checkoutText(){
    const products = this.state.products.slice();
    products.forEach((product) => {
      if (product.cost*product.qty > product.price) {
        this.state.promotionApplied = true;
      }

      if(product.name === "Picnic" && product.qty === 2){
        product.qty = 3;
      }
    });

    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          { this.state.products.map((item, i) => 
          {if(item.qty > 0)
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>${item.price}</td>
              </tr>
          )})}
        </tbody>
        <tfoot>
          <tr>
            <th className="text-center" colSpan="3">
              Total Price: ${this.state.totalPrice}
              {this.state.promotionApplied ? (<span> (Promotion Applied)</span>) : null}
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }
  
  render() {
    return (
      <div className="container">
        <div className="row">
          <h1 className="text-center">AmazingCo Shopping Cart</h1>
          <div className="col-md-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Cost</th>
                  <th></th>
                  <th>Quantity</th>
                  <th></th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                { this.state.products.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.cost}</td>
                    <td><Button className="btn-danger" onClick={this.handleChangeDecrement.bind(this, item.id)}><span className="glyphicon glyphicon-minus"></span></Button></td>
                    <td><input type="text" size="4" value={item.qty} disabled></input></td>
                    <td><Button className="btn-success" onClick={this.handleChangeIncrement.bind(this, item.id)}><span className="glyphicon glyphicon-plus"></span></Button></td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="price" className="col-md-12">
            <h2>Total Price: ${this.state.totalPrice}</h2>
            <Button onClick={this.togglePopup.bind(this)} className="btn btn-info">Checkout</Button>

            {this.state.showPopup ?
              <Popup
                text={this.checkoutText()}
                closePopup={this.togglePopup.bind(this)}
              />
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
