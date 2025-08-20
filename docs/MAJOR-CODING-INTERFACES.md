# MotorScout.ai Major Coding Interfaces

## Complete Interface Architecture for All 7 Core Components

---

## 1. **AI Chat Interface** `/chat`

### **Primary Technologies:**
- **Vercel AI SDK 5** - Streaming chat with useChat hook
- **A2E Avatar SDK** - Optional avatar integration
- **shadcn/ui + Assistant UI** - Chat components

### **Key Interfaces:**

#### **Frontend Chat Component:**
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    vehicleRecommendations?: Vehicle[];
    appointmentSuggestion?: AppointmentSlot;
    leadScore?: number;
  };
}

interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  context: CustomerContext;
  status: 'active' | 'ended' | 'transferred';
}

// Main Chat Hook
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  initialMessages: sessionMessages,
  onFinish: (message) => trackConversation(message)
});
```

#### **Backend Chat API:**
```typescript
// /api/chat/route.ts
interface ChatRequest {
  messages: ChatMessage[];
  userId: string;
  sessionId: string;
  context: CustomerContext;
}

interface LLAMAResponse {
  content: string;
  vehicleRecommendations?: Vehicle[];
  nextActions?: ('schedule' | 'browse' | 'contact_dealer')[];
  confidence: number;
}

// Route to on-prem LLAMA vs OpenAI
const routeToAI = (messages: ChatMessage[]) => {
  if (isOnPremAvailable() && isComplexQuery(messages)) {
    return callOnPremLLAMA(messages);
  }
  return callOpenAI(messages);
};
```

#### **Avatar Integration:**
```typescript
interface AvatarConfig {
  enabled: boolean;
  voice: 'professional-male' | 'professional-female';
  appearance: 'automotive-advisor';
  language: string;
}

const ScoutAvatar = ({ config, onSpeech, isListening }: AvatarProps) => {
  return (
    <A2EAvatar
      config={config}
      onSpeechComplete={(text) => onSpeech(text)}
      onListeningStateChange={setIsListening}
    />
  );
};
```

---

## 2. **Vehicle Browse & Discovery** `/browse`, `/browse/[id]`

### **Primary Technologies:**
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Smooth animations
- **React Virtualized** - Large inventory lists
- **Next.js Image** - Optimized vehicle photos

### **Key Interfaces:**

#### **Vehicle Data Models:**
```typescript
interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: 'new' | 'used' | 'certified';
  images: VehicleImage[];
  features: string[];
  specifications: VehicleSpecs;
  dealerInfo: DealerInfo;
  aiRecommendationScore?: number;
}

interface VehicleFilters {
  make?: string[];
  priceRange?: [number, number];
  mileageRange?: [number, number];
  year?: [number, number];
  bodyType?: string[];
  fuelType?: string[];
  transmission?: string[];
}

interface SearchParams {
  query?: string;
  filters: VehicleFilters;
  sortBy: 'price' | 'mileage' | 'year' | 'relevance';
  page: number;
  limit: number;
}
```

#### **Browse Components:**
```typescript
// Vehicle Grid with Virtualization
const VehicleGrid = ({ vehicles, onVehicleClick }: VehicleGridProps) => {
  return (
    <VirtualizedGrid
      items={vehicles}
      renderItem={({ item }) => (
        <VehicleCard 
          vehicle={item} 
          onClick={() => onVehicleClick(item)}
          showAIScore={item.aiRecommendationScore}
        />
      )}
      itemHeight={300}
      itemsPerRow={3}
    />
  );
};

// Advanced Search Interface
const VehicleSearch = ({ onSearch, filters }: VehicleSearchProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>();
  
  return (
    <SearchInterface>
      <SearchInput onQuery={setQuery} />
      <FilterPanel filters={filters} onChange={setFilters} />
      <SortDropdown value={sortBy} onChange={setSortBy} />
    </SearchInterface>
  );
};
```

#### **Individual Vehicle Page:**
```typescript
// /browse/[id]/page.tsx
interface VehicleDetailProps {
  vehicle: Vehicle;
  similarVehicles: Vehicle[];
  userInterest: UserInterest;
}

const VehicleDetail = ({ vehicle }: VehicleDetailProps) => {
  return (
    <VehicleDetailLayout>
      <ImageGallery images={vehicle.images} />
      <VehicleInfo vehicle={vehicle} />
      <ActionButtons 
        onScheduleTestDrive={() => openScheduler(vehicle)}
        onStartChat={() => startChatWithContext(vehicle)}
        onSaveVehicle={() => saveToFavorites(vehicle)}
      />
      <SimilarVehicles vehicles={similarVehicles} />
    </VehicleDetailLayout>
  );
};
```

---

## 3. **Customer Dashboard** `/dashboard`

### **Primary Technologies:**
- **React Query** - Data synchronization
- **Recharts** - Progress visualizations
- **React DnD** - Drag-and-drop customization
- **Framer Motion** - Smooth transitions

### **Key Interfaces:**

#### **Dashboard Data Models:**
```typescript
interface CustomerDashboard {
  userId: string;
  recentActivity: Activity[];
  savedVehicles: Vehicle[];
  appointments: Appointment[];
  chatSessions: ChatSession[];
  preferences: CustomerPreferences;
  progress: CustomerProgress;
  rewards: RewardStatus;
}

