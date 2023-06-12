import React from "react";

export default class SettingsForm extends React.Component {
  constructor(props) {
    super(props);

    // Set default state values
    let defaults = this.props.defaultValues;
    this.state = {
      boardSize: 3,
      clock: "clock",
      time: defaults.time,
    };

    // Bind event handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle change event for form inputs
  handleChange(event) {
    const target = event.target;
    this.handleTarget(target);
  }

  // Handle target value based on its type
  handleTarget(target) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "clock") {
      console.log("Clock: " + target.value);
    }
    // Update the state with the new value
    this.setState({
      [name]: value,
    });
  }

  // Handle form submission
  handleSubmit(event) {
    // Call the submitCallback function with clock and time values
    this.props.submitCallback(this.state.clock, this.state.time);
    event.preventDefault();
  }

  render() {
    return (
      <form className="settingForm">
        {/* Button for starting the game */}
        <button onClick={this.handleSubmit} className="startGame">
         START GAME
        </button>
        <section className="settings-label1">
          <h4 className="timerHeading">Game Timer</h4>

          {/* Render the input field for time if clock state is truthy */}
          {this.state.clock && (
            <label className="settings-label">
              <input
                label="Time (min)"
                size="mini"
                name="time"
                type="number"
                max="100"
                min="1"
                value={this.state.time}
                onChange={this.handleChange}
              />
            </label>
          )}
        </section>
      </form>
    );
  }
}
