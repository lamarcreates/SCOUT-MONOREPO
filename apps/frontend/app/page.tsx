import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Search, 
  Calendar, 
  Trophy, 
  Bot, 
  Car, 
  Users, 
  Shield,
  Sparkles,
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react';
import { ScoutIcon } from '@/components/scout-icon';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <ScoutIcon className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">MotorScout.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Advanced AI
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your AI-Powered Automotive Assistant
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the future of car shopping with MotorScout's intelligent platform. 
            Get personalized recommendations, schedule test drives, and find your perfect vehicle.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="group">
              <Link href="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chat with AI
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/browse">
                <Search className="mr-2 h-5 w-5" />
                Browse Inventory
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need in One Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MotorScout combines cutting-edge AI with a comprehensive automotive platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Bot className="h-8 w-8" />}
            title="AI Chat Assistant"
            description="Get instant, personalized vehicle recommendations from our intelligent assistant"
            href="/chat"
          />
          <FeatureCard
            icon={<Search className="h-8 w-8" />}
            title="Smart Search"
            description="Browse our extensive inventory with advanced filters and AI-powered matching"
            href="/browse"
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8" />}
            title="Easy Scheduling"
            description="Book test drives and appointments with just a few clicks"
            href="/schedule"
          />
          <FeatureCard
            icon={<Trophy className="h-8 w-8" />}
            title="Rewards Program"
            description="Earn points and unlock exclusive benefits as you explore"
            href="/rewards"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-card/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How MotorScout Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your journey to finding the perfect vehicle in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StepCard
            number="1"
            title="Chat with Scout AI"
            description="Tell our AI assistant about your needs, preferences, and budget"
            icon={<MessageSquare className="h-6 w-6" />}
          />
          <StepCard
            number="2"
            title="Get Recommendations"
            description="Receive personalized vehicle matches based on your unique requirements"
            icon={<Zap className="h-6 w-6" />}
          />
          <StepCard
            number="3"
            title="Schedule & Purchase"
            description="Book test drives and complete your purchase with dealer support"
            icon={<Car className="h-6 w-6" />}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <StatCard number="10,000+" label="Happy Customers" />
          <StatCard number="50,000+" label="Vehicles Listed" />
          <StatCard number="98%" label="Match Accuracy" />
          <StatCard number="24/7" label="AI Availability" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Vehicle?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their dream car with MotorScout
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/chat">
                  <Bot className="mr-2 h-5 w-5" />
                  Chat with AI Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/register">
                  Create Free Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScoutIcon className="h-6 w-6 text-primary" />
            <span className="font-semibold">MotorScout.ai</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2025 MotorScout.ai - Powered by LLAMA 70B & OpenAI
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, href }: any) {
  return (
    <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader>
        <div className="mb-2 text-primary">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <Button variant="link" className="mt-4 p-0 h-auto" asChild>
          <Link href={href} className="group-hover:underline">
            Learn more <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description, icon }: any) {
  return (
    <div className="text-center">
      <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-3">{description}</p>
      <div className="text-primary">{icon}</div>
    </div>
  );
}

function StatCard({ number, label }: any) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}