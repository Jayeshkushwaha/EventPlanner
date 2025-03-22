import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import uuid from 'react-native-uuid';
import Ionicons from 'react-native-vector-icons/Ionicons';

type CreateEventScreenProps = StackScreenProps<RootStackParamList, 'CreateEvent'>;

const RecurrenceOptions = ['Single', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

const EventSchema = Yup.object().shape({
  name: Yup.string().required('Event name is required').max(30, 'Max 30 characters'),
  startDate: Yup.string().required('Start date is required'),
  recurrence: Yup.string().required('Recurrence type is required'),
});

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ navigation, route }) => {
  const [existingEvent, setExistingEvent] = useState<any>(null);
  const isEditMode = !!route.params?.eventId;

  useEffect(() => {
    if (isEditMode) {
      fetchExistingEvent(route.params.eventId);
    }
  }, []);

  const fetchExistingEvent = async (eventId: string) => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        const event = events.find((ev: any) => ev.id === eventId);
        if (event) setExistingEvent(event);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleSaveEvent = async (values: any) => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      let updatedEvents;

      if (isEditMode) {
        updatedEvents = events.map((ev: any) =>
          ev.id === existingEvent.id ? { ...ev, ...values } : ev
        );
      } else {
        const newEvent = { id: uuid.v4().toString(), ...values };
        updatedEvents = [...events, newEvent];
      }

      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      navigation.navigate('EventList')
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const InputField = ({ icon, placeholder, value, onChangeText, onBlur, error }: any) => (
    <View>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2940' }}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.overlay}>
          <Text style={styles.header}>{isEditMode ? 'Edit Event' : 'Create Event'}</Text>

          <Formik
            enableReinitialize
            initialValues={{
              name: existingEvent?.name || '',
              description: existingEvent?.description || '',
              startDate: existingEvent?.startDate || '',
              endDate: existingEvent?.endDate || '',
              recurrence: existingEvent?.recurrence || 'Single',
            }}
            validationSchema={EventSchema}
            onSubmit={handleSaveEvent}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <InputField
                  icon="calendar-outline"
                  placeholder="Event Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                />

                <InputField
                  icon="document-text-outline"
                  placeholder="Event Description (optional)"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                />

                <InputField
                  icon="calendar-clear-outline"
                  placeholder="Start Date (YYYY-MM-DD)"
                  value={values.startDate}
                  onChangeText={handleChange('startDate')}
                  onBlur={handleBlur('startDate')}
                  error={touched.startDate && errors.startDate}
                />

                <InputField
                  icon="calendar-outline"
                  placeholder="End Date (optional, YYYY-MM-DD)"
                  value={values.endDate}
                  onChangeText={handleChange('endDate')}
                  onBlur={handleBlur('endDate')}
                />

                <Text style={styles.label}>Recurrence Type:</Text>
                <View style={styles.recurrenceContainer}>
                  {RecurrenceOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.recurrenceButton,
                        values.recurrence === option && styles.activeRecurrenceButton,
                      ]}
                      onPress={() => handleChange('recurrence')(option)}
                    >
                      <Text style={styles.recurrenceText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
                  <Text style={styles.saveButtonText}>{isEditMode ? 'Update Event' : 'Create Event'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recurrenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  recurrenceButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeRecurrenceButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  recurrenceText: {
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;