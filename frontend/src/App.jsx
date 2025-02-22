import './App.css';
import AdminPage from './Components/AdminPage';
import AllApproved from './Components/UserPage/AllApproved';
import Rejected from './Components/UserPage/Rejected';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import PendingLeaves from './Components/UserPage/PendingLeaves';
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