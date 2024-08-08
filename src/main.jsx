import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Swap from './Swap.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Swap />
  </StrictMode>,
)
