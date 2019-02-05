import React from "react"
import PropTypes from "prop-types"
class Project extends React.Component {
  render () {
    return (
      <React.Fragment>
        Name: {this.props.name}
        Profile: {this.props.profile}
        Category: {this.props.category}
        Location: {this.props.location}
        Title: {this.props.title}
        Image: {this.props.image}
        Youtube: {this.props.youtube}
        Vimeo: {this.props.vimeo}
        Images: {this.props.images}
        Shares: {this.props.shares}
        Amount: {this.props.amount}
        Goal: {this.props.goal}
        Pounds: {this.props.pounds}
        Goal Pounds: {this.props.goalPounds}
        Backers: {this.props.backers}
        Days: {this.props.days}
        Time: {this.props.time}
        Trending: {this.props.trending}
        English: {this.props.english}
        Story Text: {this.props.storyText}
        Story Html: {this.props.storyHtml}
        Updates: {this.props.updates}
        Created At: {this.props.createdAt}
        Fb Shares: {this.props.fbShares}
      </React.Fragment>
    );
  }
}

Project.propTypes = {
  name: PropTypes.string,
  profile: PropTypes.string,
  category: PropTypes.string,
  location: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  youtube: PropTypes.string,
  vimeo: PropTypes.string,
  images: PropTypes.node,
  shares: PropTypes.node,
  amount: PropTypes.node,
  goal: PropTypes.node,
  pounds: PropTypes.node,
  goalPounds: PropTypes.node,
  backers: PropTypes.node,
  days: PropTypes.node,
  time: PropTypes.string,
  trending: PropTypes.bool,
  english: PropTypes.bool,
  storyText: PropTypes.node,
  storyHtml: PropTypes.node,
  updates: PropTypes.node,
  createdAt: PropTypes.node,
  fbShares: PropTypes.node
};
export default Project
