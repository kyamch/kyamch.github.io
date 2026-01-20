import React, { useState, useEffect } from ‘react’;
import {
StyleSheet,
Text,
View,
ScrollView,
TextInput,
TouchableOpacity,
Platform,
StatusBar,
ImageBackground,
Image,
Alert,
} from ‘react-native’;
import PushNotification from ‘react-native-push-notification’;
import AsyncStorage from ‘@react-native-async-storage/async-storage’;

const App = () => {
const [rollNumber, setRollNumber] = useState(’’);
const [batch, setBatch] = useState(’’);
const [anatomyBatch, setAnatomyBatch] = useState(’’);
const [notificationsEnabled, setNotificationsEnabled] = useState(false);
const [currentDay, setCurrentDay] = useState(’’);
const [todayClasses, setTodayClasses] = useState([]);

const batchRanges = {
‘A’: { start: 1, end: 65 },
‘B’: { start: 66, end: 130 },
‘C’: { start: 131, end: 195 },
‘D’: { start: 196, end: 255 }
};

const anatomyBatchRanges = {
‘A’: { start: 1, end: 52 },
‘B’: { start: 53, end: 104 },
‘C’: { start: 105, end: 156 },
‘D’: { start: 157, end: 208 },
‘E’: { start: 209, end: 255 }
};

const schedule = {
Saturday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Tutorial’, venue: ‘All Batch’, type: ‘Tutorial’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Biochemistry Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘D’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘A’, subject: ‘Histology-A’, venue: ‘Histology Lab’, type: ‘Practical’ }
]}
],
Sunday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Demonstration’, venue: ‘All Batch’, type: ‘Demonstration’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Biochemistry Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘C’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘D’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ anatomyBatch: ‘A’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘B’, subject: ‘Histology-B’, venue: ‘Histology Lab’, type: ‘Practical’ }
]}
],
Monday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Lecture’, venue: ‘Gallery-1’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ anatomyBatch: ‘A’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Histology-C’, venue: ‘Histology Lab’, type: ‘Practical’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Biochemistry Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘B’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘C’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]}
],
Tuesday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Demonstration’, venue: ‘All Batch’, type: ‘Demonstration’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Lecture’, venue: ‘Gallery-1’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ anatomyBatch: ‘A’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Histology-D’, venue: ‘Histology Lab’, type: ‘Practical’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘B’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Biochemistry Practical’, venue: ‘Lab’, type: ‘Practical’ }
]}
],
Wednesday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Tutorial’, venue: ‘All Batch’, type: ‘Tutorial’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘A’, subject: ‘Histology-A’, venue: ‘Histology Lab’, type: ‘Practical’ }
]}
],
Thursday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Lecture’, venue: ‘Gallery-3’, type: ‘Lecture’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ batch: ‘B’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘A’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]}
],
Friday: []
};

useEffect(() => {
initializeApp();
configurePushNotifications();
}, []);

useEffect(() => {
const days = [‘Sunday’, ‘Monday’, ‘Tuesday’, ‘Wednesday’, ‘Thursday’, ‘Friday’, ‘Saturday’];
const today = days[new Date().getDay()];
setCurrentDay(today);
}, []);

useEffect(() => {
if (batch && anatomyBatch && currentDay) {
updateTodayClasses();
}
}, [batch, anatomyBatch, currentDay]);

