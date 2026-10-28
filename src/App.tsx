
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DatabaseTest from "./pages/DatabaseTest";

// Public navigation
import Navbar from "./components/Navbar";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminBookings from "./pages/AdminBookings";
import AdminMessages from "./pages/AdminMessages";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminGallery from "./pages/AdminGallery";

// Admin protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC WEBSITE
        ========================== */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />

        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
            </>
          }
        />

        <Route
          path="/events"
          element={
            <>
              <Navbar />
              <Events />
            </>
          }
        />

        <Route
          path="/events/:slug"
          element={
            <>
              <Navbar />
              <EventDetails />
            </>
          }
        />

        <Route
          path="/gallery"
          element={
            <>
              <Navbar />
              <Gallery />
            </>
          }
        />

        <Route
          path="/testimonials"
          element={
            <>
              <Navbar />
              <Testimonials />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
            </>
          }
        />

        <Route
          path="/booking"
          element={
            <>
              <Navbar />
              <Booking />
            </>
          }
        />

        {/* Privacy Policy */}
        <Route
          path="/privacy"
          element={
            <>
              <Navbar />
              <Privacy />
            </>
          }
        />

        {/* Terms & Conditions */}
        <Route
          path="/terms"
          element={
            <>
              <Navbar />
              <Terms />
            </>
          }
        />

        {/* Supabase database test page */}
        <Route
          path="/database-test"
          element={
            <>
              <Navbar />
              <DatabaseTest />
            </>
          }
        />

        {/* =========================
            ADMIN LOGIN
        ========================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =========================
            PROTECTED ADMIN AREA
        ========================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Admin Events */}
          <Route
            path="events"
            element={<AdminEvents />}
          />

          {/* Admin Bookings */}
          <Route
            path="bookings"
            element={<AdminBookings />}
          />

          {/* Admin Messages */}
          <Route
            path="messages"
            element={<AdminMessages />}
          />

          {/* Admin Testimonials */}
          <Route
            path="testimonials"
            element={<AdminTestimonials />}
          />

          {/* Admin Gallery */}
          <Route
            path="gallery"
            element={<AdminGallery />}
          />
        </Route>

        {/* =========================
            UNKNOWN URL
            Redirect to Home
        ========================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

