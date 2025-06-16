<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoApp } from '@/pages/TodoApp';
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Index from "./pages/Index";
>>>>>>> preview

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<TodoApp />} />
      </Routes>
=======
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </div>
>>>>>>> preview
    </Router>
  );
}

export default App;
