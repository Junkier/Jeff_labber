import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Login from './login/login-app';
// import About from './components/About';
import NotFound from './NotFound';

const Links = () =>(
    <nav>
        <Link to="/">Login</Link>
        <Link to="/testQQ">testQQ</Link>
    </nav>
);

const Routes = () => (
  <BrowserRouter >
     <div>
        <Route path="/" component={Login} />
        <Route path="*" component={NotFound} />
     </div>
  </BrowserRouter>
);


/*
const Links = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to={{pathname: '/about'}}>About</Link>
    <Link replace to="/contact">Contact</Link>
    <Link to="/nested">Nested</Link>
  </nav>
)

const App = () => (
  <BrowserRouter>
  <div>
      <AddressBar/>

      <Links />

      <Route exact path="/" render={() => <h1>Home</h1>} />
      <Route path="/about" render={() => <h1>About</h1>} />
      <Route path="/contact" render={() => <h1>Contact</h1>} />
      <Route path="/nested" render={Nested} />
    </div>
    </BrowserRouter>
)
*/
export default Routes;
