import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './components/home/HomePage';
import Notebook from './components/Notebook';
import LoginForm from './components/home/LoginForm';
import { Provider } from 'react-redux';
import store from './redux/Store';
function App() {
  return (
    <Provider store={store}>
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/notebook/:id" element={<Notebook />} />
      </Routes>
    </Router>
    </Provider>
  );
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<HomePage />} />
  //       <Route path="/notebook/:id" element={<Notebook />} />
  //     </Routes>
  //   </Router>
  // );
}

export default App;
