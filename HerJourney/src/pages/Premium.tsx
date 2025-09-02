/**
 * Premium features and upgrade page
 */

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Unlock,
  FileText,
  Calendar,
  MessageCircle,
  MapPin,
  Check,
  Crown,
} from "lucide-react";

const Premium = () => {
  const { state, isPremium, enablePremium } = useApp();
  const [demoCode, setDemoCode] = useState("");
  const [apiKeys, setApiKeys] = useState({
    openai: state.keys.openaiApiKey || "",
    mapbox: state.keys.mapboxToken || "",
  });

  const handleEnableDemo = () => {
    if (demoCode === "PREMIUM-ACCESS") {
      enablePremium();
    }
  };

  const premiumFeatures = [
    {
      icon: FileText,
      title: "Smart Notes & Journal",
      description: "Keep detailed daily notes with tags, search, and favorites",
      available: isPremium,
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Sync appointments and milestones to your calendar",
      available: isPremium,
    },
    {
      icon: MessageCircle,
      title: "AI Health Assistant",
      description:
        "Get personalized answers to your pregnancy questions any time",
      available: isPremium && !!state.keys.openaiApiKey,
    },
    {
      icon: MapPin,
      title: "Clinic Finder",
      description: "Find nearby hospitals, clinics, and healthcare providers",
      available: isPremium,
    },
  ];

  if (isPremium) {
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
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-semibold text-card-foreground">
                    Premium
                  </h1>
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Manage your premium features
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Premium Status */}
          <Card className="shadow-card border-0 bg-gradient-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Premium Active!</h2>
                <p className="text-primary-foreground/80">
                  You are enjoying all premium features. Thank you for
                  supporting HerJourney!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Setup */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>API Keys Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openai-key">
                  OpenAI API Key (for AI features)
                </Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKeys.openai}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, openai: e.target.value })
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for AI health assistant. Get your key from OpenAI.
                </p>
              </div>

              <div>
                <Label htmlFor="mapbox-key">Mapbox Token (for maps)</Label>
                <Input
                  id="mapbox-key"
                  type="password"
                  placeholder="pk...."
                  value={apiKeys.mapbox}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, mapbox: e.target.value })
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. Improves map quality in clinic finder.
                </p>
              </div>

              <Button className="w-full">Save API Keys</Button>
            </CardContent>
          </Card>

          {/* Premium Features Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="shadow-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        feature.available
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-card-foreground">
                          {feature.title}
                        </h3>
                        {feature.available ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                      {feature.title === "AI Health Assistant" &&
                        !state.keys.openaiApiKey && (
                          <p className="text-xs text-warning mt-1">
                            Requires OpenAI API key
                          </p>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Access to Premium Features */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col" asChild>
                  <Link to="/notes">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-xs">Notes</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col" asChild>
                  <Link to="/calendar">
                    <Calendar className="w-5 h-5 mb-1" />
                    <span className="text-xs">Calendar</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col" asChild>
                  <Link to="/ai">
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="text-xs">AI Chat</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col" asChild>
                  <Link to="/clinics">
                    <MapPin className="w-5 h-5 mb-1" />
                    <span className="text-xs">Find Clinics</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Navigation Spacer */}
          <div className="h-20" />
        </div>
      </div>
    );
  }

  // Pricing plans data
  const pricingPlans = [
    {
      name: "Free",
      price: "KES 0/mo",
      privileges: ["Smart Tracker", "Basic Calendar", "Weekly Insights"],
      description: "Essential features for your journey, free forever",
    },
    {
      name: "Plus",
      price: "KES 2,000/mo",
      privileges: [
        "All Basic features",
        "AI Health Assistant",
        "Clinic Finder",
      ],
      description: "Advanced features and AI support",
    },
    {
      name: "Pro",
      price: "KES 5,000/mo",
      privileges: [
        "All Plus features",
        "Free Support & consultation",
        "Early Access to New Features",
      ],
      description: "Full access and premium support",
    },
  ];

  // Handle plan selection
  const handleSelectPlan = (planName: string) => {
    // Redirect to checkout page with selected plan
    window.location.href = `/checkout?plan=${encodeURIComponent(planName)}`;
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
              <h1 className="text-2xl font-semibold text-card-foreground">
                Premium Features
              </h1>
              <p className="text-muted-foreground">
                Unlock advanced capabilities
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Card */}
        <Card className="shadow-elevated border-0 bg-gradient-primary text-primary-foreground">
          <CardContent className="pt-8 pb-8 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Unlock Premium</h2>
            <p className="text-primary-foreground/80 text-lg mb-6">
              Get access to advanced features for your pregnancy journey
            </p>
          </CardContent>
        </Card>

        {/* Pricing Plans Section */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-primary" />
              <span>Choose Your Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, idx) => (
                <div
                  key={plan.name}
                  className="border rounded-xl p-6 bg-card flex flex-col items-center shadow-card"
                >
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-semibold text-primary mb-2">
                    {plan.price}
                  </div>
                  <p className="text-muted-foreground mb-4 text-center">
                    {plan.description}
                  </p>
                  <ul className="mb-4 text-left w-full">
                    {plan.privileges.map((priv, i) => (
                      <li key={i} className="flex items-center mb-1">
                        <Check className="w-4 h-4 text-success mr-2" />
                        <span className="text-sm text-card-foreground">
                          {priv}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Access */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Unlock className="w-5 h-5 text-primary" />
              <span>Gain Premium Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Try HerJourney premium features using the 1 day free trial we sent
              to your email:
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter demo code"
                value={demoCode}
                onChange={(e) => setDemoCode(e.target.value)}
              />
              <Button
                onClick={handleEnableDemo}
                disabled={demoCode !== "PREMIUM-ACCESS"}
              >
                Activate
              </Button>
            </div>
            <div className="p-3 bg-accent/20 rounded-lg">
              <p className="text-sm text-card-foreground">
                💡 <strong>Example Code:</strong> PREMIUM-ACCESS
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="shadow-card border-0 relative">
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <feature.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Navigation Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Premium;
