import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  addCartItem,
  subtractCartItem,
  deleteFromCart,
  fetchCart,
} from "../store/cart";

export class Cart extends Component {
  constructor() {
    super();
    this.calculateSubTotal = this.calculateSubTotal.bind(this);
    this.calculateTax = this.calculateTax.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
  }

  componentDidMount() {
    this.props.fetchCart(this.props.customerId);
  }

  calculateSubTotal(items) {
    return (
      items.reduce((sum, item) => {
        sum += item.price * item.orderHotSauce.quantity;
        return sum;
      }, 0) / 100
    );
  }

  calculateTax(items) {
    return (
      (items.reduce((sum, item) => {
        sum += item.price * item.orderHotSauce.quantity;
        return sum;
      }, 0) *
        0.08) /
      100
    );
  }

  calculateTotal(items) {
    const subTotal = this.calculateSubTotal(items);
    const tax = this.calculateTax(items);
    return subTotal + tax;
  }

  render() {
    const items = this.props.parentItems || this.props.cart.hotSauces || [];
    const { calculateSubTotal, calculateTax, calculateTotal } = this;
    const subTotal = calculateSubTotal(items);
    const { isAdmin } = this.props || false;
    return (
      <div id="cart">
        <h1>Cart</h1>
        <div className="all-items">
          {items.map((item) => (
            <div className="container" key={item.id}>
              <div className="containerLeft">
                <img src={item.imageUrl} alt={`picture of ${item.name}`} />
              </div>
              <div className="containerRight">
                {isAdmin ? <p>item #{item.id}</p> : ""}
                <p>{item.name}</p>
                <table>
                  <tr className="quantity-row">
                    <td>
                      <span>${item.price / 100}</span>
                    </td>
                    <td>
                      <button
                        className="operatorButtons"
                        onClick={() =>
                          this.props.addCartItem(
                            this.props.cart.id,
                            item.id,
                            this.props.customerId
                          )
                        }
                      >
                        +
                      </button>
                    </td>
                    <td>
                      <span>{item.orderHotSauce.quantity}</span>
                    </td>
                    <td>
                      <button
                        className="operatorButtons"
                        onClick={() =>
                          this.props.subtractCartItem(
                            this.props.cart.id,
                            item.id,
                            this.props.customerId
                          )
                        }
                      >
                        -
                      </button>
                    </td>
                    <td>
                      <span>
                        <strong>
                          ${(item.price / 100) * item.orderHotSauce.quantity}
                        </strong>
                      </span>
                    </td>
                  </tr>
                </table>

                <button
                  className="deleteFromCart"
                  onClick={() =>
                    this.props.deleteFromCart(
                      this.props.cart.id,
                      item.id,
                      this.props.customerId
                    )
                  }
                >
                  Remove From Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id="total-charges">
          <p>Subtotal: ${subTotal}</p>
          <p>Tax: ${calculateTax(items)}</p>
          <p>Total: ${calculateTotal(items)}</p>
          {this.props.parentItems ? (
            ""
          ) : (
            <Link to="/checkout">
              <button id="purchase-btn">Purchase</button>
            </Link>
          )}
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
    customerId: state.auth.id,
    isAdmin: !!state.auth.isAdmin,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (customerId) => dispatch(fetchCart(customerId)),
    addCartItem: (orderId, hotSauceId, customerId) =>
      dispatch(addCartItem(orderId, hotSauceId, customerId)),
    subtractCartItem: (orderId, hotSauceId, customerId) =>
      dispatch(subtractCartItem(orderId, hotSauceId, customerId)),
    deleteFromCart: (orderId, hotSauceId, customerId) =>
      dispatch(deleteFromCart(orderId, hotSauceId, customerId)),
  };
};

export default connect(mapState, mapDispatch)(Cart);
