import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// theme
import "./App.scss";
import './assets/css/custom-bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/custom.css';


// app imports
import LandingPage from "./views/LandingPage";
// import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="main d-flex flex-column min-vh-100">
          <div className="mb-5">
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