interface Activity {
  id: string;
  type: 'vehicle_viewed' | 'chat_started' | 'appointment_scheduled' | 'vehicle_saved';
  timestamp: Date;
  details: Record<string, any>;
}

interface CustomerProgress {
  stage: 'browsing' | 'researching' | 'negotiating' | 'purchasing';
  completedSteps: string[];
  nextRecommendedActions: string[];
  progressPercentage: number;
}
```

#### **Dashboard Components:**
```typescript
// Main Dashboard Layout
const CustomerDashboard = ({ userId }: DashboardProps) => {
  const { data: dashboard } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => fetchDashboard(userId)
  });

  return (
    <DashboardGrid>
      <QuickActions actions={getQuickActions(dashboard)} />
      <ProgressWidget progress={dashboard.progress} />
      <RecentActivity activities={dashboard.recentActivity} />
      <SavedVehicles vehicles={dashboard.savedVehicles} />
      <UpcomingAppointments appointments={dashboard.appointments} />
      <RewardsWidget rewards={dashboard.rewards} />
    </DashboardGrid>
  );
};

// Customizable Widget System
interface WidgetProps {
  id: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  data: any;
}

const DashboardWidget = ({ widget, onMove, onResize }: WidgetComponentProps) => {
  return (
    <Draggable draggableId={widget.id}>
      <ResizableBox onResize={onResize}>
        <WidgetContent widget={widget} />
      </ResizableBox>
    </Draggable>
  );
};
```

---

## 4. **Authentication System** `/login`, `/register`

### **Primary Technologies:**
- **NextAuth.js v5** - Authentication framework
- **Zod** - Form validation
- **React Hook Form** - Form management
- **JWT** - Session management

### **Key Interfaces:**

#### **Auth Data Models:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferences: CustomerPreferences;
  createdAt: Date;
  lastLoginAt: Date;
  verified: boolean;
  role: 'customer' | 'dealer' | 'admin';
}

interface Session {
  userId: string;
  sessionToken: string;
  expires: Date;
  metadata: SessionMetadata;
}

interface CustomerPreferences {
  vehicleTypes: string[];
  priceRange: [number, number];
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  aiAssistanceLevel: 'minimal' | 'moderate' | 'full';
}
```

#### **Auth Components:**
```typescript
// Registration Form
const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      name: data.name,
      redirect: false
    });
    
    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} error={errors.email} />
      <Input {...register('password')} type="password" error={errors.password} />
      <Input {...register('name')} error={errors.name} />
      <Button type="submit">Create Account</Button>
    </form>
  );
};

// Auth Context Provider
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  
  const signIn = async (credentials: LoginCredentials) => {
    const session = await authenticateUser(credentials);
    setUser(session.user);
    return session;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 5. **Appointment Scheduling** `/schedule`

### **Primary Technologies:**
- **React Big Calendar** - Calendar interface
- **date-fns** - Date manipulation
- **React Query** - Availability fetching
- **Framer Motion** - Smooth transitions

### **Key Interfaces:**

#### **Scheduling Data Models:**
```typescript
interface Appointment {
  id: string;
  customerId: string;
  dealerId: string;
  vehicleId?: string;
  type: 'test_drive' | 'consultation' | 'delivery' | 'service';
  scheduledAt: Date;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  reminders: ReminderSettings[];
}

interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
  dealerId: string;
  isAvailable: boolean;
  appointmentType: string[];
}

interface DealerSchedule {
  dealerId: string;
  businessHours: BusinessHours;
  availableSlots: AvailabilitySlot[];
  blockedDates: Date[];
}
```

#### **Scheduling Components:**
```typescript
// Main Scheduling Interface
const AppointmentScheduler = ({ vehicleId, customerId }: SchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot>();
  
  const { data: availability } = useQuery({
    queryKey: ['availability', selectedDate],
    queryFn: () => fetchAvailability(selectedDate),
    enabled: !!selectedDate
  });

  return (
    <SchedulerLayout>
      <CalendarView 
        onDateSelect={setSelectedDate}
        availableDates={availability?.availableDates}
      />
      <TimeSlotGrid
        slots={availability?.slots}
        onSlotSelect={setSelectedSlot}
      />
      <AppointmentForm
        slot={selectedSlot}
        onSubmit={createAppointment}
      />
    </SchedulerLayout>
  );
};

