import { Component } from 'react';
import LandingPage from "./views/LandingPage";
import Help from "./views/Help";

import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <div class="main d-flex flex-column min-vh-100">
        <div class="mb-5">
          <LandingPage />
        </div>
        <Footer />
      </div>
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

export default App;
