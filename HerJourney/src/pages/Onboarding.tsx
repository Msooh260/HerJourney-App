/**
 * Onboarding flow for new users
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { calculatePregnancy } from '@/lib/pregnancy';
import { Heart, Baby } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useApp();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isPregnant: null as boolean | null,
    lmp: '',
    edd: '',
    cycleLength: 28,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Save user data
    updateUser({
      name: formData.name || undefined,
      email: formData.email || undefined,
      isPregnant: formData.isPregnant || false,
      lmp: formData.lmp || undefined,
      edd: formData.edd || undefined,
      cycleLength: formData.cycleLength,
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.isPregnant !== null;
      case 2:
        if (formData.isPregnant) {
          return formData.lmp || formData.edd;
        }
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Preview calculation for step 2
  const previewData = formData.isPregnant && (formData.lmp || formData.edd) 
    ? calculatePregnancy(formData.lmp, formData.edd, formData.cycleLength)
    : null;

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-card-medium'
              }`}
            />
          ))}
        </div>

        <Card className="shadow-elevated border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              {step === 1 ? <Heart className="w-8 h-8 text-white" /> : <Baby className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-2xl text-card-foreground">
              {step === 1 && "Welcome to Her Journey"}
              {step === 2 && "Tell us more"}
              {step === 3 && "Almost done!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-card-foreground mb-4 block">
                    Are you currently pregnant?
                  </Label>
                  <RadioGroup
                    value={formData.isPregnant?.toString()}
                    onValueChange={(value) => 
                      setFormData({ ...formData, isPregnant: value === 'true' })
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/20 transition-colors">
                      <RadioGroupItem value="true" id="pregnant" />
                      <Label htmlFor="pregnant" className="flex-1 cursor-pointer">
                        Yes, I'm pregnant 🤱
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/20 transition-colors">
                      <RadioGroupItem value="false" id="not-pregnant" />
                      <Label htmlFor="not-pregnant" className="flex-1 cursor-pointer">
                        No, I'm tracking my cycle 📅
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
                    What should we call you? (optional)
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                    Email address (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                </div>

                {formData.isPregnant ? (
                  <>
                    <div>
                      <Label htmlFor="lmp" className="text-sm font-medium text-card-foreground">
                        Last Menstrual Period (LMP)
                      </Label>
                      <Input
                        id="lmp"
                        type="date"
                        value={formData.lmp}
                        onChange={(e) => setFormData({ ...formData, lmp: e.target.value, edd: '' })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="text-center text-muted-foreground">or</div>
                    
                    <div>
                      <Label htmlFor="edd" className="text-sm font-medium text-card-foreground">
                        Due Date (if known)
                      </Label>
                      <Input
                        id="edd"
                        type="date"
                        value={formData.edd}
                        onChange={(e) => setFormData({ ...formData, edd: e.target.value, lmp: '' })}
                        className="mt-2"
                      />
                    </div>

                    {previewData && (
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">
                          Preview: You're in week {previewData.gestationalWeeks} of your pregnancy! 🎉
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <Label htmlFor="cycle-length" className="text-sm font-medium text-card-foreground">
                      Average cycle length (days)
                    </Label>
                    <Input
                      id="cycle-length"
                      type="number"
                      min="21"
                      max="45"
                      value={formData.cycleLength}
                      onChange={(e) => setFormData({ ...formData, cycleLength: parseInt(e.target.value) || 28 })}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🌸</div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  You're all set!
                </h3>
                <p className="text-muted-foreground">
                  Let's begin your journey together. We're here to support you every step of the way.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="ml-auto"
              >
                {step === 3 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;