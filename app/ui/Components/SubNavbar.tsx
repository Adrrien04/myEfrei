"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SubNavbar = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Token invalide");
      }

      const decodedPayload = JSON.parse(atob(parts[1]));

      if (!decodedPayload.role) {
        throw new Error("Rôle non trouvé dans le token");
      }

      setRole(decodedPayload.role);
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  if (role === "admins") return <AdminSubNavbar />;
  if (role === "profs") return <ProfSubNavbar />;
  if (role === "eleves") return <EleveSubNavbar />;

  return null;
};

const AdminSubNavbar = () => {
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isSlidesDropdownOpen, setIsSlidesDropdownOpen] = useState(false);
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);

  const toggleNewsDropdown = () => {
    setIsNewsDropdownOpen(!isNewsDropdownOpen);
    setIsSlidesDropdownOpen(false);
    setIsEventsDropdownOpen(false);
  };

  const toggleSlidesDropdown = () => {
    setIsSlidesDropdownOpen(!isSlidesDropdownOpen);
    setIsNewsDropdownOpen(false);
    setIsEventsDropdownOpen(false);
  };

  const toggleEventsDropdown = () => {
    setIsEventsDropdownOpen(!isEventsDropdownOpen);
    setIsNewsDropdownOpen(false);
    setIsSlidesDropdownOpen(false);
  };

  return (
    <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
      <ul className="flex space-x-4">
        <li>
          <a href="/portal/admin/dashboard" className="hover:underline">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/portal/admin/users" className="hover:underline">
            Manage Users
          </a>
        </li>
        <li>
          <a href="/portal/admin/cours" className="hover:underline">
            Manage Courses
          </a>
        </li>
        <li className="relative">
          <button
              onClick={toggleNewsDropdown}
              className="hover:underline text-gray-700 font-medium"
          >
            Manage News
          </button>
          {isNewsDropdownOpen && (
              <ul className="absolute bg-white border rounded-lg mt-2 shadow-lg z-50 w-48">
                <li>
                  <a
                      href="/portal/admin/news/view"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-t-lg"
                  >
                    View and Edit News
                  </a>
                </li>
                <li>
                  <a
                      href="/portal/admin/news/write"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-b-lg"
                  >
                    Write News
                  </a>
                </li>
              </ul>
          )}
        </li>
        <li className="relative">
          <button
              onClick={toggleSlidesDropdown}
              className="hover:underline text-gray-700 font-medium"
          >
            Manage Slides
          </button>
          {isSlidesDropdownOpen && (
              <ul className="absolute bg-white border rounded-lg mt-2 shadow-lg z-50 w-48">
                <li>
                  <a
                      href="/portal/admin/slides/view"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-t-lg"
                  >
                    View and Edit Slides
                  </a>
                </li>
                <li>
                  <a
                      href="/portal/admin/slides/create"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-b-lg"
                  >
                    Create Slide
                  </a>
                </li>
              </ul>
          )}

        </li>
        <li className="relative">
          <button
              onClick={toggleEventsDropdown}
              className="hover:underline text-gray-700 font-medium"
          >
            Manage Events
          </button>
          {isEventsDropdownOpen && (
              <ul className="absolute bg-white border rounded-lg mt-2 shadow-lg z-50 w-48">
                <li>
                  <a
                      href="/portal/admin/events/view"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-t-lg"
                  >
                    View and Edit Events
                  </a>
                </li>
                <li>
                  <a
                      href="/portal/admin/events/add"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-b-lg"
                  >
                    Add Event
                  </a>
                </li>
              </ul>
          )}

        </li>
      </ul>
    </nav>
  );
};

const ProfSubNavbar = () => (
    <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
      <ul className="flex space-x-4">
        <li>
          <a href="/portal/teacher/courses" className="hover:underline">
            My Courses
          </a>
        </li>
        <li>
          <a href="/portal/teacher/schedule" className="hover:underline">
            Schedule
          </a>
        </li>
      </ul>
    </nav>
);

const EleveSubNavbar = () => (
    <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
      <ul className="flex space-x-4">
        <li>
          <a href="/portal/student/courses" className="hover:underline">
            My Courses
          </a>
        </li>
        <li>
          <a href="/portal/student/schedule" className="hover:underline">
            Schedule
          </a>
        </li>
      </ul>
    </nav>
);

export default SubNavbar;