// Calendar Integration
const CalendarView = ({ onDateSelect, availableDates }: CalendarProps) => {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateSelect}
      disabled={(date) => !isDateAvailable(date, availableDates)}
      className="appointment-calendar"
    />
  );
};
```

---

## 6. **Gamification & Rewards** `/rewards`

### **Primary Technologies:**
- **React Spring** - Animation library
- **Lottie React** - Reward animations
- **React Confetti** - Celebration effects
- **Recharts** - Progress charts

### **Key Interfaces:**

#### **Gamification Data Models:**
```typescript
interface RewardSystem {
  userId: string;
  currentLevel: number;
  totalPoints: number;
  availablePoints: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: Streak[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  requirements: BadgeRequirement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: Date;
}
```

#### **Gamification Components:**
```typescript
// Rewards Dashboard
const RewardsDashboard = ({ userId }: RewardsProps) => {
  const { data: rewards } = useQuery({
    queryKey: ['rewards', userId],
    queryFn: () => fetchRewards(userId)
  });

  return (
    <RewardsLayout>
      <LevelProgress 
        currentLevel={rewards.currentLevel}
        progress={rewards.levelProgress}
      />
      <PointsBalance points={rewards.availablePoints} />
      <BadgeCollection badges={rewards.badges} />
      <AchievementList achievements={rewards.achievements} />
      <RewardStore onRedeem={redeemReward} />
    </RewardsLayout>
  );
};

// Achievement Unlock Animation
const AchievementUnlock = ({ achievement }: AchievementUnlockProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
    >
      <Confetti numberOfPieces={100} />
      <LottieAnimation animationData={celebrationAnimation} />
      <AchievementCard achievement={achievement} />
    </motion.div>
  );
};
```

---

## 7. **Admin Dashboard** `/admin`

### **Primary Technologies:**
- **React Table v8** - Data tables
- **Recharts** - Analytics charts
- **React Virtual** - Large data sets
- **React Query** - Real-time data

### **Key Interfaces:**

#### **Admin Data Models:**
```typescript
interface AdminDashboard {
  overview: DashboardMetrics;
  leads: Lead[];
  conversations: ChatAnalytics;
  appointments: AppointmentMetrics;
  vehicles: InventoryMetrics;
  users: UserMetrics;
}

interface Lead {
  id: string;
  customerId: string;
  source: 'chat' | 'browse' | 'direct';
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  interestedVehicles: string[];
  lastActivity: Date;
  assignedTo?: string;
}

interface ChatAnalytics {
  totalConversations: number;
  averageLength: number;
  topIntents: Intent[];
  satisfactionScore: number;
  leadConversionRate: number;
}
```

#### **Admin Components:**
```typescript
// Main Admin Dashboard
const AdminDashboard = () => {
  const { data: dashboard } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
    refetchInterval: 30000 // Real-time updates
  });

  return (
    <AdminLayout>
      <MetricsOverview metrics={dashboard.overview} />
      <LeadsTable leads={dashboard.leads} />
      <ConversationAnalytics analytics={dashboard.conversations} />
      <AppointmentCalendar appointments={dashboard.appointments} />
      <InventoryManagement vehicles={dashboard.vehicles} />
    </AdminLayout>
  );
};

// Real-time Leads Table
const LeadsTable = ({ leads }: LeadsTableProps) => {
  const table = useReactTable({
    data: leads,
    columns: leadColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DataTable
      table={table}
      onRowClick={(lead) => openLeadDetail(lead)}
      onBulkAction={handleBulkAction}
    />
  );
};
```

---

## **Cross-Component Integration Points**

### **Shared State Management:**
```typescript
// Global App State
interface AppState {
  user: User | null;
  currentSession: ChatSession | null;
  selectedVehicle: Vehicle | null;
  notifications: Notification[];
  preferences: AppPreferences;
}

// Context Providers
const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <ChatProvider>
        <VehicleProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </VehicleProvider>
      </ChatProvider>
    </AuthProvider>
  );
};
```

### **API Integration Layer:**
```typescript
// Unified API Client
const apiClient = {
  chat: {
    sendMessage: (message: ChatMessage) => Promise<ChatResponse>,
    getHistory: (sessionId: string) => Promise<ChatMessage[]>,
    createSession: (userId: string) => Promise<ChatSession>
  },
  vehicles: {
    search: (params: SearchParams) => Promise<Vehicle[]>,
    getById: (id: string) => Promise<Vehicle>,
    getSimilar: (vehicleId: string) => Promise<Vehicle[]>
  },
  appointments: {
    getAvailability: (date: Date) => Promise<AvailabilitySlot[]>,
    create: (appointment: CreateAppointmentRequest) => Promise<Appointment>,
    update: (id: string, updates: Partial<Appointment>) => Promise<Appointment>
  },
  users: {
    authenticate: (credentials: LoginCredentials) => Promise<AuthResponse>,
    getProfile: (userId: string) => Promise<User>,
    updatePreferences: (userId: string, preferences: CustomerPreferences) => Promise<User>
  }
};
```

This comprehensive interface architecture ensures all 7 core components work together seamlessly while maintaining clean separation of concerns and enabling rapid development.