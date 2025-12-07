import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Step1Load from './components/step1_Load'
import Step2SummaryList from './components/step2_summaryList'
import Step3Feed from './components/step3_Feed'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step1Load />} />
        <Route path="/summaries" element={<Step2SummaryList />} />
        <Route path="/feed" element={<Step3Feed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
