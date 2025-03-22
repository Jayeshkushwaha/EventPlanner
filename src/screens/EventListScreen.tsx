import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

type EventListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EventList'>;
};

type Event = {
  id: string;
  name: string;
  startDate: string;
  recurrence: string;
};

const FILTERS = ['Today', 'This Week', 'This Month', 'This Year'];

const EventListScreen: React.FC<EventListScreenProps> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('Today');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await AsyncStorage.getItem('events');
      if (data) setEvents(JSON.parse(data));
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const filteredEvents = () => {
    const today = moment().startOf('day');

    return events.filter((event) => {
      const eventDate = moment(event.startDate);

      switch (filter) {
        case 'Today':
          return eventDate.isSame(today, 'day');
        case 'This Week':
          return eventDate.isSame(today, 'week');
        case 'This Month':
          return eventDate.isSame(today, 'month');
        case 'This Year':
          return eventDate.isSame(today, 'year');
        default:
          return true;
      }
    });
  };

  const deleteEvent = async (id: string) => {
    Alert.alert('Confirm', 'Are you sure you want to remove this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          const updatedEvents = events.filter((event) => event.id !== id);
          await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
          setEvents(updatedEvents);
        },
      },
    ]);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Ionicons name="calendar-outline" size={20} color="#007BFF" />
        <Text style={styles.eventTitle}>{item.name}</Text>
      </View>
      <Text style={styles.eventDate}>
        {moment(item.startDate).format('YYYY-MM-DD')} ({item.recurrence})
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
        >
          <Text style={styles.buttonText}>Show</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateEvent', { eventId: item.id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteEvent(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2940',
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Event List</Text>

        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateEvent')}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>

        <View style={styles.filterContainer}>
          {FILTERS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterButton, filter === item && styles.activeFilterButton]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredEvents()}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No events found</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 50,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginHorizontal: 1,
  },
  activeFilterButton: {
    backgroundColor: '#007BFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EventListScreen;