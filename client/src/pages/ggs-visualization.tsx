import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

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

interface GGSRecord {
  ID: string;
  sex: string;
  generations: string;
  edu_level: string;
  age: string;
  [key: string]: string;
}

interface ProcessedData {
  genderStats: {
    male: number;
    female: number;
  };
  generationData: {
    male: { name: string; count: number }[];
    female: { name: string; count: number }[];
  };
  educationData: {
    male: { name: string; count: number }[];
    female: { name: string; count: number }[];
  };
}

export default function GGSVisualization() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCSVData = (records: GGSRecord[]) => {
      const genderStats = { male: 0, female: 0 };
      const maleGenerations = Array(6).fill(0);
      const femaleGenerations = Array(6).fill(0);
      const maleEducation = Array(3).fill(0);
      const femaleEducation = Array(3).fill(0);

      records.forEach(record => {
        const sex = parseInt(record.sex);
        const generation = parseInt(record.generations);
        const education = parseInt(record.edu_level);

        // Process gender stats
        if (sex === 1) genderStats.male++;
        if (sex === 2) genderStats.female++;

        // Process generation data
        if (sex === 1 && generation >= 1 && generation <= 6) {
          maleGenerations[generation - 1]++;
        }
        if (sex === 2 && generation >= 1 && generation <= 6) {
          femaleGenerations[generation - 1]++;
        }

        // Process education data
        if (sex === 1 && education >= 1 && education <= 3) {
          maleEducation[education - 1]++;
        }
        if (sex === 2 && education >= 1 && education <= 3) {
          femaleEducation[education - 1]++;
        }
      });

      const processedData: ProcessedData = {
        genderStats,
        generationData: {
          male: Object.entries(GENERATION_LABELS).map(([key, label]) => ({
            name: label,
            count: maleGenerations[parseInt(key) - 1]
          })),
          female: Object.entries(GENERATION_LABELS).map(([key, label]) => ({
            name: label,
            count: femaleGenerations[parseInt(key) - 1]
          }))
        },
        educationData: {
          male: Object.entries(EDUCATION_LABELS).map(([key, label]) => ({
            name: label,
            count: maleEducation[parseInt(key) - 1]
          })),
          female: Object.entries(EDUCATION_LABELS).map(([key, label]) => ({
            name: label,
            count: femaleEducation[parseInt(key) - 1]
          }))
        }
      };

      return processedData;
    };

    const loadCSVData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/GGS_new.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const processedData = processCSVData(results.data as GGSRecord[]);
            setData(processedData);
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError('Failed to parse CSV data');
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setError('Failed to load CSV data');
        setIsLoading(false);
      }
    };

    loadCSVData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          {error || 'Failed to load data'}
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-blue-900">{data.genderStats.male}</p>
              </div>
              <div className="p-4 rounded-lg bg-pink-100">
                <h3 className="text-lg font-semibold text-pink-700">Women</h3>
                <p className="text-2xl font-bold text-pink-900">{data.genderStats.female}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    data={data.generationData.male}
                    type="monotone"
                    dataKey="count"
                    name="Men"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    data={data.generationData.female}
                    type="monotone"
                    dataKey="count"
                    name="Women"
                    stroke="#ec4899"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Education Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Education Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...data.educationData.male, ...data.educationData.female]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Men" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="count" name="Women" fill="#ec4899" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}