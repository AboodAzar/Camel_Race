"use client";
import { useState, useEffect } from "react";
import { CreateEventForm } from "../event/EventsForm";
import { ShowEvents } from "../show-events";
import { ShowUsers } from "../users";
import { ShowSupers } from "../getSuper";
import { FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import { RedirectButton } from "../auth/redirect-button";
import SearchBar from "./SearchBar";

interface DashboardProps {
  role: string;
}

const AdminDashboard: React.FC<DashboardProps> = ({ role }) => {
  const [isEventFormOpen, setEventFormOpen] = useState(false);

  useEffect(() => {
    if (isEventFormOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }
  }, [isEventFormOpen]);

  const toggleEventForm = () => setEventFormOpen((prev) => !prev);

  return (
    <div className="flex flex-1">
      <div
        className={`p-2 md:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full`}
      >
        <div className="flex">
          <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center py-1 px-4 gap-2">
            <RedirectButton path="/auth/register">
              <Button>
                <FaPlus /> انشاء مستخدم
              </Button>
            </RedirectButton>
            <SearchBar />
          </div>
        </div>

        {role === "ADMIN" && (
          <div className="flex gap-2 max-lg:flex-col">
            <div className="h-[30rem] w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col items-end py-1 px-4">
              <h2 className="w-full flex justify-end text-3xl font-semibold my-2">
                : المشرفين
              </h2>
              <div className="w-full h-full bg-gray-200 rounded-lg p-2 overflow-y-scroll">
                <ShowSupers />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 max-lg:flex-col">
          <div className="h-[30rem] w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col items-end py-1 px-4">
            <h2 className="w-full flex justify-end text-3xl font-semibold my-2">
              : المستخدمين
            </h2>
            <div className="w-full h-full bg-gray-200 rounded-lg p-2 overflow-y-scroll">
              <ShowUsers />
            </div>
          </div>
        </div>

        <div className="flex gap-2 max-lg:flex-col">
          <div className="h-[30rem] w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col items-end py-1 px-4">
            {isEventFormOpen && <CreateEventForm onClose={toggleEventForm} />}
            <div className="w-full flex justify-between items-center px-5 my-2">
              <Button onClick={toggleEventForm}>
                <FaPlus />
                {isEventFormOpen ? "إغلاق" : "إضافة فعالية"}
              </Button>
              <h2 className="text-3xl font-semibold my-2">: الفعاليات</h2>
            </div>
            <div className="w-full h-full bg-gray-200 rounded-lg p-2 overflow-y-scroll">
              <ShowEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;