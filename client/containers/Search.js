import React from 'react';
import { setEvents } from '../actions/index.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { browserHistory } from 'react-router';

var categories = [
  { value: 103, cat: 'Music' },
  { value: 110, cat: 'Food & Drink' },
  { value: 101, cat: 'Business & Professional' },
  { value: 113, cat: 'Community & Culture' },
  { value: 105, cat: 'Performing & Visual Arts' },
  { value: 104, cat: 'Film, Media & Entertainment' },
  { value: 108, cat: 'Sports & Fitness' },
  { value: 107, cat: 'Health & Wellness' },
  { value: 102, cat: 'Science & Technology' },
  { value: 109, cat: 'Travel & Outdoor' },
  { value: 111, cat: 'Charity & Causes' },
  { value: 114, cat: 'Religion & Spirituality' },
  { value: 115, cat: 'Family & Education' },
  { value: 116, cat: 'Seasonal & Holiday' },
  { value: 112, cat: 'Government & Politics' },
  { value: 106, cat: 'Fashion & Beauty' },
  { value: 117, cat: 'Home & Lifestyle' },
  { value: 118, cat: 'Auto, Boat & Air' },
  { value: 119, cat: 'Hobbies & Special Interests' },
  { value: 199, cat: 'Other' }
]

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: ''
    }
  }

  handleChange(event) {
    let val = document.getElementById('category-select');
    let qry = document.getElementById('query');

    this.setState({
      query: qry.value,
      category: val.options[val.selectedIndex].value
    })
  }
  searchEvents (search) {
    //clear state
    this.props.setEvents([]);
    //then do search stuff
    var context = this;
    axios.post('/api/eventbrite', search).then(function(data) {
      context.props.setEvents(data.data.events);
    });
    browserHistory.push('/results');
  }

  render() {
    return (
      <div>
        <select id='category-select' onChange={this.handleChange.bind(this)}>
            { categories.map(obj => {
                return <option value={ obj.value }>{ obj.cat }</option>
              })
            }
        </select>
        <input id='query' type='text' value={this.state.query} onChange={this.handleChange.bind(this)}></input>
        <button onClick={
          this.searchEvents.bind(this, this.state)
        }
        >Search Events</button>
      </div>
      )
  }
}

function mapStateToProps (state) {
  return {
    search: state
  };
};

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setEvents: setEvents
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

