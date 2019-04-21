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

  loadResults = () => {
    if (this.state.display) {
      let path = `http://5cad37b601a0b80014dcd321.mockapi.io/api/v1/results/`;

      Axios.get(path, {
        params: {
          query: this.state.query
        }
      }).then(r => {
        this.setState({
          results: r.data,
        })
      });
    }
  };

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
          <Title level={4} >Retrieved {this.state.results.length} results, takes about 1 hour</Title>
        </div>
        <div align="left">
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
