import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Constants for data mapping
const GENERATION_LABELS = {
  1: "1930-39",
  2: "1940-49",
  3: "1950-59",
  4: "1960-69",
  5: "1970-79",
  6: "1980-86"
};

const EDUCATION_LABELS = {
  1: "High",
  2: "Middle",
  3: "Low"
};

const LOCATION_LABELS = {
  1: "Regional Center",
  2: "City/Rural City",
  3: "Rural Area"
};

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
      <h1 className="text-3xl font-bold mb-8">GGS Data Analysis</h1>

      <div className="grid gap-6">
        {/* Gender Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-blue-100">
                <h3 className="text-lg font-semibold text-blue-700">Men</h3>
                <p className="text-2xl font-bold text-blue-900">{genderStats.male}</p>
              </div>
              <div className="p-4 rounded-lg bg-pink-100">
                <h3 className="text-lg font-semibold text-pink-700">Women</h3>
                <p className="text-2xl font-bold text-pink-900">{genderStats.female}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Analysis Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Male Events */}
          <Card>
            <CardHeader>
              <CardTitle>Men's Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventsByGender.male.map((event: any) => (
                  <div key={event.id} className="p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Generation</p>
                        <p className="font-medium">{GENERATION_LABELS[event.generations] || event.generations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="font-medium">{EDUCATION_LABELS[event.eduLevel] || event.eduLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{event.age} years</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Female Events */}
          <Card>
            <CardHeader>
              <CardTitle>Women's Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventsByGender.female.map((event: any) => (
                  <div key={event.id} className="p-4 bg-pink-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Generation</p>
                        <p className="font-medium">{GENERATION_LABELS[event.generations] || event.generations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="font-medium">{EDUCATION_LABELS[event.eduLevel] || event.eduLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{event.age} years</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}