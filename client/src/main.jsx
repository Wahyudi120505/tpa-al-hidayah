import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import AdminLayout from "./layout/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ParentController from "./pages/admin/ParentController.jsx";
import SantriController from "./pages/admin/SantriController.jsx";
import AbsensiController from "./pages/admin/AbsensiController.jsx";
import StudentMemorizationController from "./pages/admin/StudentMemorizationController.jsx";
import PaymentController from "./pages/admin/PaymentController.jsx";
import GradeController from "./pages/admin/GradeController.jsx";
import ParentLayout from "./layout/ParentLayout.jsx";
import HomepageParent from "./pages/parent/HomePageParent.jsx";
import HafalanStudent from "./pages/parent/HafalanStudent.jsx";
import ProfileParent from "./pages/parent/ProfileParent.jsx";
import SubjectController from "./pages/admin/SubjectController.jsx";
import RaportStudent from "./pages/parent/RaportStudent.jsx";
import AbsensiStudent from "./pages/parent/AbsensiStudent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },

  //Admin
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children:[
          {
            path:"",
            element:<SantriController />
          },
          {
            path:"parent",
            element:<ParentController />
          },
          {
            path:"absensi",
            element:<AbsensiController />
          },
          {
            path:"memorize",
            element:<StudentMemorizationController />
          },
          {
            path:"payment",
            element:<PaymentController />
          },
          {
            path:"grade",
            element:<GradeController />
          },
          {
            path:"subject",
            element:<SubjectController />
          },
        ]
      },
    ],
  },

  //Parent
  {
    path: "/parent",
    element: <ProtectedRoute allowedRoles={["PARENT"]} />,
    children: [
      {
        path: "",
        element: <ParentLayout />,
        children:[
          {
            path:"",
            element:<HomepageParent />
          },
          {
            path:"hafalan",
            element:<HafalanStudent />
          },
          {
            path:"raport",
            element: <RaportStudent />
          },
          {
            path:"absensi",
            element: <AbsensiStudent />
          },
          {
            path:"profile-parent",
            element:<ProfileParent />
          },
        ]
      },
    ],
  }
]);

// Render aplikasi dengan RouterProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
