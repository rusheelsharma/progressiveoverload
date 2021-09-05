import { Redirect, Route } from 'react-router-dom';

import { getUser } from '../utils/StorageUtils';

function PrivateRoute({ children, ...rest }: any): JSX.Element {
  return (
    <Route
      {...rest}
      render={() =>
        getUser() ? children : <Redirect to={{ pathname: '/login' }} />
      }
    />
  );
}

export default PrivateRoute;
