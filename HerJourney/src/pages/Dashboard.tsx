/**
 * Main dashboard page
 */

import { useApp } from "@/contexts/AppContext";
import {
  calculatePregnancy,
  calculatePeriodData,
  getFruitForWeek,
  getWeekDisplayText,
} from "@/lib/pregnancy";
import { getTipsForWeek, getGeneralTips } from "@/data/weeklyTips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Heart,
  Calendar,
  TrendingUp,
  Sparkles,
  Lock,
  ChevronRight,
  Baby,
  Apple,
  User,
} from "lucide-react";

// Import fruit illustrations
import limeImage from "@/assets/illustrations/lime.png";
import avocadoImage from "@/assets/illustrations/avocado.png";

const Dashboard = () => {
  const { state, isPregnant, isPremium } = useApp();
  const { user } = state;

  // Calculate pregnancy or period data
  const pregnancyData = isPregnant
    ? calculatePregnancy(user.lmp, user.edd, user.cycleLength)
    : null;

  const periodData =
    !isPregnant && user.lmp
      ? calculatePeriodData(user.lmp, user.cycleLength)
      : null;

  // Get appropriate tips
  const tips =
    isPregnant && pregnancyData
      ? getTipsForWeek(pregnancyData.gestationalWeeks)
      : getGeneralTips();

  // Get fruit info for current week
  const fruitInfo =
    isPregnant && pregnancyData
      ? getFruitForWeek(pregnancyData.gestationalWeeks)
      : null;

  // Choose fruit image based on week (simplified for now)
  const getFruitImage = (week: number) => {
    if (week <= 12) return limeImage;
    if (week <= 20) return avocadoImage;
    return limeImage; // Default fallback
  };

  const greeting = user.name ? `Hello, ${user.name}!` : "Hello there!";

  // Helper to check valid email
  const isValidEmail = (email?: string) => {
    return !!email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-card/60 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">
                  {greeting}
                </h1>
                <p className="text-muted-foreground">
                  {isPregnant
                    ? "Your pregnancy journey"
                    : "Your cycle tracking"}
                </p>
              </div>
            </div>
            {isValidEmail(user?.email) ? (
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              </Link>
            ) : (
              <Link to="/onboarding">
                <Button variant="default" size="sm">
                  Set Up Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Main Status Card */}
        {isPregnant && pregnancyData ? (
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                  <img
                    src={getFruitImage(pregnancyData.gestationalWeeks)}
                    alt={fruitInfo?.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-primary-foreground"
                    >
                      {pregnancyData.trimester === 1 && "1st Trimester"}
                      {pregnancyData.trimester === 2 && "2nd Trimester"}
                      {pregnancyData.trimester === 3 && "3rd Trimester"}
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold text-primary-foreground mb-1">
                    {getWeekDisplayText(pregnancyData)}
                  </h2>
                  <p className="text-primary-foreground/80 text-lg">
                    Your baby is the size of {fruitInfo?.name?.toLowerCase()}
                  </p>
                  <p className="text-primary-foreground/60 text-sm mt-1">
                    {fruitInfo?.description}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-primary-foreground/80 mb-2">
                  <span>Pregnancy Progress</span>
                  <span>{Math.round(pregnancyData.weekProgress)}%</span>
                </div>
                <Progress
                  value={pregnancyData.weekProgress}
                  className="bg-white/20"
                />
              </div>
            </CardContent>
          </Card>
        ) : periodData ? (
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                    Cycle Tracking
                  </h2>
                  {periodData.nextPeriod && (
                    <p className="text-primary-foreground/80 text-lg">
                      Next period in {periodData.daysUntilNextPeriod} days
                    </p>
                  )}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-primary-foreground/80 mb-2">
                      <span>Cycle Progress</span>
                      <span>{Math.round(periodData.cycleProgress)}%</span>
                    </div>
                    <Progress
                      value={periodData.cycleProgress}
                      className="bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="pt-6 text-center">
              <Baby className="w-16 h-16 mx-auto mb-4 text-primary-foreground" />
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                Ready to start tracking?
              </h2>
              <p className="text-primary-foreground/80 mb-4">
                Complete your profile to get personalized insights
              </p>
              <Link to="/onboarding">
                <Button variant="secondary">Start your journey</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/tracker">
            <Card className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-card-foreground">Tracker</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Log symptoms & milestones
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tips">
            <Card className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Apple className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-card-foreground">Tips</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Weekly guidance & advice
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/analyzer">
            <Card className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-card-foreground">Analyzer</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Health insights & trends
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/premium">
            <Card className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
                  {!isPremium && (
                    <Lock className="w-4 h-4 absolute -top-1 -right-1 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-card-foreground">Premium</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isPremium ? "Advanced features" : "Unlock more features"}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* This Week's Tips */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isPregnant ? "This Week's Tips" : "Helpful Tips"}</span>
              <Link to="/tips">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tips.slice(0, 3).map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-accent/20"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-card-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation Spacer */}
        <div className="h-20" />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/dashboard"
              className="flex flex-col items-center space-y-1 p-2"
            >
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary">
                Dashboard
              </span>
            </Link>
            <Link
              to="/tracker"
              className="flex flex-col items-center space-y-1 p-2"
            >
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tracker</span>
            </Link>
            <Link
              to="/tips"
              className="flex flex-col items-center space-y-1 p-2"
            >
              <Apple className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tips</span>
            </Link>
            <Link
              to="/analyzer"
              className="flex flex-col items-center space-y-1 p-2"
            >
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Analyzer</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
