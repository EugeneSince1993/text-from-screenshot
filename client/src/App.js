import CssBaseline from '@mui/material/CssBaseline';
import { TextFromScreenshot } from './components/TextFromScreenshot';
import './App.css';

function App() {
  return (
    <>
      <CssBaseline />
      <div className="app">
        <TextFromScreenshot />
      </div>
    </>
  );
}

export default App;
