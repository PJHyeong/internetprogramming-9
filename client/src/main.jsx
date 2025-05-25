import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudyWritePage from "./pages/StudyWritePage";
import StudyEditPage from "./pages/StudyEditPage";
import Home from "./pages/Home";
import StudyDetailPage from "./pages/StudyDetailPage";
import StudyDetailPageMy from "./pages/StudyDetailPageMy";


function Main() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/study/write" element={<StudyWritePage />} />
      <Route path="/study/edit" element={<StudyEditPage />} />
      <Route path="/study/:id" element={<StudyDetailPage />} />
      <Route path="/study/my/:id" element={<StudyDetailPageMy />} />      
      <Route />
    </Routes>
    </BrowserRouter>
  )
}

export default Main;