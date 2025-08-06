import { useEffect, useState } from "react";
import { Plus, MapPin, Calendar, Users, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import axios from "@/api/axiosInstance";

import LocationMap from "@/components/LocationMap";
import { OpenStreetMapProvider } from "leaflet-geosearch";

interface TripData {
  tripId?: number; // Ensure tripId is optional
  destination: string;
  startDate: string;
  endDate: string;
  budget: number | null;
  transport: string[];
}

interface DayActivity {
  id: string;
  time: string;
  activity: string;
  location: string;
  notes?: string;
  estimatedCost?: number;
  date?: string; // Needed for grouping on fetch
}

interface DayPlan {
  date: string;
  activities: DayActivity[];
}

const TripPlanner = ({ tripData }: { tripData: TripData }) => {
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [newActivity, setNewActivity] = useState({
    time: "",
    activity: "",
    location: "",
    notes: "",
    estimatedCost: ""
  });
  const [selectedDate, setSelectedDate] = useState("");

  // Map state for trip destination
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [destinationLabel, setDestinationLabel] = useState<string>("");

  // Map state for activity location input
  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);
  const [mapLabel, setMapLabel] = useState<string>("");

  const generateDateRange = () => {
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }
    return dates;
  };

  const dates = generateDateRange();

  // Geocode trip destination on mount or when tripData.destination changes
  useEffect(() => {
    if (!tripData.destination) return;

    const provider = new OpenStreetMapProvider();
    provider
      .search({ query: tripData.destination })
      .then((results) => {
        if (results.length > 0) {
          const { x: lng, y: lat, label } = results[0];
          setDestinationCoords([lat, lng]);
          setDestinationLabel(label);
        }
      })
      .catch((err) => {
        console.error("Error geocoding destination:", err);
      });
  }, [tripData.destination]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!tripData?.tripId) return;
      try {
        const response = await axios.get(`http://localhost:1833/api/activities/${tripData.tripId}`);
        const activities: DayActivity[] = response.data.activities;

        const groupedByDate: Record<string, DayActivity[]> = {};
        activities.forEach((act) => {
          if (!act.date) return;
          if (!groupedByDate[act.date]) groupedByDate[act.date] = [];
          groupedByDate[act.date].push(act);
        });

        const result: DayPlan[] = Object.keys(groupedByDate).map((date) => ({
          date,
          activities: groupedByDate[date]
        }));

        setItinerary(result);
      } catch (err) {
        console.error("Error loading activities:", err);
      }
    };

    fetchActivities();
  }, [tripData?.tripId]);

  const addActivity = async () => {
    if (!selectedDate || !newActivity.activity) return;

    try {
      const response = await axios.post("http://localhost:1833/api/activities", {
        trip_id: tripData.tripId,
        date: selectedDate,
        time: newActivity.time,
        activity: newActivity.activity,
        location: newActivity.location,
        notes: newActivity.notes,
        estimated_cost: newActivity.estimatedCost ? parseFloat(newActivity.estimatedCost) : null
      });

      const activity: DayActivity = {
        id: response.data.activityId,
        ...newActivity,
        estimatedCost: newActivity.estimatedCost ? parseFloat(newActivity.estimatedCost) : undefined
      };

      setItinerary((prev) => {
        const existingDay = prev.find((day) => day.date === selectedDate);
        if (existingDay) {
          return prev.map((day) =>
            day.date === selectedDate
              ? { ...day, activities: [...day.activities, activity] }
              : day
          );
        } else {
          return [...prev, { date: selectedDate, activities: [activity] }];
        }
      });

      setNewActivity({
        time: "",
        activity: "",
        location: "",
        notes: "",
        estimatedCost: ""
      });
    } catch (err) {
      console.error("Error adding activity:", err);
    }
  };

  const removeActivity = async (date: string, activityId: string) => {
    try {
      await axios.delete(`http://localhost:1833/api/activities/${activityId}`);

      setItinerary((prev) =>
        prev
          .map((day) =>
            day.date === date
              ? {
                  ...day,
                  activities: day.activities.filter((a) => a.id !== activityId)
                }
              : day
          )
          .filter((day) => day.activities.length > 0)
      );
    } catch (err) {
      console.error("Error removing activity:", err);
    }
  };

  const getTotalCost = () => {
    return itinerary.reduce((total, day) => {
      return (
        total +
        day.activities.reduce((dayTotal, activity) => {
          return dayTotal + (activity.estimatedCost || 0);
        }, 0)
      );
    }, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      {/* Trip Overview */}
      <Card className="shadow-card-travel bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-2xl text-travel-blue flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Trip to {tripData.destination}
          </CardTitle>
        </CardHeader>
        {selectedDate && (
          <p className="text-sm text-muted-foreground">
            Selected Date: <span className="font-medium">{formatDate(selectedDate)}</span>
          </p>
        )}

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-travel-orange" />
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{dates.length} days</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-travel-orange" />
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-semibold">${tripData.budget || "No limit"}</p>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-travel-orange" />
              <p className="text-sm text-muted-foreground">Planned Cost</p>
              <p className="font-semibold">${getTotalCost()}</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 mx-auto mb-2 flex gap-1">
                {tripData.transport.map((t) => (
                  <div key={t} className="w-2 h-6 bg-travel-orange rounded"></div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Transport</p>
              <p className="font-semibold">{tripData.transport.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map showing trip destination */}
      {destinationCoords && (
        <Card className="shadow-card-travel">
          <CardHeader>
            <CardTitle>Destination Location</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationMap coords={destinationCoords} label={destinationLabel} />
          </CardContent>
        </Card>
      )}

      {/* Add Activity Form */}
      <Card className="shadow-card-travel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-travel-blue" />
            Add Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Select a date</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity((prev) => ({ ...prev, time: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Activity</label>
              <Input
                placeholder="What will you do?"
                value={newActivity.activity}
                onChange={(e) => setNewActivity((prev) => ({ ...prev, activity: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Where?"
                value={newActivity.location}
                onChange={(e) =>
                  setNewActivity((prev) => ({ ...prev, location: e.target.value }))
                }
                onBlur={async () => {
                  if (!newActivity.location) return;
                  const provider = new OpenStreetMapProvider();
                  try {
                    const results = await provider.search({ query: newActivity.location });
                    if (results.length > 0) {
                      const { x: lng, y: lat, label } = results[0];
                      setMapCoords([lat, lng]);
                      setMapLabel(label);
                    }
                  } catch (err) {
                    console.error("Geocode failed:", err);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Additional notes"
              value={newActivity.notes}
              onChange={(e) => setNewActivity((prev) => ({ ...prev, notes: e.target.value }))}
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Estimated Cost</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="USD"
              value={newActivity.estimatedCost}
              onChange={(e) => setNewActivity((prev) => ({ ...prev, estimatedCost: e.target.value }))}
              className="mt-1"
            />
          </div>

          <Button
            onClick={addActivity}
            disabled={!selectedDate || !newActivity.activity}
            className="w-full"
          >
            Add Activity
          </Button>
        </CardContent>
      </Card>

      {/* Itinerary list */}
      <div className="space-y-4">
        {itinerary
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((dayPlan) => (
            <Card key={dayPlan.date} className="shadow-card-travel">
              <CardHeader>
                <CardTitle>{formatDate(dayPlan.date)}</CardTitle>
              </CardHeader>
              <CardContent>
                {dayPlan.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-b border-muted py-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {activity.time} - {activity.activity}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.location}</p>
                      {activity.notes && (
                        <p className="text-xs text-muted-foreground italic">{activity.notes}</p>
                      )}
                      {activity.estimatedCost !== undefined && (
                        <Badge className="mt-1">${activity.estimatedCost.toFixed(2)}</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(dayPlan.date, activity.id)}
                      aria-label="Remove activity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default TripPlanner;
