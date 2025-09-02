/**
 * Health analyzer page with risk assessment
 */

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { analyzeHealthInputs, getAnalyzerLevelColor, getAnalyzerLevelText } from '@/lib/analyzer';
import { AnalyzerEntry } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Heart,
  Calendar,
  Apple,
  Plus,
  Activity
} from 'lucide-react';

const Analyzer = () => {
  const { state } = useApp();
  const [formData, setFormData] = useState<Partial<AnalyzerEntry>>({
    date: new Date().toISOString().split('T')[0],
    waterCups: 8,
    caffeineMg: 0,
    alcoholDrinks: 0,
    smoked: false,
    sleepHours: 8,
    exerciseMins: 30,
    prenatalVitamin: true,
    bleeding: false,
    fever: false,
    severePain: false,
    headachesVision: false,
    swelling: false,
  });

  const [result, setResult] = useState<ReturnType<typeof analyzeHealthInputs> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: AnalyzerEntry = {
      ...formData,
      date: formData.date!,
    };
    
    const analysisResult = analyzeHealthInputs(entry);
    setResult(analysisResult);
  };

  const resetForm = () => {
    setResult(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      waterCups: 8,
      caffeineMg: 0,
      alcoholDrinks: 0,
      smoked: false,
      sleepHours: 8,
      exerciseMins: 30,
      prenatalVitamin: true,
      bleeding: false,
      fever: false,
      severePain: false,
      headachesVision: false,
      swelling: false,
    });
  };

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
              <h1 className="text-2xl font-semibold text-card-foreground">Health Analyzer</h1>
              <p className="text-muted-foreground">Track your daily wellness</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Medical Disclaimer */}
        <Card className="shadow-card border-0 bg-warning/10 border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-warning mb-1">Important Notice</h3>
                <p className="text-sm text-card-foreground">
                  This analyzer provides educational information based on the information you provide and is not medical advice. 
                  Always consult with your healthcare provider for medical concerns or symptoms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {result ? (
          /* Analysis Results */
          <div className="space-y-6">
            <Card className={`shadow-card border-0 ${getAnalyzerLevelColor(result.level)}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Analysis</span>
                  <Badge variant="outline" className="border-current">
                    {getAnalyzerLevelText(result.level)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {result.messages.map((message, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        {result.level === 'ok' ? (
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-sm">{message}</p>
                      </div>
                    ))}
                  </div>
                  
                  {result.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <div className="space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <p key={index} className="text-sm pl-4 border-l-2 border-current/20">
                            {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Choose Another Day
              </Button>
              <Button className="flex-1">
                Save Results
              </Button>
            </div>
          </div>
        ) : (
          /* Health Input Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Daily Health Log</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="water">Water intake (cups)</Label>
                    <Input
                      id="water"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.waterCups || ''}
                      onChange={(e) => setFormData({ ...formData, waterCups: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="caffeine">Caffeine (mg)</Label>
                    <Input
                      id="caffeine"
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.caffeineMg || ''}
                      onChange={(e) => setFormData({ ...formData, caffeineMg: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sleep">Sleep (hours)</Label>
                    <Input
                      id="sleep"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={formData.sleepHours || ''}
                      onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="exercise">Exercise (minutes)</Label>
                    <Input
                      id="exercise"
                      type="number"
                      min="0"
                      max="600"
                      value={formData.exerciseMins || ''}
                      onChange={(e) => setFormData({ ...formData, exerciseMins: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Health Checks</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prenatal"
                      checked={formData.prenatalVitamin}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, prenatalVitamin: checked as boolean })
                      }
                    />
                    <Label htmlFor="prenatal" className="text-sm">
                      Took prenatal vitamin today
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smoked"
                      checked={formData.smoked}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, smoked: checked as boolean })
                      }
                    />
                    <Label htmlFor="smoked" className="text-sm">
                      Smoked today
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-destructive">
                    ⚠️ Concerning Symptoms (Check if experienced today)
                  </Label>
                  
                  {[
                    { key: 'bleeding', label: 'Unexpected bleeding' },
                    { key: 'fever', label: 'Fever' },
                    { key: 'severePain', label: 'Severe pain' },
                    { key: 'headachesVision', label: 'Severe headaches or vision changes' },
                    { key: 'swelling', label: 'Sudden swelling' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, [key]: checked as boolean })
                        }
                      />
                      <Label htmlFor={key} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Analyze My Health
            </Button>
          </form>
        )}

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
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tracker</span>
            </Link>
            <Link to="/tips" className="flex flex-col items-center space-y-1 p-2">
              <Apple className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tips</span>
            </Link>
            <Link to="/analyzer" className="flex flex-col items-center space-y-1 p-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary">Analyzer</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Analyzer;