import './App.css';
import AdminPage from './Components/AdminPage';
import AllApproved from './Components/UserPage.jsx/AllApproved';
import Rejected from './Components/UserPage.jsx/Rejected';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import PendingLeaves from './Components/UserPage.jsx/PendingLeaves';
import { useState } from 'react';

function App() {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AdminPage />} />
        <Route path='/allpending' element={<PendingLeaves setApprovedLeaves={setApprovedLeaves} setRejectedLeaves={setRejectedLeaves} />} />
        <Route path='/allapproved' element={<AllApproved approvedLeaves={approvedLeaves} />} />
        <Route path='/allrejected' element={<Rejected rejectedLeaves={rejectedLeaves} />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;