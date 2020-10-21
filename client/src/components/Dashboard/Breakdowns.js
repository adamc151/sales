import React, { Component } from "react";
import styles from "./Breakdowns.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";


import {
  FaAngleLeft,
  FaAngleRight,
  FaCcAmex,
  FaMoneyBillAlt,
  FaCreditCard,
} from "react-icons/fa";

const paymentMethodIcons = {
  CASH: <FaMoneyBillAlt color={"#53a957"} size={"20px"} />,
  CARD: <FaCreditCard color={"#d5ad43"} size={"20px"} />,
  AMEX: <FaCcAmex color={"#016fcf"} size={"20px"} />,
};

function SampleNextArrow(props) {
  const { onClick, currentSlide, slideCount } = props;
  return (
    <div
      className={`${styles.nextArrowWrapper} ${
        currentSlide === slideCount - 1 ? styles.nextArrowDisabled : ""
      }`}
      onClick={onClick}
    >
      <FaAngleRight size={"24px"} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick, currentSlide } = props;
  return (
    <div
      className={`${styles.previousArrowWrapper} ${
        currentSlide === 0 ? styles.previousArrowDisabled : ""
      }`}
      onClick={onClick}
    >
      <FaAngleLeft size={"24px"} />
    </div>
  );
}

export default class Breakdowns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (typeof prevProps.intervals === "undefined" && this.props.intervals) {
      this.props.intervals &&
        this.slider.slickGoTo(this.props.intervals.length - 1);
    }
    if (!prevProps.intervalUnit !== this.props.intervalUnit) {
      this.props.intervals &&
        this.slider.slickGoTo(this.props.intervals.length - 1);
    }
  }

  /*
  afterChange: () => this.props.onSwipe(this.state.slideIndex),
      beforeChange: (current, next) => this.setState({ slideIndex: next }),
      */

  render() {
    const { intervals, intervalUnit, date, breakdowns } = this.props;
    if (!intervals) return null;

    var settings = {
      dots: false,
      infinite: false,
      arrows: false,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      speed: 500,
      slidesToShow: 1,
      initialSlide: intervals.length - 1,
      beforeChange: (current, next) => {
        current !== next &&
          this.props.parseData(intervals[next], this.props.intervalUnit);
      },
      afterChange: (index) => {},
    };
    return (
      <div className={styles.wrapper}>
        <div className={styles.title}>
          {false ? `${moment(date).format("L")}` : null}
        </div>
        <div className={styles.carouselWrapper}>
          <Slider ref={(slider) => (this.slider = slider)} {...settings}>
            {intervals &&
              breakdowns &&
              intervals.map((slide, i) => {
                return (
                  <div className={styles.card}>
                    <div className={styles.leftArrow}></div>
                    <div className={styles.cardInner}>
                      <div className={styles.breakdownWrapper}>
                        <span style={{ marginRight: "16px" }}>
                          {paymentMethodIcons.CASH}
                        </span>
                        <span className={styles.total}>
                          £{breakdowns["CASH"].total}
                        </span>
                        <span className={styles.percentage}>
                          {breakdowns["CASH"].percentage}%
                        </span>
                      </div>
                      <div className={styles.breakdownWrapper}>
                        <span style={{ marginRight: "16px" }}>
                          {paymentMethodIcons.CARD}
                        </span>
                        <span className={styles.total}>
                          £{breakdowns["CARD"].total}
                        </span>
                        <span className={styles.percentage}>
                          {breakdowns["CARD"].percentage}%
                        </span>
                      </div>
                      <div className={styles.breakdownWrapper}>
                        <span style={{ marginRight: "16px" }}>
                          {paymentMethodIcons.AMEX}
                        </span>
                        <span className={styles.total}>
                          £{breakdowns["AMEX"].total}
                        </span>
                        <span className={styles.percentage}>
                          {breakdowns["AMEX"].percentage}%
                        </span>
                      </div>
                    </div>
                    <div className={styles.rightArrow}></div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    );
  }
}
