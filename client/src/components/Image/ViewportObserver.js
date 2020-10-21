import React, { Component } from "react";
import styles from "./ViewportObserver.module.css";

/*
If Window DOES NOT exist (Server side) return false
If Window exists (Client side) return result of IntersectionObserver check
*/
const intersectionObserverSupport =
  typeof window !== "undefined"
    ? "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
    : false;

class ViewportObserver extends Component {
  static defaultProps = {
    xOffset: "0px",
    yOffset: "0px",
  };

  constructor(props) {
    super(props);
    this.state = {
      hasIntersected: false,
    };
    this.isIntersecting = this.isIntersecting.bind(this);
    this.addObserver = this.addObserver.bind(this);
    this.reset = this.reset.bind(this);
    this.observer = null;
  }

  componentDidMount() {
    this.setState({
      /* If Intersection Observer NOT supported - set state hasIntersected straight away */
      hasIntersected: !intersectionObserverSupport,
    });
    this.addObserver();
  }

  isIntersecting(entries) {
    entries.forEach((entry) => {
      this.setState({
        hasIntersected: entry.isIntersecting,
      });
      if (entry.isIntersecting) {
        this.removeObserver();
      }
    });
  }

  reset() {
    this.addObserver();
  }

  UNSAFE_componentWillReceiveProps() {
    this.reset();
  }

  addObserver() {
    if (!this.observer && intersectionObserverSupport) {
      this.observer = new IntersectionObserver(this.isIntersecting, {
        rootMargin: `0px ${this.props.xOffset} ${this.props.yOffset} 0px`,
      });
      this.observer.observe(this.node);
    }
  }

  removeObserver() {
    if (this.observer) {
      this.observer.unobserve(this.node);
      this.observer = null;
    }
  }

  componentWillUnmount() {
    this.removeObserver();
  }

  render() {
    return (
      <div
        className={styles.viewportObserver}
        ref={(node) => (this.node = node)}
      >
        {this.props.children(this.state.hasIntersected)}
      </div>
    );
  }
}

export default ViewportObserver;
