import React, { Component } from 'react';
import { Input, Typography, message } from 'antd';
import HistoryTags from './historyTags';

const { Title } = Typography;
const Search = Input.Search;

class SearchBar extends Component {

  state = {
    hashtag: "",
    username: "",
    small: false,
  };

  warning = () => {
    message.warning('Search for something useful instead.');
  };

  searchQuery = v => {
    if (v.length === 0) {
      this.warning();
      return;
    }
    let vArr = v.split(" ");
    let remove = [];
    let params = {username: "", hashtag: ""};
    for (let i in vArr) {
      if (vArr[i].startsWith('hashtag:')) {
        params['hashtag'] = vArr[i].substring(vArr[i].indexOf(':') + 1);
        remove.push(i);
      }
      else if (vArr[i].startsWith('username:')) {
        params['username'] = vArr[i].substring(vArr[i].indexOf(':') + 1);
        remove.push(i);
      }
    }

    for (let i in remove.reverse()) {
      vArr.splice(remove[i], 1);
    }
    params['query'] = vArr.join(' ');

    this.setState({
      username: params.username,
      query: params.query, 
      tags: params.query,
      words: v,
    }, () => {
      this.props.callback(this.state);
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      small: newProps.display,
    }, () => {
      console.log(this.state);
    });
  }

  directSearch = (v) => {
    this.searchQuery(v);
    this.changeInput(v);
  }

  changeInput = (v) => {
    return v;
  }

  render() {
    let size = this.state.small ? "default":"large";
    let titleLvl = this.state.small ? 4:1;
    return (
      <React.Fragment>
        <Title level={titleLvl}>Tweeter Searcher</Title>
        <Search
          placeholder="query | username | hashtag"
          enterButton="Search"
          size={size}
          allowClear
          onSearch={value => this.searchQuery(value)}
        />
        <HistoryTags query={this.state.words} callback={this.directSearch}/>
      </React.Fragment>
    );
  }
}

export default SearchBar;