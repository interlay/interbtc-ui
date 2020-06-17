import React, { Component } from 'react';

import { IssueProps } from "../types/IssueState";

// TODO: create a table component to display current issue requests
class IssueRequests extends Component<IssueProps, {}> {
  constructor(props: IssueProps) {
    super(props);
  }

  render(){
    return(
      <div>
        <h5>Placeholder</h5>
      </div>
    )
  }
}

export default IssueRequests;
