import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const residents = [
  {
    id: 'res-101-a',
    flatNumber: 'A-101',
    names: 'Aarav & Kavya Shah',
    contact: '+91 98765 10101',
    role: 'Owner',
    birthday: '12 Aug',
    anniversary: '22 Dec',
    maintenanceDue: '₹3,500 due by 10 Jul 2026',
  },
  {
    id: 'res-204-b',
    flatNumber: 'B-204',
    names: 'Meera Nair',
    contact: '+91 98765 20404',
    role: 'Tenant',
    birthday: '03 Jul',
    anniversary: '—',
    maintenanceDue: '₹3,500 due by 10 Jul 2026',
  },
];

const notices = [
  {
    id: 'notice-water',
    title: 'Water tank cleaning',
    date: '06 Jul 2026',
    body: 'Water supply will pause from 10:00 AM to 1:00 PM for scheduled tank cleaning.',
  },
  {
    id: 'notice-meeting',
    title: 'Monthly committee meeting',
    date: '12 Jul 2026',
    body: 'Residents can send agenda points to the committee by 10 Jul.',
  },
];

const contacts = [
  { id: 'chairperson', name: 'R. Patel', label: 'Committee Chairperson', phone: '+91 90000 11111' },
  { id: 'treasurer', name: 'S. Singh', label: 'Treasurer', phone: '+91 90000 22222' },
  { id: 'plumber', name: 'QuickFix Plumbing', label: 'Plumber', phone: '+91 90000 33333' },
  { id: 'electrician', name: 'BrightLine Electrical', label: 'Electrician', phone: '+91 90000 44444' },
  { id: 'lift', name: 'Elevate Care', label: 'Lift Operator', phone: '+91 90000 55555' },
];

const initialComplaints = [
  {
    id: 'cmp-1',
    title: 'Basement light not working',
    category: 'Electrical',
    status: 'In Progress',
    updatedAt: '02 Jul 2026',
  },
];

const pendingApprovals = [
  { id: 'new-302', flatNumber: 'C-302', names: 'Nisha Rao', role: 'Tenant', contact: '+91 98888 30202' },
  { id: 'new-105', flatNumber: 'A-105', names: 'Vikram Desai', role: 'Owner', contact: '+91 98888 10505' },
];

const quickTabs = ['Home', 'Flat', 'Notices', 'Dues', 'Contacts', 'Complaints'];

