import React from "react";

/**
 * Component representing a countdown timer.
 * The timer counts down from a specified number of seconds.
 * When the timer reaches 0.15 seconds, a callback function is invoked.
 * The timer can be paused and resumed.
 */
export default class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.lastTick = null;
  }

  state = { elapsed: 0 };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /**
   * Function called on every tick of the timer.
   * Updates the elapsed time and checks if time is over.
   * If time is over, invokes the timeOverCallback.
   */
  tick = () => {
    this.setState((prevState, props) => {
      var presentTimeAtTheMoment = new Date();
      const dt = presentTimeAtTheMoment - this.lastTick;
      const elapsed = prevState.elapsed + dt;
      // Check if time is over
      const remaining = props.seconds - elapsed / 1000;
      if (remaining < 0.15) {
        props.timeOverCallback(props.player);
      }
      return {
        elapsed: elapsed,
      };
    });
    this.lastTick = new Date();
  };

  /**
   * Pauses the countdown timer.
   * Clears the interval and sets the last tick to null.
   */
  pause() {
    clearInterval(this.timer);
    this.timer = null;
    this.lastTick = null;
  }

  /**
   * Resumes the countdown timer.
   * Sets the interval and updates the last tick.
   */
  resume() {
    this.timer = setInterval(this.tick, 1000);
    this.lastTick = new Date();
  }

  render() {
    const remaining =
      this.props.seconds - Math.floor(this.state.elapsed / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    if (this.props.isPaused) {
      // Pause the timer if it is currently running
      this.pause();
    } else if (!this.timer) {
      // Resume the timer if it is not running
      this.resume();
    }

    // Render the countdown timer
    return (
      <p className="countdown">
        {("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
      </p>
    );
  }
}
