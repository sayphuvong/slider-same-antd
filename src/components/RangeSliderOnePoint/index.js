import React, { Component } from 'react';
import './RangeSliderOnePoint.scss'

class RangeSliderOnePoint extends Component {
    constructor(props) {
        super(props);
        this.distance = 0;
        this.mouseX_prev = null;
        this.mouseX_current = null;
        this.mouseX_start = null;
        this.left = null;
        this.leftMin = null;
        this.leftMax = null;
        this.thumbOne_start = null;
        this.underLine_start = null;
        this.underLine_end = null;
        this.thumbOne_width = null;
        this.slider_width = null;
        this.thumbOneStyle_left_start = null;
        this.progressValue = null;
        this.step_current = null;
    }

    disableDrag = () => {
        this.sliderWrap.ondragstart = () => false;
        this.sliderWrap.ondrag = () => false;
        this.sliderWrap.ondragend = () => false;
    }

    getLeftSlider = () => {
        const rectUnderLine = this.track.getBoundingClientRect();
        return rectUnderLine.left - this.thumbOne_width/2;
    }

    getPropertyComputedStyle = (element, propertyName) => {
        const computedStyle = window.getComputedStyle(element);
        return Number(
            computedStyle.getPropertyValue(propertyName)
                .match(/(.+(?=px))|^\d/g)[0]
        );
    }

    getRightSlider = () => {
        const rectUnderLine = this.track.getBoundingClientRect();
        const widthUnderLine = this.getPropertyComputedStyle(this.track, 'width');
        return (rectUnderLine.left + widthUnderLine) + this.thumbOne_width/2;
    }

    getLeftThumb = (element) => {
        const rectThumb = element.getBoundingClientRect();
        return rectThumb.left;
    }

    getRightThumb = (element) => {
        const rectThumb = element.getBoundingClientRect();
        const widththumb = this.getPropertyComputedStyle(element, 'width');
        return rectThumb.left + widththumb;
    }

    fixMouseMoveTooFast = (event) => {
        if (event.clientX < this.getLeftSlider()) {
            this.thumbOne.style.left = `${this.leftMin}px`;
            return;
        }

        if (event.clientX > this.getRightSlider()) {
            this.thumbOne.style.left = `${this.leftMax}px`;
        }
    }

    fixMouseUpTooFast = (e) => {
        if (this.mouseX_start === e.clientX) return;
        const leftCorrect = (this.progressValue/100) * this.slider_width - this.thumbOne_width/2;
        this.thumbOne.style.left = `${leftCorrect}px`;
    }

    showProgress = (progressValue) => {
        if (this.props.noprogress) return;
        if (this.props.progresscustom) {
            const {
                start: progressStart,
                end: progressEnd,
            } = this.props.progressCustomObj;
            this.progress.style.left = parseInt(progressStart) + "%";
            this.progress.style.width = parseInt(progressEnd - progressStart) + "%";
            return;
        }
        this.progress.style.width = parseInt(progressValue) + "%";
    }

    convertPercentToPositionThumb = (percentValue) => {
        const leftThumb = (percentValue * this.slider_width) / 100 - this.thumbOne_width/2;
        this.thumbOne.style.left = `${leftThumb}px`;
    }

    handleClickProgress = (event) => {
        const {
            onClickProgress,
        } = this.props;
        
        const mouseX = event.clientX;
        const distanceLeftToMouse = mouseX - (this.getLeftSlider() + this.thumbOne_width/2);
        const result = parseInt(distanceLeftToMouse/this.slider_width * 100);
        onClickProgress && onClickProgress(result);
    }

    getProgressValue = () => {
        const leftThumb = this.getLeftThumb(this.thumbOne);
        const leftSlider = this.getLeftSlider();
        return parseInt((leftThumb - leftSlider) / this.slider_width * 100);
    }

    componentDidMount() {

        if (!this.props.noprogress) {
            this.track.onclick = this.handleClickProgress;
        }


        const handleMouseMove = (e) => {
            const distance = e.clientX - this.mouseX_start;
            const leftThumb = this.getLeftThumb(this.thumbOne);
            const rightThumb = this.getRightThumb(this.thumbOne);
            const leftSlider = this.getLeftSlider();
            this.progressValue = parseInt((leftThumb - leftSlider) / this.slider_width * 100);
            this.showProgress(this.progressValue);

            if (
                leftThumb >= this.getLeftSlider() &&
                rightThumb <= this.getRightSlider()
                ) {
                    let distanceForThumb = this.thumbOneStyle_left_start + distance;
                    if (
                        distanceForThumb >= -this.thumbOne_width/2 &&
                        distanceForThumb <= this.slider_width -this.thumbOne_width/2
                        ) {
                        this.thumbOne.style.left = `${distanceForThumb}px`;
                    }
            }
            
            this.mouseX_prev = e.clientX;
            this.fixMouseMoveTooFast(e);
            this.props.onChange(this.progressValue);
        }

        const handleOnMouseUp = (event) => {
            const { onAfterChange } = this.props;
            onAfterChange && onAfterChange(this.progressValue);
            this.fixMouseUpTooFast(event);
            document.removeEventListener('mousemove',handleMouseMove);
            document.removeEventListener('mouseup', handleOnMouseUp);
        }

        this.thumbOne.onmousedown = (e) => {
            this.mouseX_start = e.clientX; // vị trí bắt đầu của chuột
            this.mouseX_prev = e.clientX;
            this.thumbOne_start = this.getLeftThumb(this.thumbOne); // vị trí đầu của thumb
            this.underLine_start = this.getLeftSlider(); // vị trí đầu của thanh line
            this.thumbOne_width = this.getPropertyComputedStyle(this.thumbOne, 'width');
            
            this.thumbOneStyle_left_start = this.getPropertyComputedStyle(this.thumbOne, 'left');

            this.slider_width = this.getPropertyComputedStyle(this.track, 'width')
            
            this.leftMin = -this.thumbOne_width/2;
            this.leftMax = this.slider_width - this.thumbOne_width/2;
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleOnMouseUp)
        };
        

        this.thumbOne_width = this.getPropertyComputedStyle(this.thumbOne, 'width');
        this.slider_width = this.getPropertyComputedStyle(this.track, 'width')
        this.props.thumbStart && this.convertPercentToPositionThumb(this.props.thumbStart);
        this.showProgress(this.getProgressValue());

        this.disableDrag();
    }

    componentDidUpdate() {
        const {
            setThumbPos: {
                dataTrackClick,
                resetDataTrackClick,
            },
        } = this.props;

        if (dataTrackClick && dataTrackClick.isActive) {
            this.convertPercentToPositionThumb(dataTrackClick.value);
            resetDataTrackClick();
        }
        
        this.showProgress()
    }

    render() {
        const classNameProps = this.props.className;
        return(
            <React.Fragment>
                <div
                    ref={(el) => this.sliderWrap = el}
                    className={`range-slider-wrap ${classNameProps}`}>
                    <div
                        ref={(el) => this.track = el}
                        style={this.props.notrack ? {background: 'rgba(0,0,0,0)'} : {}}
                        className="track">
                        {
                            !this.props.noprogress &&
                            (
                                <div
                                    ref={(el) => this.progress = el}
                                    className="progress"></div>
                            )
                        }

                        <div
                            ref={(el) => this.thumbOne = el}
                            className="thumb"></div>

                        <span className="left-value noselect">0%</span>
                        <span className="right-value noselect">100%</span>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default RangeSliderOnePoint;