const initializeApp = async () => {
try {
const savedRoll = await AsyncStorage.getItem(‘rollNumber’);
const savedNotif = await AsyncStorage.getItem(‘notificationsEnabled’);

```
  if (savedRoll) {
    handleRollNumberChange(savedRoll);
  }
  
  if (savedNotif === 'true') {
    setNotificationsEnabled(true);
  }
} catch (error) {
  console.log('Error loading data:', error);
}
```

};

const configurePushNotifications = () => {
PushNotification.configure({
onNotification: function (notification) {
console.log(‘NOTIFICATION:’, notification);
},
permissions: {
alert: true,
badge: true,
sound: true,
},
popInitialNotification: true,
requestPermissions: Platform.OS === ‘ios’,
});

```
PushNotification.createChannel(
  {
    channelId: 'class-reminders',
    channelName: 'Class Reminders',
    channelDescription: 'Notifications 10 minutes before classes',
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`Channel created: ${created}`)
);
```

};

const getBatchFromRoll = (roll) => {
const rollNum = parseInt(roll);
if (isNaN(rollNum) || rollNum < 1 || rollNum > 255) return null;

```
for (const [batchLetter, range] of Object.entries(batchRanges)) {
  if (rollNum >= range.start && rollNum <= range.end) {
    return batchLetter;
  }
}
return null;
```

};

const getAnatomyBatchFromRoll = (roll) => {
const rollNum = parseInt(roll);
if (isNaN(rollNum) || rollNum < 1 || rollNum > 255) return null;

```
for (const [batchLetter, range] of Object.entries(anatomyBatchRanges)) {
  if (rollNum >= range.start && rollNum <= range.end) {
    return batchLetter;
  }
}
return null;
```

};

const handleRollNumberChange = async (value) => {
setRollNumber(value);
const detectedBatch = getBatchFromRoll(value);
const detectedAnatomyBatch = getAnatomyBatchFromRoll(value);

```
if (detectedBatch) {
  setBatch(detectedBatch);
  await AsyncStorage.setItem('rollNumber', value);
  await AsyncStorage.setItem('batch', detectedBatch);
} else {
  setBatch('');
}

if (detectedAnatomyBatch) {
  setAnatomyBatch(detectedAnatomyBatch);
  await AsyncStorage.setItem('anatomyBatch', detectedAnatomyBatch);
} else {
  setAnatomyBatch('');
}
```

};

const updateTodayClasses = () => {
const todaySchedule = schedule[currentDay] || [];
const classes = [];

```
todaySchedule.forEach(slot => {
  slot.classes.forEach(classItem => {
    if (classItem.batch === 'ALL' || classItem.batch === batch || classItem.anatomyBatch === anatomyBatch) {
      classes.push({
        ...classItem,
        time: slot.time,
        duration: slot.duration
      });
    }
  });
});

setTodayClasses(classes);
```

};

const scheduleNotificationsForWeek = () => {
// Cancel all existing notifications
PushNotification.cancelAllLocalNotifications();

```
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let notificationId = 1;

days.forEach((day, dayIndex) => {
  const daySchedule = schedule[day] || [];
  
  daySchedule.forEach(slot => {
    slot.classes.forEach(classItem => {
      if (classItem.batch === 'ALL' || classItem.batch === batch || classItem.anatomyBatch === anatomyBatch) {
        const [hours, minutes] = slot.time.split(':').map(Number);
        
        // Create notification date
        const notifDate = new Date();
        const currentDay = notifDate.getDay();
        const daysUntil = (dayIndex - currentDay + 7) % 7;
        
        notifDate.setDate(notifDate.getDate() + daysUntil);
        notifDate.setHours(hours);
        notifDate.setMinutes(minutes - 10); // 10 minutes before
        notifDate.setSeconds(0);
        notifDate.setMilliseconds(0);

        // Only schedule if in the future
        if (notifDate > new Date()) {
          PushNotification.localNotificationSchedule({
            channelId: 'class-reminders',
            id: notificationId++,
            title: '🔔 Class Starting Soon!',
            message: `${classItem.subject} in 10 minutes at ${classItem.venue}`,
            date: notifDate,
            allowWhileIdle: true,
            repeatType: 'week',
          });
        }
      }
    });
  });
});

console.log(`Scheduled ${notificationId - 1} notifications for the week`);
```

};

const enableNotifications = async () => {
if (!rollNumber || !batch || !anatomyBatch) {
Alert.alert(‘Error’, ‘Please enter your roll number first!’);
return;
}

```
setNotificationsEnabled(true);
await AsyncStorage.setItem('notificationsEnabled', 'true');

scheduleNotificationsForWeek();

PushNotification.localNotification({
  channelId: 'class-reminders',
  title: '✓ Notifications Enabled!',
  message: 'You will receive reminders 10 minutes before each class',
});

Alert.alert(
  'Success!',
  'Notifications enabled. You will receive reminders 10 minutes before each class.',
  [{ text: 'OK' }]
);
```

};

const formatTime = (time) => {
const [hours, minutes] = time.split(’:’).map(Number);
const period = hours >= 12 ? ‘PM’ : ‘AM’;
const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getTypeColor = (type) => {
const colors = {
‘Lecture’: ‘#3B82F6’,
‘Tutorial’: ‘#10B981’,
‘Practical’: ‘#F59E0B’,
‘Dissection’: ‘#EF4444’,
‘Demonstration’: ‘#8B5CF6’
};
return colors[type] || ‘#6B7280’;
};

return (
<View style={styles.container}>
<StatusBar barStyle="light-content" backgroundColor="#000" />
<ScrollView style={styles.scrollView}>
<ImageBackground
source={{ uri: ‘https://raw.githubusercontent.com/XenonTheInertG/somc-routine/d7c2ed725eb479da992eab6b89757ed215b8c9d7/IMG_1684.jpeg’ }}
style={styles.header}
imageStyle={styles.headerImage}
>
<View style={styles.headerOverlay} />
<View style={styles.headerContent}>
<Image
source={{ uri: ‘https://raw.githubusercontent.com/XenonTheInertG/somc-routine/799309361a6d8e3b078213d0435abf25b63aae0e/IMG_1682.png’ }}
style={styles.logo}
/>
<View style={styles.headerText}>
<Text style={styles.headerTitle}>SOMC 63 Class Routine</Text>
<Text style={styles.headerSubtitle}>Stay updated with your class timings</Text>
</View>
</View>
</ImageBackground>

```
    <View style={styles.container2}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 Student Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Roll Number (1-255)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your roll number"
            value={rollNumber}
            onChangeText={handleRollNumberChange}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#A0AEC0"
          />
        </View>

        {batch && (
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Batch</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{batch}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Anatomy Batch</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{anatomyBatch}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, notificationsEnabled && styles.buttonEnabled]}
          onPress={enableNotifications}
        >
          <Text style={styles.buttonText}>
            {notificationsEnabled ? '✓ Notifications Enabled' : '🔔 Enable Notifications'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Today's Classes ({currentDay})</Text>
        
        {todayClasses.length > 0 ? (
          todayClasses.map((classItem, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.classHeader}>
                <Text style={styles.classTime}>{formatTime(classItem.time)}</Text>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(classItem.type) }]}>
                  <Text style={styles.typeBadgeText}>{classItem.type}</Text>
                </View>
              </View>
              <Text style={styles.classSubject}>{classItem.subject}</Text>
              <View style={styles.classDetails}>
                <Text style={styles.classDetailText}>📍 {classItem.venue}</Text>
                <Text style={styles.classDetailText}>⏱ {classItem.duration} min</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            {rollNumber 
              ? currentDay === 'Friday' 
                ? '🎉 Friday is off - No classes today!' 
                : 'No classes scheduled for today'
              : 'Enter your roll number to see your schedule'}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Webapp by <Text style={styles.footerCredit}>Mahin, SOMC'63</Text>
        </Text>
      </View>
    </View>
  </ScrollView>
</View>
```

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: ‘#F8F9FA’,
},
scrollView: {
flex: 1,
},
header: {
height: 120,
justifyContent: ‘center’,
},
headerImage: {
resizeMode: ‘cover’,
},
headerOverlay: {
…StyleSheet.absoluteFillObject,
backgroundColor: ‘rgba(0, 0, 0, 0.4)’,
},
headerContent: {
flexDirection: ‘row’,
alignItems: ‘center’,
paddingHorizontal: 20,
gap: 15,
},
logo: {
width: 60,
height: 60,
borderRadius: 12,
backgroundColor: ‘white’,
},
headerText: {
flex: 1,
},
headerTitle: {
fontSize: 24,
fontWeight: ‘bold’,
color: ‘#FFFFFF’,
textShadowColor: ‘rgba(0, 0, 0, 0.5)’,
textShadowOffset: { width: 0, height: 2 },
textShadowRadius: 4,
},
headerSubtitle: {
fontSize: 14,
color: ‘#FFFFFF’,
opacity: 0.95,
textShadowColor: ‘rgba(0, 0, 0, 0.5)’,
textShadowOffset: { width: 0, height: 1 },
textShadowRadius: 3,
},
container2: {
padding: 20,
marginTop: -20,
},
card: {
backgroundColor: ‘#FFFFFF’,
borderRadius: 20,
padding: 24,
marginBottom: 20,
elevation: 4,
shadowColor: ‘#000’,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 8,
},
cardTitle: {
fontSize: 20,
fontWeight: ‘700’,
marginBottom: 20,
color: ‘#1A1A2E’,
},
inputGroup: {
marginBottom: 20,
},
label: {
fontSize: 14,
fontWeight: ‘600’,
marginBottom: 10,
color: ‘#4A5568’,
},
input: {
backgroundColor: ‘#F8F9FA’,
padding: 14,
borderRadius: 12,
fontSize: 16,
borderWidth: 2,
borderColor: ‘#E2E8F0’,
color: ‘#1A1A2E’,
},
infoBox: {
backgroundColor: ‘#F0F4FF’,
padding: 18,
borderRadius: 14,
marginBottom: 20,
borderWidth: 1,
borderColor: ‘#D6E0FF’,
},
infoRow: {
flexDirection: ‘row’,
justifyContent: ‘space-between’,
alignItems: ‘center’,
marginBottom: 12,
},
infoLabel: {
fontSize: 14,
color: ‘#5A67D8’,
fontWeight: ‘500’,
},
badge: {
backgroundColor: ‘#667EEA’,
paddingVertical: 8,
paddingHorizontal: 18,
borderRadius: 20,
},
badgeText: {
color: ‘#FFFFFF’,
fontSize: 14,
fontWeight: ‘700’,
},
button: {
backgroundColor: ‘#667EEA’,
padding: 16,
borderRadius: 12,
alignItems: ‘center’,
elevation: 3,
},
buttonEnabled: {
backgroundColor: ‘#48BB78’,
},
buttonText: {
color: ‘#FFFFFF’,
fontSize: 16,
fontWeight: ‘600’,
},
classCard: {
backgroundColor: ‘#FAFAFA’,
padding: 18,
borderRadius: 16,
marginBottom: 14,
borderLeftWidth: 4,
borderLeftColor: ‘#667EEA’,
elevation: 2,
},
classHeader: {
flexDirection: ‘row’,
justifyContent: ‘space-between’,
alignItems: ‘center’,
marginBottom: 10,
},
classTime: {
fontSize: 15,
fontWeight: ‘700’,
color: ‘#667EEA’,
},
typeBadge: {
paddingVertical: 6,
paddingHorizontal: 12,
borderRadius: 8,
},
typeBadgeText: {
color: ‘#FFFFFF’,
fontSize: 11,
fontWeight: ‘700’,
textTransform: ‘uppercase’,
},
classSubject: {
fontSize: 18,
fontWeight: ‘700’,
marginVertical: 10,
color: ‘#1A1A2E’,
},
classDetails: {
flexDirection: ‘row’,
gap: 16,
},
classDetailText: {
fontSize: 13,
color: ‘#718096’,
fontWeight: ‘500’,
},
emptyText: {
textAlign: ‘center’,
color: ‘#A0AEC0’,
padding: 20,
fontSize: 14,
},
footer: {
padding: 30,
alignItems: ‘center’,
backgroundColor: ‘#FFFFFF’,
borderRadius: 20,
elevation: 4,
},
footerText: {
color: ‘#718096’,
fontSize: 13,
},
footerCredit: {
color: ‘#667EEA’,
fontWeight: ‘700’,
},
});

export default App;
