import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

type EventDetailScreenProps = StackScreenProps<RootStackParamList, 'EventDetail'>;

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState<any>(null);
  const [nextOccurrences, setNextOccurrences] = useState<string[]>([]);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const data = await AsyncStorage.getItem('events');
      if (data) {
        const events = JSON.parse(data);
        const selectedEvent = events.find((ev: any) => ev.id === eventId);
        if (selectedEvent) {
          setEvent(selectedEvent);
          calculateNextOccurrences(selectedEvent);
        }
      }
    } catch (error) {
      console.error('Error loading event:', error);
    }
  };

  const calculateNextOccurrences = (event: any) => {
    const occurrences = [];
    let date = moment(event.startDate);
    const endDate = event.endDate ? moment(event.endDate) : null;

    for (let i = 0; i < 5; i++) {
      if (endDate && date.isAfter(endDate)) break;
      occurrences.push(date.format('YYYY-MM-DD'));

      switch (event.recurrence) {
        case 'Daily':
          date.add(1, 'day');
          break;
        case 'Weekly':
          date.add(1, 'week');
          break;
        case 'Monthly':
          date.add(1, 'month');
          break;
        case 'Yearly':
          date.add(1, 'year');
          break;
        default:
          break;
      }
    }

    setNextOccurrences(occurrences);
  };

  const EventDetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.eventDetailRow}>
      <Ionicons name={icon} size={20} color="#007BFF" />
      <Text style={styles.detail}><Text style={styles.boldText}>{label}:</Text> {value}</Text>
    </View>
  );

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2940' }}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.overlay}>
          <Text style={styles.header}>{event.name}</Text>

          <View style={styles.eventCard}>
            <EventDetailRow icon="information-circle-outline" label="Description" value={event.description || 'N/A'} />
            <EventDetailRow icon="calendar-outline" label="Start Date" value={event.startDate} />
            <EventDetailRow icon="calendar-clear-outline" label="End Date" value={event.endDate || 'Infinite'} />
            <EventDetailRow icon="repeat-outline" label="Recurrence" value={event.recurrence} />

            <Text style={styles.subHeader}>Next 5 Occurrences:</Text>
            {nextOccurrences.length > 0 ? (
              nextOccurrences.map((date, index) => (
                <Text key={index} style={styles.occurrence}>{date}</Text>
              ))
            ) : (
              <Text style={styles.occurrence}>No future occurrences</Text>
            )}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Back to Events</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContent: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    marginLeft: 10,
    color: '#444',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '600',
    color: '#222',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
    textTransform: 'uppercase',
  },
  occurrence: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 6,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});


export default EventDetailScreen;