/**
 * Pregnancy/Period tracking page
 */

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { calculatePregnancy, getFruitForWeek } from '@/lib/pregnancy';
import { saveSymptoms, getSymptomHistory } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Baby, 
  Heart,
  Smile,
  Frown,
  Meh,
  Plus
} from 'lucide-react';

const Tracker = () => {
  const { state, isPregnant } = useApp();
  const { user } = state;
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const pregnancyData = isPregnant 
    ? calculatePregnancy(user.lmp, user.edd, user.cycleLength)
    : null;

  const pregnancySymptoms = [
    'Nausea', 'Fatigue', 'Breast Tenderness', 'Cravings',
    'Mood Swings', 'Headaches', 'Back Pain', 'Heartburn',
    'Frequent Urination', 'Constipation', 'Leg Cramps', 'Insomnia'
  ];

  const periodSymptoms = [
    'Cramps', 'Bloating', 'Mood Changes', 'Fatigue',
    'Headaches', 'Acne', 'Breast Tenderness', 'Back Pain',
    'Food Cravings', 'Irritability', 'Sleep Issues'
  ];

  const symptoms = isPregnant ? pregnancySymptoms : periodSymptoms;

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const saveTodaySymptoms = () => {
    const today = new Date().toISOString().split('T')[0];
    saveSymptoms(today, selectedSymptoms);
    setSelectedSymptoms([]);
  };

  const symptomHistory = getSymptomHistory();

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-card/60 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-card-foreground">
                {isPregnant ? 'Pregnancy Tracker' : 'Cycle Tracker'}
              </h1>
              <p className="text-muted-foreground">Track your journey</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Current Status */}
        {isPregnant && pregnancyData ? (
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground mb-1">
                    Week {pregnancyData.gestationalWeeks}, Day {pregnancyData.dayInWeek}
                  </h2>
                  <p className="text-muted-foreground">
                    Baby size: {getFruitForWeek(pregnancyData.gestationalWeeks).name}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    Trimester {pregnancyData.trimester}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Cycle Day Tracking
                  </h2>
                  <p className="text-muted-foreground">
                    Monitor your monthly cycle
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Quick Log */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>How are you feeling today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-accent/20 transition-colors">
                    <Smile className="w-8 h-8 text-success" />
                    <span className="text-sm">Great</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-accent/20 transition-colors">
                    <Meh className="w-8 h-8 text-warning" />
                    <span className="text-sm">Okay</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-accent/20 transition-colors">
                    <Frown className="w-8 h-8 text-destructive" />
                    <span className="text-sm">Not great</span>
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-card-foreground mb-3">
                    Any symptoms today?
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedSymptoms.includes(symptom)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border hover:bg-accent/20'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSymptoms.length > 0 && (
                  <div className="mt-6">
                    <Button onClick={saveTodaySymptoms} className="w-full">
                      Save Today's Log
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Baby className="w-5 h-5 text-primary" />
                  <span>
                    {isPregnant ? 'Pregnancy Timeline' : 'Cycle Timeline'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">
                          {isPregnant ? `Week ${40 - i}` : `Day ${28 - i}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isPregnant 
                            ? `Milestone: ${getFruitForWeek(40 - i).name}`
                            : 'Cycle event'
                          }
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {i === 0 ? 'Today' : `${i + 1} ${isPregnant ? 'weeks' : 'days'} ago`}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent>
                {symptomHistory.length > 0 ? (
                  <div className="space-y-3">
                    {symptomHistory.slice(0, 10).map(({ date, symptoms }) => (
                      <div key={date} className="p-4 bg-accent/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-card-foreground">
                            {new Date(date).toLocaleDateString()}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {symptoms.map((symptom) => (
                            <Badge key={symptom} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium text-card-foreground mb-2">
                      No history yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start logging your daily symptoms to see trends over time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation Spacer */}
        <div className="h-20" />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link to="/dashboard" className="flex flex-col items-center space-y-1 p-2">
              <Heart className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </Link>
            <Link to="/tracker" className="flex flex-col items-center space-y-1 p-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary">Tracker</span>
            </Link>
            <Link to="/tips" className="flex flex-col items-center space-y-1 p-2">
              <Baby className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tips</span>
            </Link>
            <Link to="/analyzer" className="flex flex-col items-center space-y-1 p-2">
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Analyzer</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Tracker;