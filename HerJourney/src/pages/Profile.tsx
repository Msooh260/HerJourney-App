/**
 * Profile and account management page
 */

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { deleteAccount } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Bell,
  Shield,
  Trash2,
  Download,
  Upload,
  Crown,
  Mail
} from 'lucide-react';

const Profile = () => {
  const { state, updateUser, updateSettings, isPremium } = useApp();
  const { user, settings } = state;
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    isPregnant: user.isPregnant,
    lmp: user.lmp || '',
    edd: user.edd || '',
    cycleLength: user.cycleLength || 28,
    emailSubscription: user.emailSubscription || false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = () => {
    updateUser({
      name: profile.name || undefined,
      email: profile.email || undefined,
      isPregnant: profile.isPregnant,
      lmp: profile.lmp || undefined,
      edd: profile.edd || undefined,
      cycleLength: profile.cycleLength,
      emailSubscription: profile.emailSubscription,
    });
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      deleteAccount();
      navigate('/onboarding');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `her-journey-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
              <h1 className="text-2xl font-semibold text-card-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Premium Status */}
        {isPremium && (
          <Card className="shadow-card border-0 bg-gradient-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Premium Active</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    You have access to all premium features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Settings */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email address (optional)</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Currently Pregnant</Label>
                <p className="text-sm text-muted-foreground">
                  This affects which features and tips you see
                </p>
              </div>
              <Switch
                checked={profile.isPregnant}
                onCheckedChange={(checked) => 
                  setProfile({ ...profile, isPregnant: checked })
                }
              />
            </div>

            {profile.isPregnant ? (
              <>
                <div>
                  <Label htmlFor="lmp">Last Menstrual Period</Label>
                  <Input
                    id="lmp"
                    type="date"
                    value={profile.lmp}
                    onChange={(e) => setProfile({ ...profile, lmp: e.target.value, edd: '' })}
                    className="mt-1"
                  />
                </div>
                
                <div className="text-center text-muted-foreground text-sm">or</div>
                
                <div>
                  <Label htmlFor="edd">Due Date (if known)</Label>
                  <Input
                    id="edd"
                    type="date"
                    value={profile.edd}
                    onChange={(e) => setProfile({ ...profile, edd: e.target.value, lmp: '' })}
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
                <Input
                  id="cycle-length"
                  type="number"
                  min="21"
                  max="45"
                  value={profile.cycleLength}
                  onChange={(e) => setProfile({ ...profile, cycleLength: parseInt(e.target.value) || 28 })}
                  className="mt-1"
                />
              </div>
            )}

            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>Email Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Weekly Tips</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly articles and health tips via email
                </p>
              </div>
              <Switch
                checked={profile.emailSubscription}
                onCheckedChange={(checked) => 
                  setProfile({ ...profile, emailSubscription: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>App Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Metric Units</Label>
                <p className="text-sm text-muted-foreground">
                  Use metric (kg, cm) instead of imperial (lbs, inches)
                </p>
              </div>
              <Switch
                checked={settings.units === 'metric'}
                onCheckedChange={(checked) => 
                  updateSettings({ units: checked ? 'metric' : 'imperial' })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use system setting or manual override
                </p>
              </div>
              <Switch
                checked={settings.theme === 'dark'}
                onCheckedChange={(checked) => 
                  updateSettings({ theme: checked ? 'dark' : 'light' })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Data & Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={exportData} className="h-16 flex-col">
                <Download className="w-5 h-5 mb-1" />
                <span className="text-sm">Export Data</span>
              </Button>
              
              <Button variant="outline" disabled className="h-16 flex-col">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-sm">Import Data</span>
              </Button>
            </div>

            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-3">
                This will permanently delete your account and all associated data. This action cannot be undone. Proceed with caution.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete Account'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="shadow-card border-0">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold text-card-foreground mb-2">Her Journey</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A pregnancy and cycle tracking companion built with love for moms-to-be and those tracking their cycles.
            </p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <Link to="/legal/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/legal/terms" className="hover:text-primary">Terms of Service</Link>
              <Link to="/legal/disclaimer" className="hover:text-primary">Medical Disclaimer</Link>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Profile;