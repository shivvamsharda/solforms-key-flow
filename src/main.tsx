import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill for Buffer (required by Solana wallet adapters)
import { Buffer } from 'buffer'
window.Buffer = Buffer

createRoot(document.getElementById("root")!).render(<App />);
