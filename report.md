# FightClub - Mental Wellness Application

## Project Overview

FightClub is a comprehensive mental wellness application designed to help users manage their mental health through various evidence-based techniques and tools. The application provides a holistic approach to mental wellbeing, offering features for mood tracking, journaling, meditation, mindfulness exercises, breathing techniques, and AI-assisted support.

The project aims to make mental health tools accessible, engaging, and effective for users seeking to improve their emotional wellbeing in a digital format. With a modern, soothing user interface and a variety of interactive features, FightClub provides a safe space for users to nurture their mental health.

## Target Audience

- Individuals seeking to improve their mental wellbeing
- Those experiencing mild to moderate stress, anxiety, or low mood
- People interested in mindfulness, meditation, and self-improvement
- Users who want to track their emotional patterns over time
- Individuals looking for guided mental health activities

## Features and Functionality

### 1. Journal

The journaling feature allows users to document their thoughts, feelings, and experiences:

- **Entry Creation**: Users can create detailed journal entries with titles, content, mood indicators, and tags
- **Search Functionality**: Full-text search across journal entries for easy retrieval
- **Mood Tagging**: Associate emotional states with entries for pattern recognition
- **Private Storage**: All entries are stored locally in the browser for privacy
- **Entry Management**: View, search, and organize past entries

### 2. Meditation

A comprehensive sound meditation module with various features:

- **Curated Audio Tracks**: Multiple meditation tracks with different themes and durations
- **Interactive Player**: Play, pause, and track progress through meditation sessions
- **Session Tracking**: Records completed sessions, total meditation time, and streaks
- **Visual Statistics**: Charts showing meditation history and patterns
- **Session Types**: Various meditation styles including ambient, guided, rhythmic, and chants

### 3. Breathing Exercise

Guided breathing exercises based on the 4-7-8 technique:

- **Visual Guidance**: Animated circle that expands and contracts to guide breathing rhythm
- **Timed Phases**: Structured breathing with inhale (4s), hold (7s), exhale (8s), and pause (1s)
- **Progress Tracking**: Records completed breathing cycles
- **Audio Cues**: Optional sound indicators for phase transitions
- **Benefits Information**: Educational content about breathing exercise benefits

### 4. Mindfulness Check

A structured mindfulness practice that helps users connect with their current emotional state:

- **Emotion Selection**: Choose from a wide range of emotions with visual representations
- **Guided Mindfulness**: Timed one-minute mindfulness session with countdown
- **Reflection**: Space to document thoughts and observations
- **History Tracking**: Records previous mindfulness check-ins
- **Educational Content**: Information about mindfulness benefits

### 5. Self-Care Activities

A collection of self-care activities for mental and physical wellbeing:

- **Activity Categories**: Physical, mental, emotional, and social self-care tasks
- **Progress Tracking**: Mark activities as completed and track daily progress
- **Time Investment**: Each activity shows estimated time requirement
- **Customizable**: Reset activities for daily practice
- **Educational Content**: Self-care tips and best practices

### 6. Daily Reminders

A reminder system to help establish consistent mental health habits:

- **Custom Reminders**: Create personalized reminders with titles and times
- **Schedule Setting**: Set specific days of the week for each reminder
- **Enable/Disable**: Toggle reminders on and off as needed
- **Browser Notifications**: Displays notifications when browser is open
- **Local Storage**: All reminder data is stored locally for privacy

### 7. AI Mental Health Assistant

An AI-powered chatbot providing mental health support and resources:

- **Emotional Support**: Non-judgmental listening and supportive responses
- **Coping Strategies**: Suggestions for managing anxiety, stress, and other challenges
- **Resource Recommendations**: Links to mental health resources and information
- **Privacy-Focused**: Conversations are not permanently stored
- **Disclaimer**: Clear information that the AI is not a replacement for professional help

### 8. Statistics and Tracking

Comprehensive tracking of mental health activities and patterns:

- **Mood Tracking**: Record and visualize mood patterns over time
- **Activity Completion**: Track completed mental health exercises
- **Meditation Statistics**: Visualize meditation frequency, duration, and types
- **Streaks**: Track consistency in mental health practices
- **Data Visualization**: Charts and graphs showing progress and patterns

## Technology Stack

### Frontend Framework and Libraries

- **React**: Core library for building the user interface
- **TypeScript**: Typed JavaScript for improved code quality and developer experience
- **React Router**: Client-side routing for single-page application navigation
- **TanStack Query (React Query)**: Data fetching, caching, and state management
- **Recharts**: Responsive charting library for data visualization
- **Lucide React**: Modern icon library with consistent design

### UI Components and Styling

- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible component primitives
- **CSS Animations**: Custom animations for interactive elements
- **Glass Morphism**: UI design trend using background blur and transparency

### State Management and Data Persistence

- **React Hooks**: For component-level state management
- **localStorage API**: Browser storage for persisting user data
- **Custom Hooks**: Abstracted functionality for reusable logic
- **Context API**: For managing global application state

### Audio and Interactive Features

