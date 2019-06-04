import React, { Component } from 'react';
import RangeSliderOnePoint from '../../components/RangeSliderOnePoint';

import './RangeSliderTwoPoint.scss';

class RangeSliderTwoPoint extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState(props);
    }

    initState = (props) => {
        const range = props.range;
        
        if (range) {
            // state for range
            return {
                thumbOne: props.defaultValue[0] || 0,
                thumbTwo: props.defaultValue[1] || 100,
                isReveserThumbs: false,
                dataTrackClick: {
                    value: null,
                    thumb: null,
                    isActive: false,
                },
            }
        } else {
            // state for one point
            return {
                thumbOne: 20,
            }
        }
    }


    //#region  HANDLE FOR ONE POINT SLIDER

    handleOnChangeOnePoint = (percentValue) => {
        const {
            onChange,
            min,
            max,
        } = this.props;
        const result = min + (max-min)*percentValue/100;
        onChange(result);
    }

    renderOnePointSlider = () => {
        const {
            value,
            min,
            max,
        } = this.props;
        return (
            <RangeSliderOnePoint
                onChange={this.handleOnChangeOnePoint}
                thumbStart={typeof value === 'number' ? value : 0}
                min={min}
                max={max}
            />
        );
    }

    //endregion END HANDLE FOR ONE POINT SLIDER

    handleOnChangeSliderOne = (value) => {
        this.setState({ thumbOne: value });
    }

    handleOnChangeSliderTwo = (value) => {
        this.setState({ thumbTwo: value });
    }

    handleOnAfterChangeOne = (value) => {
        // console.log('onAfterChange', value);
    }

    handleOnAfterChangeTwo = (value) => {
        // console.log('onAfterChange', value);
    }

    handleClickProgress = (value) => {
        const distanceOne = Math.abs(value-this.state.thumbOne);
        const distanceTwo = Math.abs(value-this.state.thumbTwo);
        if (distanceOne < distanceTwo) {
            this.setState({
                thumbOne: value,
                dataTrackClick: {
                    value,
                    thumb: 'one',
                    isActive: true,
                }
            });
        } else {
            this.setState({
                thumbTwo: value,
                dataTrackClick: {
                    value,
                    thumb: 'two',
                    isActive: true,
                }
            });
        }
    }

    resetDataTrackClick = () => {
        this.setState({
            dataTrackClick: {
                value: null,
                thumb: null,
                isActive: false,
            }
        })
    }

    renderRangeSlider = () => {
        const {
            thumbOne,
            thumbTwo,
            dataTrackClick,
        } = this.state;

        const thumbLeft = thumbOne < thumbTwo ? thumbOne : thumbTwo;
        const thumbRight = thumbOne < thumbTwo ? thumbTwo : thumbOne;

        const setThumbPosOne = dataTrackClick.thumb === 'one' ? dataTrackClick : null;
        const setThumbPosTwo = dataTrackClick.thumb === 'two' ? dataTrackClick : null;
        return (
            <React.Fragment>
            <RangeSliderOnePoint
                progresscustom
                progressCustomObj={{
                    start: thumbLeft,
                    end: thumbRight,
                }}
                thumbStart={this.state.thumbOne}
                className="range-slider-one"
                onChange={this.handleOnChangeSliderOne}
                onAfterChange={this.handleOnAfterChangeOne}
                onClickProgress={this.handleClickProgress}
                setThumbPos={{
                    dataTrackClick: setThumbPosOne,
                    resetDataTrackClick: this.resetDataTrackClick
                }}
            />
            <RangeSliderOnePoint
                noprogress
                notrack
                thumbStart={this.state.thumbTwo}
                className="range-slider-two"
                onChange={this.handleOnChangeSliderTwo}
                onAfterChange={this.handleOnAfterChangeTwo}
                setThumbPos={{
                    dataTrackClick: setThumbPosTwo,
                    resetDataTrackClick: this.resetDataTrackClick
                }}
            />
        </React.Fragment>
        );
    }

    render() {
        const { range } = this.props;
        const sliderUI = range ? this.renderRangeSlider() : this.renderOnePointSlider();
        return(sliderUI);
    }
}

export default RangeSliderTwoPoint;