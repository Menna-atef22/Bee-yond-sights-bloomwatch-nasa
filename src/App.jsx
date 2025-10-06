import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Data from "./Pages/Data/Data.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Storytelling from "./Pages/Storytelling/Storytelling.jsx";
import HealthPollen from "./Pages/HealthPollen/HealthPollen.jsx";
import AIChatBubble from "./Components/AIChatBubble/AIChatBubble.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Dashboard" element={<Dashboard />} />  
          <Route path="/Data" element={<Data />} />
          <Route path="/Storytelling" element={<Storytelling />} />
          <Route path="/HealthPollen" element={<HealthPollen />} />
        </Route>
      </Routes>
      {/* --- ADD THE AI CHAT BUBBLE HERE --- */}
      <AIChatBubble /> 
      {/* --- END ADDITION --- */}
    </Router>
  );
}

export default App;