- **Web Audio API**: For playing meditation sounds and UI feedback
- **Custom Sound Hooks**: For consistent audio experience across components
- **requestAnimationFrame**: For smooth animations in interactive components
- **setInterval/setTimeout**: For timing-based features like breathing exercises

### Development Tools

- **Vite**: Modern frontend build tool and development server
- **ESLint**: Static code analysis for identifying problematic patterns
- **Prettier**: Code formatter for consistent styling
- **npm/yarn**: Package management

## Architecture Overview

FightClub follows a component-based architecture typical of modern React applications:

1. **Page Components**: Top-level components representing complete pages (Journal, Meditation, etc.)
2. **Shared UI Components**: Reusable UI elements like buttons, cards, and inputs
3. **Feature Components**: Complex components specific to certain features
4. **Layout Components**: Structural components for consistent page layout
5. **Service Layer**: Utilities for data persistence and business logic
6. **Hooks**: Custom hooks for shared functionality across components

The application uses client-side rendering and follows a single-page application (SPA) pattern, with React Router managing navigation between different sections.

### Data Flow

1. **Component State**: Managed with React's useState and useEffect hooks
2. **Local Storage**: Persistent storage for user data
3. **Services**: Abstract data manipulation and storage operations
4. **UI Components**: Consume and display data from state or storage

## User Experience Considerations

### Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Color Contrast**: Ensuring sufficient contrast for text readability
- **Focus Management**: Visible focus indicators for keyboard users

### Performance

- **Lazy Loading**: Components load only when needed
- **Optimized Animations**: CSS transitions instead of JavaScript where possible
- **Local Processing**: All data processing happens client-side for immediate feedback
- **Minimal Dependencies**: Careful selection of external libraries

### Design Language

- **Soothing Color Palette**: Calming colors appropriate for mental health context
- **Consistent Styling**: Uniform styling across components for familiarity
- **Responsive Design**: Adapts to different screen sizes and devices
- **Visual Feedback**: Animations and transitions for interactive elements
- **Glass Morphism**: Modern, calming aesthetic with translucent elements

### Privacy and Security

- **Local-only Storage**: User data stays in the browser
- **No User Accounts**: No collection of personal information
- **Transparent Data Usage**: Clear information about data handling
- **No External APIs**: (Except for the chatbot) minimizing data leaving the device

## Implementation Details

### Journal Module

The Journal module stores entries in localStorage with a schema that includes:
- Entry ID (generated unique identifier)
- Title
- Content (the journal text)
- Date (ISO string)
- Mood (optional emotional state)
- Tags (optional categorization)

Search functionality uses JavaScript filter methods to search across all fields, and entries are displayed in a card-based UI with excerpts for easy browsing.

### Meditation Module

The meditation functionality:
- Uses HTML5 audio elements to play meditation tracks
- Tracks session data including duration, completion status, and track type
- Provides visualizations of meditation patterns using Recharts
- Calculates streaks based on consecutive days of practice
- Offers different meditation styles with appropriate audio tracks

### Breathing Exercise

The interactive breathing exercise:
- Uses CSS transitions for smooth circle animation
- Employs setInterval for precise timing of breath phases
- Provides visual and optional audio cues
- Tracks completion of breathing cycles
- Integrates with self-care activity tracking

### Mindfulness Check

The mindfulness check-in:
- Offers a wide range of emotion selections with emojis and colors
- Provides a timed mindfulness session with countdown
- Stores check-in history with timestamps
- Allows for reflection through text input
- Shows previous check-ins for pattern recognition

### localStorage Service

The application uses a structured approach to localStorage:
- Custom services for different data types (mood entries, meditation sessions)
- Helper functions for saving and retrieving data
- Data transformation utilities for statistics and visualizations
- Consistent data schemas across features

## Future Enhancements

### Potential Features

1. **Data Export/Import**: Allow users to backup and transfer their data
2. **Customizable Themes**: Personalize the application appearance
3. **Guided Journaling**: Templates and prompts for effective journaling
4. **Advanced Statistics**: More detailed analysis of mood and activity patterns
5. **Offline PWA Support**: Full functionality without internet connection
6. **Meditation Course**: Structured multi-day meditation programs
7. **Goal Setting**: Personal mental wellness goals and tracking
8. **Social Features**: Optional sharing of achievements (not personal data)

### Technical Improvements

1. **IndexedDB**: Move from localStorage to IndexedDB for better performance with large datasets
2. **Service Workers**: For true offline functionality
3. **Web Notifications API**: Integration for reminders outside the browser tab
4. **WebRTC**: For optional audio recording in journal entries
5. **Web Speech API**: Voice guidance option for exercises

## Conclusion

FightClub represents a comprehensive approach to digital mental wellness, combining evidence-based techniques with modern web technologies. The application prioritizes user privacy, accessibility, and engagement while providing valuable tools for mental health management.

By focusing on local processing and storage, the app maintains user privacy while still offering sophisticated features. The variety of mental wellness tools caters to different preferences and needs, allowing users to find approaches that work best for them.

As mental health awareness continues to grow, applications like FightClub can play an important role in making mental wellness practices more accessible and integrated into daily life.
