import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Date.module.css";
import moment from "moment";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

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

export default class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.intervals && this.props.intervals) {
      this.props.intervals &&
        this.slider.slickGoTo(this.props.intervals.length - 1);
    }
    if (!prevProps.intervalUnit !== this.props.intervalUnit) {
      this.props.intervals &&
        this.slider.slickGoTo(this.props.intervals.length - 1);
    }
  }

  render() {
    const { intervals, intervalUnit } = this.props;

    if (!intervals) return null;

    var settings = {
      dots: false,
      infinite: false,
      arrows: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      speed: 500,
      slidesToShow: 1,
      initialSlide: intervals.length - 1,
      beforeChange: (current, next) => {
        current !== next &&
          this.props.parseData(intervals[next], this.props.intervalUnit);
      },
    };

    return (
      <div className={styles.carouselWrapper}>
        <Slider ref={(slider) => (this.slider = slider)} {...settings}>
          {intervals &&
            intervals.map((slide) => {
              let dateString = "";
              let dateTime = moment(slide).format("L");
              const isSame = moment(slide).isSame(moment(), intervalUnit);
              if (isSame) {
                dateTime = "";
                switch (intervalUnit) {
                  case "day":
                    dateString = "TODAY";
                    break;
                  case "week":
                    dateString = "THIS WEEK";
                    break;
                  case "month":
                    dateString = "THIS MONTH";
                    break;
                  case "year":
                    dateString = "THIS YEAR";
                    break;
                }
              } else {
                switch (intervalUnit) {
                  case "week":
                    dateString = "week of";
                    break;
                  case "month":
                    dateString = "month of";
                    break;
                  case "year":
                    dateString = "year of";
                    break;
                }
              }

              return (
                <div className={styles.card}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardDate}>
                      {dateString + " " + dateTime}
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    );
  }
}
