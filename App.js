import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'journal':
        return <JournalScreen />;
      case 'mood':
        return <MoodScreen />;
      case 'exercises':
        return <ExercisesScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'history':
        return <HistoryScreen />;
      default:
        return <HomeContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const HomeContent = ({ setActiveTab }) => (
  <ScrollView style={styles.content}>
    <View style={styles.header}>
      <Text style={styles.appTitle}>MindfulMe 🌸</Text>
      <Text style={styles.subtitle}>Your Mental Health Companion</Text>
    </View>
    
    <View style={styles.welcomeCard}>
      <Text style={styles.welcomeText}>How are you feeling today?</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#E0F0E9' }]}
          onPress={() => setActiveTab('mood')}
        >
          <Text style={styles.actionEmoji}>😊</Text>
          <Text style={styles.actionText}>Track Mood</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#E0F0FF' }]}
          onPress={() => setActiveTab('journal')}
        >
          <Text style={styles.actionEmoji}>📝</Text>
          <Text style={styles.actionText}>Journal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFE4C4' }]}
          onPress={() => setActiveTab('exercises')}
        >
          <Text style={styles.actionEmoji}>🧘</Text>
          <Text style={styles.actionText}>Breathe</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#E6E6FA' }]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={styles.actionEmoji}>💬</Text>
          <Text style={styles.actionText}>AI Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

const JournalScreen = () => {
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const saveJournalEntry = async () => {
    if (!journalText.trim()) {
      Alert.alert('Please write something in your journal first!');
      return;
    }
    
    try {
      const date = new Date().toISOString().slice(0, 10);
      const time = new Date().toLocaleTimeString();
      const entry = { 
        date, 
        time,
        text: journalText,
        mood: selectedMood || '😐'
      };
      
      let entries = await AsyncStorage.getItem('journalEntries');
      entries = entries ? JSON.parse(entries) : [];
      entries.push(entry);
      
      await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
      Alert.alert('Success!', 'Your journal entry has been saved! 📝');
      setJournalText('');
      setSelectedMood('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Daily Journal 📝</Text>
        <Text style={styles.screenSubtitle}>Express your thoughts and feelings</Text>
      </View>
      
      <View style={styles.moodSelector}>
        <Text style={styles.sectionTitle}>How do you feel?</Text>
        <View style={styles.moodOptions}>
          {['😊', '😐', '😔', '😰', '😡'].map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodOption,
                selectedMood === mood && styles.selectedMood
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text style={styles.moodEmoji}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.journalInput}>
        <Text style={styles.sectionTitle}>What's on your mind?</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={8}
          placeholder="Write about your day, feelings, or anything that comes to mind..."
          value={journalText}
          onChangeText={setJournalText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveJournalEntry}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const MoodScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moods = [
    { emoji: '😊', label: 'Great', color: '#CCFFCC' },
    { emoji: '🙂', label: 'Good', color: '#E0F0E9' },
    { emoji: '😐', label: 'Okay', color: '#FFE4C4' },
    { emoji: '😔', label: 'Low', color: '#F8C8DC' },
    { emoji: '😰', label: 'Anxious', color: '#E6E6FA' },
  ];

  const logMood = async () => {
    if (selectedMood === null) {
      Alert.alert('Please select a mood first!');
      return;
    }
    
    try {
      const date = new Date().toISOString().slice(0, 10);
      const time = new Date().toLocaleTimeString();
      const entry = { 
        date, 
        time,
        mood: moods[selectedMood].label,
        emoji: moods[selectedMood].emoji 
      };
      
      let logs = await AsyncStorage.getItem('moodLogs');
      logs = logs ? JSON.parse(logs) : [];
      logs.push(entry);
      
      await AsyncStorage.setItem('moodLogs', JSON.stringify(logs));
      Alert.alert('Success!', `Your ${moods[selectedMood].label} mood has been logged! 🎉`);
      setSelectedMood(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save mood. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Mood Tracker 💭</Text>
        <Text style={styles.screenSubtitle}>How are you feeling right now?</Text>
      </View>
      
      <View style={styles.moodWheel}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodCircle,
              { backgroundColor: mood.color },
              selectedMood === index && styles.selectedMoodCircle
            ]}
            onPress={() => setSelectedMood(index)}
          >
            <Text style={styles.moodCircleEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodCircleLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedMood !== null && (
        <View style={styles.moodFeedback}>
          <Text style={styles.feedbackText}>
            You're feeling {moods[selectedMood].label.toLowerCase()} today
          </Text>
          <TouchableOpacity style={styles.logMoodButton} onPress={logMood}>
            <Text style={styles.logMoodButtonText}>Log This Mood</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const ExercisesScreen = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setProgress(0);
    
    const duration = 60000; // 1 minute
    const interval = 100; // Update every 100ms
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsBreathing(false);
          setProgress(0);
          Alert.alert('Exercise Complete!', 'Great job! You completed the breathing exercise. 🧘‍♀️');
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Breathing Exercises 🧘</Text>
        <Text style={styles.screenSubtitle}>Find your calm</Text>
      </View>
      
      <View style={styles.breathingCircle}>
        <View style={styles.breatheAnimation}>
          <Text style={styles.breatheText}>
            {isBreathing ? `Breathe In... Breathe Out...\n${Math.round(progress)}%` : 'Tap to Start'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.breatheButton, isBreathing && { backgroundColor: '#6B7280' }]}
        onPress={startBreathingExercise}
        disabled={isBreathing}
      >
        <Text style={styles.breatheButtonText}>
          {isBreathing ? 'Breathing in Progress...' : 'Start 4-7-8 Breathing'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.exercisesList}>
        <Text style={styles.sectionTitle}>Other Exercises</Text>
        {[
          { name: 'Box Breathing', description: 'Breathe in 4-hold 4-out 4-hold 4' },
          { name: 'Progressive Relaxation', description: 'Tense and relax muscle groups' },
          { name: 'Mindful Walking', description: 'Walking meditation practice' },
          { name: 'Body Scan', description: 'Full body awareness exercise' },
          { name: 'Loving Kindness', description: 'Compassion meditation' }
        ].map((exercise, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.exerciseItem} 
            onPress={() => Alert.alert(
              'Coming Soon!', 
              `${exercise.name} will be available in the next update.\n\n${exercise.description}`
            )}
          >
            <View>
              <Text style={styles.exerciseText}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm here to support you. How are you feeling today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, isBot: false };
      setMessages(prev => [...prev, newMessage]);
      
      setTimeout(() => {
        const responses = [
          "Thank you for sharing. Can you tell me more about what you're experiencing?",
          "I understand. How has this been affecting your daily life?",
          "That sounds challenging. What coping strategies have you tried?",
          "I'm here to listen. Would you like to talk about what's been on your mind?",
          "It's okay to feel this way. What would help you feel better right now?",
          "Have you considered talking to a professional about this?",
          "What activities usually help you feel better?",
          "Remember, it's normal to have ups and downs. You're not alone.",
          "Would you like to try a breathing exercise together?",
          "How has your sleep and eating been lately?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botResponse = { 
          id: Date.now() + 1, 
          text: randomResponse, 
          isBot: true 
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setInputText('');
    }
  };

  return (
    <View style={styles.chatContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>AI Companion 💬</Text>
        <Text style={styles.screenSubtitle}>I'm here to listen and support you</Text>
      </View>
      
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble,
              message.isBot ? styles.botMessage : styles.userMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              !message.isBot && { color: 'white' }
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HistoryScreen = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [activeHistoryTab, setActiveHistoryTab] = useState('moods');
  const [chartData, setChartData] = useState(null);

  const loadData = async () => {
    try {
      const moods = await AsyncStorage.getItem('moodLogs');
      const journals = await AsyncStorage.getItem('journalEntries');
      
      const parsedMoods = moods ? JSON.parse(moods) : [];
      const parsedJournals = journals ? JSON.parse(journals) : [];
      
      setMoodLogs(parsedMoods);
      setJournalEntries(parsedJournals);
      
      if (parsedMoods.length > 0) {
        generateChartData(parsedMoods);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const generateChartData = (logs) => {
    const last7Days = logs.slice(-7);
    const moodValues = {
      'Great': 5,
      'Good': 4,
      'Okay': 3,
      'Low': 2,
      'Anxious': 1
    };

    const labels = last7Days.map(log => {
      const date = new Date(log.date);
      return date.toLocaleDateString('en', { weekday: 'short' });
    });

    const data = last7Days.map(log => moodValues[log.mood] || 3);

    setChartData({
      labels: labels.length > 0 ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: data.length > 0 ? data : [3, 3, 3, 3, 3, 3, 3]
    });
  };

  const getMoodStats = () => {
    if (moodLogs.length === 0) return null;
    
    const moodCounts = moodLogs.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {});

    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return { moodCounts, mostCommonMood, totalEntries: moodLogs.length };
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your mood logs and journal entries? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('moodLogs');
              await AsyncStorage.removeItem('journalEntries');
              setMoodLogs([]);
              setJournalEntries([]);
              setChartData(null);
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          }
        }
      ]
    );
  };

  const stats = getMoodStats();

  return (
    <ScrollView style={styles.content}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My History 📊</Text>
        <Text style={styles.screenSubtitle}>View your saved entries and mood trends</Text>
      </View>

      <View style={styles.historyTabs}>
        <TouchableOpacity 
          style={[styles.historyTab, activeHistoryTab === 'moods' && styles.activeHistoryTab]}
          onPress={() => setActiveHistoryTab('moods')}
        >
          <Text style={[styles.historyTabText, activeHistoryTab === 'moods' && { color: 'white' }]}>
            Mood Analytics ({moodLogs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.historyTab, activeHistoryTab === 'journals' && styles.activeHistoryTab]}
          onPress={() => setActiveHistoryTab('journals')}
        >
          <Text style={[styles.historyTabText, activeHistoryTab === 'journals' && { color: 'white' }]}>
            Journal Entries ({journalEntries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeHistoryTab === 'moods' ? (
        <View>
          {moodLogs.length === 0 ? (
            <View style={styles.emptyAnalytics}>
              <Text style={styles.emptyText}>No mood data yet.</Text>
              <Text style={styles.emptySubtext}>Start logging your moods to see analytics!</Text>
            </View>
          ) : (
            <>
              {/* Simple Mood Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>7-Day Mood Trend</Text>
                <View style={styles.simpleChart}>
                  {chartData && chartData.data.map((value, index) => (
                    <View key={index} style={styles.chartBar}>
                      <View 
                        style={[
                          styles.chartBarFill, 
                          { height: `${(value / 5) * 100}%` }
                        ]} 
                      />
                      <Text style={styles.chartLabel}>
                        {chartData.labels[index] || `Day ${index + 1}`}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={styles.moodScale}>
                  <Text style={styles.scaleText}>1: Anxious</Text>
                  <Text style={styles.scaleText}>3: Okay</Text>
                  <Text style={styles.scaleText}>5: Great</Text>
                </View>
              </View>

              {/* Mood Statistics */}
              {stats && (
                <View style={styles.statsContainer}>
                  <Text style={styles.chartTitle}>Mood Summary</Text>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Mood Logs</Text>
                    <Text style={styles.statValue}>{stats.totalEntries}</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Most Common Mood</Text>
                    <Text style={styles.statValue}>{stats.mostCommonMood}</Text>
                  </View>

                  <View style={styles.moodBreakdown}>
                    <Text style={styles.chartTitle}>Mood Breakdown</Text>
                    {Object.entries(stats.moodCounts).map(([mood, count]) => (
                      <View key={mood} style={styles.moodBreakdownItem}>
                        <Text style={styles.moodBreakdownLabel}>{mood}</Text>
                        <View style={styles.moodBreakdownBar}>
                          <View 
                            style={[
                              styles.moodBreakdownFill,
                              { width: `${(count / stats.totalEntries) * 100}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.moodBreakdownCount}>{count}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Recent Mood Logs */}
              <View style={styles.recentLogsContainer}>
                <Text style={styles.chartTitle}>Recent Mood Logs</Text>
                {moodLogs.slice().reverse().slice(0, 5).map((log, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyEmoji}>{log.emoji}</Text>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyMood}>{log.mood}</Text>
                      <Text style={styles.historyDate}>{log.date} at {log.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      ) : (
        <View>
          {journalEntries.length === 0 ? (
            <Text style={styles.emptyText}>No journal entries yet. Start writing!</Text>
          ) : (
            journalEntries.slice().reverse().map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyEmoji}>{entry.mood}</Text>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyText} numberOfLines={3}>{entry.text}</Text>
                  <Text style={styles.historyDate}>{entry.date} at {entry.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {(moodLogs.length > 0 || journalEntries.length > 0) && (
        <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'mood', icon: '💭', label: 'Mood' },
    { id: 'journal', icon: '📝', label: 'Journal' },
    { id: 'exercises', icon: '🧘', label: 'Breathe' },
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'history', icon: '📊', label: 'History' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.navItem,
            activeTab === tab.id && styles.activeNavItem
          ]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Text style={styles.navIcon}>{tab.icon}</Text>
          <Text style={[
            styles.navLabel,
            activeTab === tab.id && styles.activeNavLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4B8C',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  screenHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4B8C',
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  moodSelector: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodOption: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  selectedMood: {
    backgroundColor: '#E0F0E9',
  },
  moodEmoji: {
    fontSize: 30,
  },
  journalInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 15,
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#8B4B8C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  moodWheel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  moodCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  selectedMoodCircle: {
    borderWidth: 3,
    borderColor: '#8B4B8C',
  },
  moodCircleEmoji: {
    fontSize: 24,
  },
  moodCircleLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  moodFeedback: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 15,
  },
  logMoodButton: {
    backgroundColor: '#8B4B8C',
    padding: 12,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  logMoodButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  breathingCircle: {
    alignItems: 'center',
    marginVertical: 40,
  },
  breatheAnimation: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0F0E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breatheText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  breatheButton: {
    backgroundColor: '#8B4B8C',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  breatheButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exercisesList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#8B4B8C',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#E0F0E9',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#8B4B8C',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#8B4B8C',
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  historyTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  historyTab: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeHistoryTab: {
    backgroundColor: '#8B4B8C',
  },
  historyTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  historyDetails: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  historyText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 50,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
  },
  emptyAnalytics: {
    alignItems: 'center',
    marginTop: 100,
  },
  clearButton: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
    textAlign: 'center',
  },
  simpleChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 10,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    backgroundColor: '#8B4B8C',
    width: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  moodScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  scaleText: {
    fontSize: 10,
    color: '#6B7280',
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 16,
    color: '#374151',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4B8C',
  },
  moodBreakdown: {
    marginTop: 20,
  },
  moodBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodBreakdownLabel: {
    width: 80,
    fontSize: 14,
    color: '#374151',
  },
  moodBreakdownBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  moodBreakdownFill: {
    height: '100%',
    backgroundColor: '#8B4B8C',
    borderRadius: 10,
  },
  moodBreakdownCount: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
  recentLogsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  activeNavItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  activeNavLabel: {
    color: '#8B4B8C',
    fontWeight: '600',
  },
});
