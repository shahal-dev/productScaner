import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function GGSVisualization() {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/statuses']
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { genderStats, eventsByGender } = data || { genderStats: { male: 0, female: 0 }, eventsByGender: { male: [], female: [] } };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">GGS Data Visualization</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-blue-100">
                <h3 className="text-lg font-semibold text-blue-700">Male</h3>
                <p className="text-2xl font-bold text-blue-900">{genderStats.male}</p>
              </div>
              <div className="p-4 rounded-lg bg-pink-100">
                <h3 className="text-lg font-semibold text-pink-700">Female</h3>
                <p className="text-2xl font-bold text-pink-900">{genderStats.female}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-700">Male Events</h3>
                <div className="space-y-2">
                  {eventsByGender.male.map((event) => (
                    <div key={event.id} className="p-3 bg-blue-50 rounded">
                      <p>Age: {event.age}</p>
                      <p>Generation: {event.generations}</p>
                      <p>Education Level: {event.eduLevel}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-pink-700">Female Events</h3>
                <div className="space-y-2">
                  {eventsByGender.female.map((event) => (
                    <div key={event.id} className="p-3 bg-pink-50 rounded">
                      <p>Age: {event.age}</p>
                      <p>Generation: {event.generations}</p>
                      <p>Education Level: {event.eduLevel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
