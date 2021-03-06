import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHotSauces } from "../store/hotSauces";

export class AllHotSauces extends Component {
  componentDidMount() {
    this.props.loadHotSauces();
  }

  render() {
    const { hotSauces } = this.props;
    return (
      <div id="allHotSauces" className="component-container">
        <h1>All the Sauce</h1>
        <div className="all-items">
          {hotSauces.map((hotSauce) => (
            <div className="container" key={hotSauce.id}>
              <div className="containerLeft">
                <img
                  src={hotSauce.imageUrl}
                  alt={`picture of ${hotSauce.name}`}
                />
              </div>
              <Link to={`/hotsauces/${hotSauce.id}`}>
                <div className="containerRight">
                  <span>{hotSauce.name}</span>
                  <span>${hotSauce.price / 100}</span>
                  <span>
                    <small>
                      {Array.apply(null, Array(hotSauce.heatLevel)).map(
                        () => `🔥`
                      )}
                    </small>
                    <small className="flame-gradient">
                      {Array.apply(null, Array(10 - hotSauce.heatLevel)).map(
                        () => `🔥`
                      )}
                    </small>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return { hotSauces: state.hotSauces };
};

const mapDispatch = (dispatch) => {
  return {
    loadHotSauces: () => dispatch(fetchHotSauces()),
  };
};

export default connect(mapState, mapDispatch)(AllHotSauces);
