import React from 'react';
import { bindActionCreators } from 'redux';
import { setEvents } from '../actions/index.js';
import { connect } from 'react-redux';

class EventsPage extends React.Component{
  constructor (props) {
    super(props);
  }


  render (){
    return(
      <h2>{this.props.events}</h2>
    )
  }
}

function mapStateToProps (state) {
  return {
    events: state.events
  };
};

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setEvents: setEvents
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);