import React from 'react';
import {withRouter} from "react-router-dom";

function Profile() {
  return (
    <div>
      <h1>if you see this you entered the auth.</h1>
    </div>
  );
};

export default withRouter(Profile);