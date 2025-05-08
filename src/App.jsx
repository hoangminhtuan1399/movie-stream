import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";
import { MoviePage } from "./pages/admin/MoviePage/MoviePage.jsx";
import { CollectionPage } from "./pages/admin/CollectionPage/CollectionPage.jsx";
import { FeaturePage } from "./pages/admin/FeaturePage/FeaturePage.jsx";
import { ActorPage } from "./pages/admin/ActorPage/ActorPage.jsx";
import { ReportPage } from "./pages/admin/ReportPage/ReportPage.jsx";
import AdminLayout from "./pages/admin/AdminLayout/AdminLayout.jsx";
import UserLayout from './pages/user/UserLayout/UserLayout.jsx';
import { HomePage } from './pages/user/HomePage/HomePage.jsx';

function App() {
  return (
    <Routes>
      <Route path={'/admin'} element={<AdminLayout />}>
        <Route index element={<MoviePage />} />
        <Route path={'movie'} element={<MoviePage />} />
        <Route path={'collection'} element={<CollectionPage />} />
        <Route path={'feature'} element={<FeaturePage />} />
        <Route path={'actor'} element={<ActorPage />} />
        <Route path={'report'} element={<ReportPage />} />
      </Route>
      <Route path={'/'} element={<UserLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
