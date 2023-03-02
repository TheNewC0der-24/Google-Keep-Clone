import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './Components/Header/Sidebar/Sidebar';
import Notes from './Components/Notes/Notes';
import Archive from './Components/Archive/Archive';
import Trash from './Components/Trash/Trash';



function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/trash" element={<Trash />} />
      </Routes>
    </Router>
  );
}

export default App;
