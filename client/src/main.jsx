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
