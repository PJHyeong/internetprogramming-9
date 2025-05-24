import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudyWritePage from "./pages/StudyWritePage";
import StudyEditPage from "./pages/StudyEditPage";
import Home from "./pages/Home";

function Main() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/study/write" element={<StudyWritePage />} />
      <Route path="/study/edit" element={<StudyEditPage />} />
      <Route />
    </Routes>
    </BrowserRouter>
  )
}

export default Main;