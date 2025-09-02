/**
 * Tips and advice page
 */

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { calculatePregnancy } from '@/lib/pregnancy';
import { weeklyTips, getTipsForWeek } from '@/data/weeklyTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Apple, 
  Heart,
  Calendar,
  Plus,
  BookOpen,
  Clock
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  week?: number;
}

const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'First Trimester Nutrition Guide',
    excerpt: 'Essential nutrients and foods to focus on during your first three months.',
    category: 'Nutrition',
    readTime: 5,
    week: 8
  },
  {
    id: '2',
    title: 'Safe Exercises During Pregnancy',
    excerpt: 'Stay active safely with these pregnancy-approved workouts and stretches.',
    category: 'Exercise',
    readTime: 7,
    week: 15
  },
  {
    id: '3',
    title: 'Managing Morning Sickness',
    excerpt: 'Natural remedies and tips to cope with nausea and morning sickness.',
    category: 'Wellness',
    readTime: 4,
    week: 6
  },
  {
    id: '4',
    title: 'Understanding Your Menstrual Cycle',
    excerpt: 'Learn about the phases of your cycle and what to expect each month.',
    category: 'Cycle Health',
    readTime: 6
  },
  {
    id: '5',
    title: 'Preparing for Your Second Trimester',
    excerpt: 'What to expect and how to prepare for weeks 14-27 of pregnancy.',
    category: 'Pregnancy',
    readTime: 8,
    week: 14
  }
];

const Tips = () => {
  const { state, isPregnant } = useApp();
  const { user } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const pregnancyData = isPregnant 
    ? calculatePregnancy(user.lmp, user.edd, user.cycleLength)
    : null;

  const currentWeekTips = isPregnant && pregnancyData
    ? getTipsForWeek(pregnancyData.gestationalWeeks)
    : [];

  const categories = ['All', 'Nutrition', 'Exercise', 'Wellness', 'Pregnancy', 'Cycle Health'];

  const filteredArticles = sampleArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
              <h1 className="text-2xl font-semibold text-card-foreground">Tips & Advice</h1>
              <p className="text-muted-foreground">Guidance for your journey</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Current Week Tips (if pregnant) */}
        {isPregnant && pregnancyData && currentWeekTips.length > 0 && (
          <Card className="shadow-card border-0 bg-gradient-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="w-5 h-5" />
                <span>Week {pregnancyData.gestationalWeeks} Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentWeekTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-white/10"
                  >
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-card border-0">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent/20 text-card-foreground hover:bg-accent/40'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime} min</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-card-foreground leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      {article.week && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-xs text-primary font-medium">
                            Week {article.week}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <Card className="shadow-card border-0">
                <CardContent className="pt-6 text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium text-card-foreground mb-2">
                    No articles found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or category filter
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Pregnancy Week Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyTips.slice(0, 10).map((weekTip) => (
                    <div
                      key={weekTip.week}
                      className="p-4 border border-border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-card-foreground">
                          Week {weekTip.week}
                        </h4>
                        <Badge variant="outline">
                          {weekTip.tips.length} tips
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {weekTip.tips.map((tip, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            • {tip}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tracker</span>
            </Link>
            <Link to="/tips" className="flex flex-col items-center space-y-1 p-2">
              <Apple className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary">Tips</span>
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

export default Tips;