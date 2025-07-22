import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import AppRoutes from './router';
import RecoilNexus from 'recoil-nexus'; 

function App() {
  return (
    <RecoilRoot>
      <RecoilNexus /> 
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
