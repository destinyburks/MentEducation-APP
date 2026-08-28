import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from './src/theme';

const categories = [
  { label: 'Career', icon: 'briefcase-outline' },
  { label: 'Healthcare', icon: 'medkit-outline' },
  { label: 'Business', icon: 'business-outline' },
  { label: 'Education', icon: 'school-outline' },
  { label: 'Technology', icon: 'laptop-outline' },
  { label: 'Real Estate', icon: 'home-outline' },
];

const mentors = [
  {
    initials: 'AM',
    name: 'Avery Morgan',
    title: 'Career Strategy Mentor',
    rating: '4.9',
    reviews: '42',
    price: '$75',
    tags: ['Career Growth', 'Interviews'],
    available: 'Today, 6:30 PM',
  },
  {
    initials: 'JT',
    name: 'Jordan Taylor',
    title: 'Healthcare & Education Mentor',
    rating: '5.0',
    reviews: '31',
    price: '$65',
    tags: ['Healthcare', 'School'],
    available: 'Tomorrow, 11:00 AM',
  },
  {
    initials: 'RB',
    name: 'Riley Brooks',
    title: 'Business Mentor',
    rating: '4.8',
    reviews: '57',
    price: '$90',
    tags: ['Business', 'Leadership'],
    available: 'Mon, 4:00 PM',
  },
];