export default function App() {
  const [currentResident, setCurrentResident] = useState(residents[0]);
  const [activeTab, setActiveTab] = useState('Home');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('General');
  const [showRegister, setShowRegister] = useState(false);

  const reminders = useMemo(
    () => [
      `${currentResident.names}: birthday ${currentResident.birthday}`,
      currentResident.anniversary === '—'
        ? 'No anniversary date saved for this flat.'
        : `${currentResident.names}: anniversary ${currentResident.anniversary}`,
      `Maintenance reminder: ${currentResident.maintenanceDue}`,
      'Complaint status updates arrive as resident notifications.',
    ],
    [currentResident],
  );

  const submitComplaint = () => {
    if (!complaintTitle.trim()) {
      Alert.alert('Complaint title required', 'Please describe the issue before submitting.');
      return;
    }

    setComplaints((existing) => [
      {
        id: `cmp-${Date.now()}`,
        title: complaintTitle.trim(),
        category: complaintCategory.trim() || 'General',
        status: 'Submitted',
        updatedAt: 'Today',
      },
      ...existing,
    ]);
    setComplaintTitle('');
    setComplaintCategory('General');
    Alert.alert('Complaint submitted', 'The committee/admin team has been notified.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#172554" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Resident-only mobile app</Text>
          <Text style={styles.title}>Diamond Square</Text>
          <Text style={styles.subtitle}>Welcome, {currentResident.names}</Text>
        </View>
        <TouchableOpacity style={styles.switchButton} onPress={() => setShowRegister(true)}>
          <Text style={styles.switchText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.sectionTitle}>Login demo</Text>
        <Text style={styles.muted}>Only approved owners and tenants can enter. Switch resident to verify flat privacy.</Text>
        <View style={styles.residentSwitchRow}>
          {residents.map((resident) => (
            <TouchableOpacity
              key={resident.id}
              style={[styles.pill, currentResident.id === resident.id && styles.pillActive]}
              onPress={() => currentResident.id !== resident.id && setCurrentResident(resident)}
            >
              <Text style={[styles.pillText, currentResident.id === resident.id && styles.pillTextActive]}>
                {resident.flatNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'Home' && <Home reminders={reminders} pendingApprovals={pendingApprovals} />}
        {activeTab === 'Flat' && <FlatDetails resident={currentResident} />}
        {activeTab === 'Notices' && <NoticeBoard />}
        {activeTab === 'Dues' && <MaintenanceDue due={currentResident.maintenanceDue} />}
        {activeTab === 'Contacts' && <ImportantContacts />}
        {activeTab === 'Complaints' && (
          <Complaints
            complaints={complaints}
            complaintTitle={complaintTitle}
            complaintCategory={complaintCategory}
            setComplaintTitle={setComplaintTitle}
            setComplaintCategory={setComplaintCategory}
            submitComplaint={submitComplaint}
          />
        )}
      </ScrollView>

      <RegistrationModal visible={showRegister} onClose={() => setShowRegister(false)} />
    </SafeAreaView>
  );
}

function Home({ reminders, pendingApprovals }) {
  return (
    <>
      <FeatureCard title="Admin approval queue" badge={`${pendingApprovals.length} pending`}>
        <Text style={styles.bodyText}>New registrations stay locked until a committee/admin member verifies the flat and shares OTP approval.</Text>
        {pendingApprovals.map((user) => (
          <View key={user.id} style={styles.listRow}>
            <View>
              <Text style={styles.rowTitle}>{user.names}</Text>
              <Text style={styles.muted}>{user.flatNumber} • {user.role} • {user.contact}</Text>
            </View>
            <Text style={styles.statusPending}>Pending</Text>
          </View>
        ))}
      </FeatureCard>
      <FeatureCard title="Reminder notifications">
        {reminders.map((reminder) => (
          <Text key={reminder} style={styles.bullet}>• {reminder}</Text>
        ))}
      </FeatureCard>
    </>
  );
}

function FlatDetails({ resident }) {
  return (
    <FeatureCard title="My flat directory">
      <Text style={styles.privacyBanner}>Privacy enabled: residents can see only their own flat details.</Text>
      <Info label="Flat number" value={resident.flatNumber} />
      <Info label="Resident names" value={resident.names} />
      <Info label="Contact number" value={resident.contact} />
      <Info label="Owner / tenant" value={resident.role} />
      <Info label="Birthday" value={resident.birthday} />
      <Info label="Anniversary" value={resident.anniversary} />
    </FeatureCard>
  );
}

function NoticeBoard() {
  return (
    <FeatureCard title="Notice board">
      <Text style={styles.bodyText}>Admin/committee announcements replace scattered WhatsApp notices and can trigger resident pop-up notifications.</Text>
      {notices.map((notice) => (
        <View key={notice.id} style={styles.notice}>
          <Text style={styles.noticeDate}>{notice.date}</Text>
          <Text style={styles.rowTitle}>{notice.title}</Text>
          <Text style={styles.bodyText}>{notice.body}</Text>
        </View>
      ))}
    </FeatureCard>
  );
}

function MaintenanceDue({ due }) {
  return (
    <FeatureCard title="Maintenance dues">
      <Text style={styles.bodyText}>View-only reminders for now. No payment gateway is connected.</Text>
      <View style={styles.dueBox}>
        <Text style={styles.dueLabel}>Current reminder</Text>
        <Text style={styles.dueText}>{due}</Text>
      </View>
      <Text style={styles.bullet}>• Due date and reminder notification support</Text>
      <Text style={styles.bullet}>• Admin can update dues in the future backend</Text>
    </FeatureCard>
  );
}

function ImportantContacts() {
  return (
    <FeatureCard title="Important contacts">
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.contactRow}>
            <View>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.muted}>{item.label}</Text>
            </View>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        )}
      />
    </FeatureCard>
  );
}

function Complaints({ complaints, complaintTitle, complaintCategory, setComplaintTitle, setComplaintCategory, submitComplaint }) {
  return (
    <FeatureCard title="Complaint system">
      <Text style={styles.bodyText}>Residents can raise complaints and receive status update notifications from admin.</Text>
      <TextInput style={styles.input} placeholder="Complaint title" value={complaintTitle} onChangeText={setComplaintTitle} />
      <TextInput style={styles.input} placeholder="Category" value={complaintCategory} onChangeText={setComplaintCategory} />
      <TouchableOpacity style={styles.primaryButton} onPress={submitComplaint}>
        <Text style={styles.primaryButtonText}>Submit complaint</Text>
      </TouchableOpacity>
      {complaints.map((complaint) => (
        <View key={complaint.id} style={styles.complaintRow}>
          <View>
            <Text style={styles.rowTitle}>{complaint.title}</Text>
            <Text style={styles.muted}>{complaint.category} • Updated {complaint.updatedAt}</Text>
          </View>
          <Text style={styles.status}>{complaint.status}</Text>
        </View>
      ))}
    </FeatureCard>
  );
}

function RegistrationModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalArea}>
        <Text style={styles.modalTitle}>Resident registration</Text>
        <Text style={styles.bodyText}>Submit owner/tenant details. Admin verifies the flat, shares OTP, and then activates login access.</Text>
        {['Full name', 'Flat number', 'Contact number', 'Owner or tenant'].map((placeholder) => (
          <TextInput key={placeholder} style={styles.input} placeholder={placeholder} />
        ))}
        <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
          <Text style={styles.primaryButtonText}>Send for admin approval</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

function FeatureCard({ title, badge, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef2ff' },
  header: { backgroundColor: '#172554', padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: '#bfdbfe', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#ffffff', fontSize: 30, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#dbeafe', marginTop: 4 },
  switchButton: { backgroundColor: '#facc15', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  switchText: { color: '#172554', fontWeight: '800' },
  loginCard: { margin: 16, marginBottom: 8, padding: 16, backgroundColor: '#ffffff', borderRadius: 22, shadowColor: '#1e293b', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  residentSwitchRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  pill: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: '#e2e8f0' },
  pillActive: { backgroundColor: '#2563eb' },
  pillText: { color: '#334155', fontWeight: '700' },
  pillTextActive: { color: '#ffffff' },
  tabBar: { paddingLeft: 16, paddingVertical: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, marginRight: 8, backgroundColor: '#dbeafe' },
  activeTab: { backgroundColor: '#172554' },
  tabText: { color: '#1d4ed8', fontWeight: '700' },
  activeTabText: { color: '#ffffff' },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 18, marginBottom: 16, shadowColor: '#1e293b', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: '#0f172a', fontSize: 18, fontWeight: '800' },
  badge: { overflow: 'hidden', backgroundColor: '#fef3c7', color: '#92400e', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, fontWeight: '700' },
  bodyText: { color: '#475569', lineHeight: 21, marginBottom: 10 },
  muted: { color: '#64748b', fontSize: 13 },
  bullet: { color: '#334155', marginVertical: 4, lineHeight: 20 },
  listRow: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  rowTitle: { color: '#0f172a', fontWeight: '800', marginBottom: 3 },
  statusPending: { color: '#b45309', fontWeight: '800' },
  privacyBanner: { backgroundColor: '#dcfce7', color: '#166534', padding: 10, borderRadius: 14, marginBottom: 10, fontWeight: '700' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', gap: 18 },
  infoLabel: { color: '#64748b', flex: 1 },
  infoValue: { color: '#0f172a', fontWeight: '800', flex: 1.2, textAlign: 'right' },
  notice: { padding: 14, backgroundColor: '#f8fafc', borderRadius: 16, marginTop: 10 },
  noticeDate: { color: '#2563eb', fontWeight: '800', marginBottom: 4 },
  dueBox: { backgroundColor: '#eff6ff', borderRadius: 18, padding: 18, marginVertical: 10 },
  dueLabel: { color: '#1d4ed8', fontWeight: '700' },
  dueText: { color: '#0f172a', fontWeight: '900', fontSize: 22, marginTop: 6 },
  contactRow: { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  phone: { color: '#2563eb', fontWeight: '800', flex: 1, textAlign: 'right' },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 13, marginBottom: 10, color: '#0f172a' },
  primaryButton: { backgroundColor: '#2563eb', borderRadius: 16, padding: 14, alignItems: 'center', marginVertical: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900' },
  secondaryButton: { borderColor: '#2563eb', borderWidth: 1, borderRadius: 16, padding: 14, alignItems: 'center', marginVertical: 8 },
  secondaryButtonText: { color: '#2563eb', fontWeight: '900' },
  complaintRow: { marginTop: 10, padding: 14, backgroundColor: '#f8fafc', borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  status: { color: '#166534', fontWeight: '900' },
  modalArea: { flex: 1, padding: 22, backgroundColor: '#ffffff' },
  modalTitle: { color: '#0f172a', fontSize: 28, fontWeight: '900', marginBottom: 10 },
});
