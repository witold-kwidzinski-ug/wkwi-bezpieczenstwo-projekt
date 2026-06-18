import './App.css';
import Header from './Header';
import Public from './Public/Public';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Favourites from './Favourites/Favourites';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Admin from './Admin/Admin';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Public/>}/>
          <Route path="/favourites" element={<ProtectedRoute><Favourites/></ProtectedRoute>}/>
          <Route path="/admin" element={<AdminRoute><Admin></Admin></AdminRoute>} />
        </Routes>
      
      </BrowserRouter>
    
    </>
  );
}

export default App;