const tabs = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'find', label: 'Find Mentors', icon: 'search-outline', activeIcon: 'search' },
  { key: 'sessions', label: 'Sessions', icon: 'calendar-outline', activeIcon: 'calendar' },
  { key: 'messages', label: 'Messages', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity activeOpacity={0.75}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function HomeScreen({ onFindMentors }) {
  const [search, setSearch] = useState('');
  const filteredMentors = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return mentors;
    return mentors.filter((mentor) =>
      [mentor.name, mentor.title, ...mentor.tags].some((field) =>
        field.toLowerCase().includes(value)
      )
    );
  }, [search]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.wordmark}>
            Ment<Text style={styles.wordmarkAccent}>Education</Text>
          </Text>
          <Text style={styles.greeting}>Good evening, Destiny 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.75}>
          <Ionicons name="notifications-outline" size={22} color={colors.ink} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroCopy}>
        <Text style={styles.heroTitle}>What would you like guidance with?</Text>
        <Text style={styles.heroSubtitle}>
          Find someone who has been where you want to go.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search mentors, careers, skills..."
          placeholderTextColor="#9297A5"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {search.length > 0 ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#A5A8B4" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.sessionCard}>
        <View style={styles.sessionTopLine}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>UPCOMING SESSION</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.sessionTitle}>Career Strategy Session</Text>
        <View style={styles.sessionMentorRow}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>AM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sessionMentor}>Avery Morgan</Text>
            <Text style={styles.sessionMeta}>Tomorrow • 4:00 PM • 60 min</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sessionButton} activeOpacity={0.8}>
          <Text style={styles.sessionButtonText}>View Session</Text>
          <Ionicons name="arrow-forward" size={17} color={colors.white} />
        </TouchableOpacity>
      </View>

      <SectionHeader title="Explore mentorship" action="See all" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.label}
            style={styles.categoryCard}
            activeOpacity={0.75}
            onPress={onFindMentors}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name={category.icon} size={22} color={colors.purple} />
            </View>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader
        title={search ? `Results for “${search}”` : 'Recommended for you'}
        action={search ? undefined : 'View all'}
      />

      {filteredMentors.length ? (
        filteredMentors.map((mentor) => (
          <TouchableOpacity key={mentor.name} style={styles.mentorCard} activeOpacity={0.8}>
            <View style={styles.mentorTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{mentor.initials}</Text>
              </View>
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <Text style={styles.mentorTitle}>{mentor.title}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={15} color={colors.gold} />
                  <Text style={styles.ratingText}>{mentor.rating}</Text>
                  <Text style={styles.reviewText}>({mentor.reviews})</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.saveButton}>
                <Ionicons name="bookmark-outline" size={20} color={colors.purple} />
              </TouchableOpacity>
            </View>

            <View style={styles.tagRow}>
              {mentor.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.mentorBottom}>
              <View>
                <Text style={styles.availableLabel}>NEXT AVAILABLE</Text>
                <Text style={styles.availableText}>{mentor.available}</Text>
              </View>
              <View style={styles.priceWrap}>
                <Text style={styles.price}>{mentor.price}</Text>
                <Text style={styles.priceSuffix}> / session</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="search-outline" size={30} color={colors.purple} />
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>Try a broader topic or mentor specialty.</Text>
        </View>
      )}

      <View style={styles.discoveryBanner}>
        <View style={styles.discoveryIcon}>
          <Ionicons name="sparkles" size={20} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.discoveryTitle}>Not sure who you need?</Text>
          <Text style={styles.discoveryText}>
            Tell us your goal and we’ll help narrow down your mentor match.
          </Text>
        </View>
        <TouchableOpacity onPress={onFindMentors}>
          <Ionicons name="chevron-forward" size={22} color={colors.purple} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PlaceholderScreen({ icon, title, description }) {
  return (
    <View style={styles.placeholderScreen}>
      <View style={styles.placeholderIcon}>
        <Ionicons name={icon} size={34} color={colors.purple} />
      </View>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderText}>{description}</Text>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const content = {
    home: <HomeScreen onFindMentors={() => setActiveTab('find')} />,
    find: (
      <PlaceholderScreen
        icon="search-outline"
        title="Find Mentors"
        description="Mentor search, filtering, and discovery are the next screen in the Mentee journey."
      />
    ),
    sessions: (
      <PlaceholderScreen
        icon="calendar-outline"
        title="My Sessions"
        description="Upcoming, completed, cancelled, and session details will live here."
      />
    ),
    messages: (
      <PlaceholderScreen
        icon="chatbubbles-outline"
        title="Messages"
        description="Your mentor conversations and booking messages will live here."
      />
    ),
    profile: (
      <PlaceholderScreen
        icon="person-outline"
        title="Profile"
        description="Goals, saved mentors, payment settings, notifications, and mentor role upgrade will live here."
      />
    ),
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
      <View style={styles.content}>{content[activeTab]}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              activeOpacity={0.75}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? colors.purple : '#858A98'}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.paper },
  content: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.paper },
  scrollContent: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 34 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  wordmark: { fontSize: 21, fontWeight: '900', letterSpacing: -0.8, color: colors.navy },
  wordmarkAccent: { color: colors.purple2 },
  greeting: { color: colors.muted, marginTop: 5, fontSize: 13.5, fontWeight: '500' },
  notificationButton: { width: 43, height: 43, backgroundColor: colors.white, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  notificationDot: { position: 'absolute', right: 9, top: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.red, borderWidth: 1.5, borderColor: colors.white },
  heroCopy: { marginBottom: 18 },
  heroTitle: { fontSize: 29, lineHeight: 34, letterSpacing: -1.05, fontWeight: '800', color: colors.ink, maxWidth: 330 },
  heroSubtitle: { marginTop: 8, color: colors.muted, fontSize: 14.5, lineHeight: 21 },
  searchBox: { height: 54, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  searchInput: { flex: 1, height: '100%', color: colors.ink, fontSize: 14.5 },
  sessionCard: { backgroundColor: colors.navy, borderRadius: 22, padding: 18, marginBottom: 28, shadowColor: colors.navy, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 4 },
  sessionTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#27204B', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  liveDot: { width: 6, height: 6, backgroundColor: '#9F83FF', borderRadius: 3 },
  liveText: { color: '#D9D0FF', fontSize: 9.5, letterSpacing: 0.8, fontWeight: '800' },
  sessionTitle: { color: colors.white, fontSize: 21, letterSpacing: -0.5, fontWeight: '800', marginTop: 18, marginBottom: 15 },
  sessionMentorRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  smallAvatar: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#38266F' },
  smallAvatarText: { color: '#E3DBFF', fontSize: 12, fontWeight: '800' },
  sessionMentor: { color: '#F8F7FF', fontWeight: '700', fontSize: 13.5 },
  sessionMeta: { color: '#AEB3C6', fontSize: 12, marginTop: 3 },
  sessionButton: { marginTop: 18, backgroundColor: colors.purple, minHeight: 45, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sessionButtonText: { color: colors.white, fontSize: 13.5, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, marginTop: 2 },
  sectionTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.45, color: colors.ink },
  sectionAction: { fontSize: 12.5, color: colors.purple, fontWeight: '700' },
  categoryRow: { gap: 10, paddingRight: 12, paddingBottom: 27 },
  categoryCard: { width: 108, minHeight: 108, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 13, justifyContent: 'space-between' },
  categoryIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { fontSize: 12.5, color: colors.ink, fontWeight: '700', lineHeight: 16 },
  mentorCard: { backgroundColor: colors.white, borderRadius: 19, borderWidth: 1, borderColor: colors.line, padding: 15, marginBottom: 12 },
  mentorTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: colors.purple, fontSize: 15, fontWeight: '900' },
  mentorInfo: { flex: 1 },
  mentorName: { fontSize: 16, fontWeight: '800', color: colors.ink, letterSpacing: -0.2 },
  mentorTitle: { fontSize: 12.5, color: colors.muted, marginTop: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  ratingText: { color: colors.ink, fontSize: 11.5, fontWeight: '800' },
  reviewText: { color: colors.muted, fontSize: 11 },
  saveButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FAF8FF', alignItems: 'center', justifyContent: 'center' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 13 },
  tag: { backgroundColor: '#F5F3FB', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  tagText: { fontSize: 10.5, color: '#665F76', fontWeight: '600' },
  mentorBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#F0F0F5' },
  availableLabel: { fontSize: 8.5, letterSpacing: 0.7, color: colors.muted, fontWeight: '800' },
  availableText: { fontSize: 11.5, color: colors.green, fontWeight: '700', marginTop: 4 },
  priceWrap: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 17, color: colors.ink, fontWeight: '900' },
  priceSuffix: { fontSize: 9.5, color: colors.muted },
  emptyCard: { padding: 28, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', marginBottom: 14 },
  emptyTitle: { color: colors.ink, fontWeight: '800', fontSize: 15, marginTop: 10 },
  emptyText: { color: colors.muted, fontSize: 12.5, marginTop: 5 },
  discoveryBanner: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#F2EEFF', borderRadius: 18, padding: 15, marginTop: 6 },
  discoveryIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  discoveryTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  discoveryText: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  tabBar: { minHeight: 72, paddingTop: 8, paddingBottom: 7, paddingHorizontal: 5, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', justifyContent: 'space-around' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 9.5, color: '#858A98', fontWeight: '600' },
  tabLabelActive: { color: colors.purple, fontWeight: '800' },
  placeholderScreen: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 },
  placeholderIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  placeholderTitle: { color: colors.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.6 },
  placeholderText: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
});
