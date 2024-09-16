import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Button } from "../ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import CreateLoopForm from "../Forms/loop-form";

interface Event {
  id: string;
  name: string;
  StartDate: string;
  EndDate: string;
}

interface Loop {
  eventId: string;
  id: string;
  capacity: number;
  age: string;
  sex: string;
  time: string;
  startRegister: string;
  endRegister: string;
}

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onClose }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loops, setLoops] = useState<Loop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateLoopModalOpen, setIsCreateLoopModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [editingLoop, setEditingLoop] = useState<Loop | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<boolean | null>(
    null
  );
  const [confirmDeleteLoop, setConfirmDeleteLoop] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error(`Event fetch error: ${eventResponse.statusText}`);
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        const loopsResponse = await fetch(`/api/events/${eventId}/getLoops`);
        if (!loopsResponse.ok) {
          throw new Error(`Loops fetch error: ${loopsResponse.statusText}`);
        }
        const loopsData = await loopsResponse.json();
        const filteredLoops = loopsData.filter(
          (loop: Loop) => loop.eventId === eventId
        );
        setLoops(filteredLoops || []);
      } catch (error: any) {
        console.error("Error fetching event details:", error);
        setError(
          `An error occurred while fetching event details: ${error.message}`
        );
      }
    };

    fetchEventData();
  }, [eventId]);

  const fetchLoops = async () => {
    try {
      const loopsResponse = await fetch(`/api/events/${eventId}/getLoops`);
      if (!loopsResponse.ok) {
        throw new Error(
          `Loops fetch error: ${loopsResponse.status} - ${loopsResponse.statusText}`
        );
      }
      const loopsData = await loopsResponse.json();
      const filteredLoops = loopsData.filter(
        (loop: Loop) => loop.eventId === eventId
      );
      setLoops(filteredLoops || []);
    } catch (error) {
      console.error("Error fetching loops:", error);
      setError(`An error occurred while fetching loops: ${error}`);
    }
  };

  const handleEditLoop = (loop: Loop) => {
    setEditingLoop(loop);
    setIsCreateLoopModalOpen(true);
  };

  const handleDeleteLoop = async (loopId: string) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/getLoops/${loopId}/deleteLoop`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete loop: ${response.statusText}`);
      }

      setLoops((prevLoops) => prevLoops.filter((loop) => loop.id !== loopId));
      setConfirmDeleteLoop(null);
    } catch (error: any) {
      console.error("Error deleting loop:", error);
      setError(`An error occurred while deleting the loop: ${error.message}`);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/deleteEvent`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }
      onClose();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      setError(`An error occurred while deleting the event: ${error.message}`);
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const response = await fetch(`/api/events/${eventId}/updateEvent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        setEvent(updatedEvent);
        setIsEditEventModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
    }
  };
  const handleUpdateLoop = async (loopId: string, loopData: Loop) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/getLoops/${loopId}/updateLoop`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loopData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update loop: ${response.statusText}`);
      }

      const updatedLoop = await response.json();
      setLoops((prevLoops) =>
        prevLoops.map((loop) => (loop.id === loopId ? updatedLoop : loop))
      );
    } catch (error: any) {
      console.error("Error updating loop:", error);
      setError(`An error occurred while updating the loop: ${error.message}`);
    }
  };

  function translateAge(Age: string) {
    switch (Age) {
      case "GradeOne":
        return "مفرد";
        break;
      case "GradeTwo":
        return "حقايق";
        break;
      case "GradeThree":
        return "لقايا";
        break;
      case "GradeFour":
        return "جذاع";
        break;
      case "GradeFive":
        return "ثنايا";
        break;
      case "GradeSixMale":
        return "زمول";
        break;
      case "GradeSixFemale":
        return "حيل";
    }
  }

  function translateSex(sex: string) {
    switch (sex) {
      case "Male":
        return "قعدان";
        break;
      case "Female":
        return "بكار";
        break;
      default:
        return "";
    }
  }

  function translateTime(time: string) {
    switch (time) {
      case "Morning":
        return "صباحي";
        break;
      case "Evening":
        return "مسائي";
        break;
      default:
        return "";
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 flex justify-between text-end">
          تفاصيل الحدث
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsEditEventModalOpen(true)}
              variant="outline"
            >
              <MdEdit className="mr-2" size={18} /> تعديل الحدث
            </Button>
            <Button
              onClick={() => setConfirmDeleteEvent(true)}
              variant="destructive"
            >
              <FaTrash className="mr-2" size={18} /> حذف الحدث
            </Button>
          </div>
        </h2>
        {event ? (
          <div className="text-end pb-4 pt-4">
            <p>
              <strong>الاسم:</strong> {event.name}
            </p>
            <p>
              <strong> تاريخ البدء:</strong>{" "}
              {new Date(event.StartDate).toLocaleString("en-GB").split(",")[0]}
            </p>
            <p>
              <strong> تاريخ الانتهاء :</strong>{" "}
              {new Date(event.EndDate).toLocaleString("en-GB").split(",")[0]}
            </p>

            <Table className="container text-right mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">الفئة / السن</TableHead>
                  <TableHead>سعة الشوط</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loops.length > 0 ? (
                  loops.map((loop) => (
                    <TableRow key={loop.id}>
                      <TableCell className="font-medium">
                        {translateAge(loop.age)}
                      </TableCell>
                      <TableCell>{loop.capacity}</TableCell>
                      <TableCell>{translateSex(loop.sex)}</TableCell>
                      <TableCell>{translateTime(loop.time)}</TableCell>
                      <TableCell>
                        {new Date(loop.startRegister).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(loop.endRegister).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleEditLoop(loop)}
                          className="text-blue-500"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteLoop(loop.id)}
                          className="text-red-500 ml-2"
                        >
                          <FaTrash size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      لا يوجد أشواط.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>جاري التحميل...</p>
        )}
        <div className="flex justify-between mt-5">
          <Button onClick={() => setIsCreateLoopModalOpen(true)}>
            إنشاء شوط
          </Button>
          <Button onClick={onClose} variant="outline">
            إغلاق
          </Button>
        </div>
      </div>

      {isCreateLoopModalOpen && (
        <CreateLoopForm
          eventId={eventId}
          onClose={() => {
            setIsCreateLoopModalOpen(false);
            fetchLoops();
          }}
          onAddLoop={(newLoop: Loop) =>
            setLoops((prevLoops) => [...prevLoops, newLoop])
          }
          onUpdateLoop={handleUpdateLoop}
          editingLoop={editingLoop}
        />
      )}

      {isEditEventModalOpen && event && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">
              تعديل الحدث
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const updatedEvent = {
                  id: event.id,
                  name: formData.get("name") as string,
                  StartDate: formData.get("StartDate") as string,
                  EndDate: formData.get("EndDate") as string,
                };
                handleUpdateEvent(updatedEvent);
              }}
            >
              <div className="mb-4 text-end">
                <label htmlFor="name" className="block font-medium mb-1">
                  اسم الحدث
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={event.name}
                  className="border border-gray-300 rounded p-2 w-full text-end"
                  required
                />
              </div>
              <div className="mb-4 text-end">
                <label htmlFor="StartDate" className="block font-medium mb-1">
                  تاريخ البدء
                </label>
                <input
                  type="datetime-local"
                  id="StartDate"
                  name="StartDate"
                  defaultValue={new Date(event.StartDate)
                    .toISOString()
                    .slice(0, 16)}
                  className="border border-gray-300 rounded p-2 w-full text-end"
                  required
                />
              </div>
              <div className="mb-4 text-end">
                <label htmlFor="EndDate" className="block font-medium mb-1">
                  تاريخ النهاية
                </label>
                <input
                  type="datetime-local"
                  id="EndDate"
                  name="EndDate"
                  defaultValue={new Date(event.EndDate)
                    .toISOString()
                    .slice(0, 16)}
                  className="border border-gray-300 rounded p-2 w-full text-end"
                  required
                />
              </div>
              <div className="flex justify-center gap-3">
                <Button type="submit" className="ml-2">
                  حفظ
                </Button>
                <Button
                  onClick={() => setIsEditEventModalOpen(false)}
                  variant="outline"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">
              تأكيد حذف الحدث
            </h3>
            <p className="mb-4 text-center">
              هل أنت متأكد أنك تريد حذف هذا الحدث؟
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={handleDeleteEvent} className="ml-2">
                نعم
              </Button>
              <Button
                onClick={() => setConfirmDeleteEvent(false)}
                variant="outline"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteLoop && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">
              تأكيد حذف الشوط
            </h3>
            <p className="mb-4 text-center">
              هل أنت متأكد أنك تريد حذف هذه الشوط؟
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => handleDeleteLoop(confirmDeleteLoop!)}
                className="ml-2"
              >
                نعم
              </Button>
              <Button
                onClick={() => setConfirmDeleteLoop(null)}
                variant="outline"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
