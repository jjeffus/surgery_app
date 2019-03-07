import React from "react"
import PropTypes from "prop-types"
class Report extends React.Component {
  render () {
    return (
      <React.Fragment>
        Url: {this.props.url}
      </React.Fragment>
    );
  }
}

Report.propTypes = {
  url: PropTypes.string
};
export default Report
