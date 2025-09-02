/**
 * Landing page - redirects based on user state
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, Heart, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { user } = state;

  useEffect(() => {
    // If user has completed onboarding, redirect to dashboard
    if (user.isPregnant !== undefined || user.lmp || user.edd) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-elevated">
            <Heart className="w-12 h-12 text-white" />
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-card-foreground mb-4">
              HerJourney
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your pregnancy & cycle companion
            </p>
            <p className="text-muted-foreground">
              Track your journey with personalized insights, tips, and support
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="shadow-card border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <Baby className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-card-foreground mb-2">Smart Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Weekly insights and beautiful visualizations
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-card-foreground mb-2">Health Analyzer</h3>
              <p className="text-sm text-muted-foreground">
                Evidence-based wellness insights
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-card-foreground mb-2">Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                AI assistance, notes, and calendar sync
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button size="lg" onClick={handleGetStarted} className="w-full md:w-auto px-8">
            Get Started Today
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Free to use • Privacy-first • No account required
          </p>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground bg-card/40 p-4 rounded-lg">
          <p>
            <strong>Medical Disclaimer:</strong> This app provides educational information only and is not a substitute for professional medical advice. Always consult with your healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
