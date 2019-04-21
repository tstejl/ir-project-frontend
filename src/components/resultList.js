import React, { Component } from "react";
import { List, Empty, Switch } from "antd";
import { Typography } from "antd";

import Axios from "axios";

const { Title } = Typography;

class ResultList extends Component {
  state = {
    results: [],
    query: "",
    display: false,
    byDate: false,
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      query: newProps.query,
      display: newProps.display,
    }, () => {
      console.log(this.state.query);
      this.loadResults();
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChange = (checked) => {
    if (checked) {
      this.sortByLatest();
    } else {
      this.sortByRelevance();
    }
  }

  loadResults = () => {
    if (this.state.display) {
      Axios.get(`http://5cad37b601a0b80014dcd321.mockapi.io/api/v1/results/`).then(r => {
        this.setState({
          results: r.data,
        }, () => {
          
          this.state.byDate ? (
            this.onChange(true)            
          ):(
            this.onChange(false) 
          );
        });
      });
    }
  };

  sortByLatest = () => {
    let results = this.state.results;
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.setState({results: results});
    console.log('by latest');
  }

  sortByRelevance = () => {
    let results = this.state.results;
    results.sort((a, b) => b.score - a.score);
    this.setState({results: results});
    console.log('by relevance');
  }

  render() {
    let { results } = this.state;
    let resultsList = results.length ? (
      item => (
        <List.Item>
          <List.Item.Meta
            title={"@" + item.name}
            description={"Posted on: " + item.date + ", Score: " + item.score}
          />
          {item.tweet}
        </List.Item>
      )
    ) : (
        <Empty />
      );
    let toBeReturned = this.state.display ? (
      <React.Fragment>
        <br /><br />
        <div align="center">
          <Title level={3}>Retrieved {this.state.results.length} results, takes about 1 hour</Title>
        </div>
        <div align="left">
          <Switch
            checkedChildren="By Latest"
            unCheckedChildren="By Relevance"
            onChange={this.onChange}
          />
          <List
            itemLayout="vertical"
            pagination={{
              pageSize: 6
            }}
            size="large"
            dataSource={results}
            renderItem={resultsList}
          />
        </div>

      </React.Fragment>
    ) : (
        <div></div>
      );
    return (
      toBeReturned
    );
  }
}

export default ResultList;
