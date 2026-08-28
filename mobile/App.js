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
import { colors } from './src/theme';

const mentors = [
  { id: 'avery', initials: 'AM', name: 'Avery Morgan', title: 'Career Strategy Mentor', rating: 4.9, reviews: 42, price: 75, category: 'Career', tags: ['Career Growth', 'Interviews'], available: 'Today, 6:30 PM', availableNow: true },
  { id: 'jordan', initials: 'JT', name: 'Jordan Taylor', title: 'Healthcare & Education Mentor', rating: 5.0, reviews: 31, price: 65, category: 'Healthcare', tags: ['Healthcare', 'School'], available: 'Tomorrow, 11:00 AM', availableNow: false },
  { id: 'riley', initials: 'RB', name: 'Riley Brooks', title: 'Business & Leadership Mentor', rating: 4.8, reviews: 57, price: 90, category: 'Business', tags: ['Business', 'Leadership'], available: 'Mon, 4:00 PM', availableNow: false },
  { id: 'maya', initials: 'MC', name: 'Maya Carter', title: 'Technology Career Mentor', rating: 4.9, reviews: 64, price: 80, category: 'Technology', tags: ['Technology', 'Career Change'], available: 'Today, 8:00 PM', availableNow: true },
  { id: 'devon', initials: 'DL', name: 'Devon Lewis', title: 'Real Estate Mentor', rating: 4.7, reviews: 28, price: 60, category: 'Real Estate', tags: ['Real Estate', 'Licensing'], available: 'Tue, 12:30 PM', availableNow: false },
  { id: 'nia', initials: 'NB', name: 'Nia Bennett', title: 'Education & Graduate School Mentor', rating: 5.0, reviews: 22, price: 55, category: 'Education', tags: ['Education', 'Graduate School'], available: 'Tomorrow, 3:30 PM', availableNow: false },
];

const categories = ['All', 'Career', 'Healthcare', 'Business', 'Education', 'Technology', 'Real Estate'];
const priceOptions = [
  { key: 'all', label: 'Any price' },
  { key: 'under60', label: 'Under $60' },
  { key: '60to80', label: '$60–$80' },
  { key: 'over80', label: '$80+' },
];

const tabs = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'find', label: 'Find Mentors', icon: 'search-outline', activeIcon: 'search' },
  { key: 'sessions', label: 'Sessions', icon: 'calendar-outline', activeIcon: 'calendar' },
  { key: 'messages', label: 'Messages', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

function MentorCard({ mentor, saved, onSave, onOpen }) {
  return (
    <TouchableOpacity style={styles.mentorCard} activeOpacity={0.85} onPress={() => onOpen(mentor)}>
      <View style={styles.mentorTop}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{mentor.initials}</Text></View>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{mentor.name}</Text>
          <Text style={styles.mentorTitle}>{mentor.title}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F3A900" />
            <Text style={styles.ratingText}>{mentor.rating.toFixed(1)}</Text>
            <Text style={styles.reviewText}>({mentor.reviews})</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={(e) => { e.stopPropagation?.(); onSave(mentor.id); }}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={colors.purple} />
        </TouchableOpacity>
      </View>
      <View style={styles.tagRow}>
        {mentor.tags.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}
      </View>
      <View style={styles.mentorBottom}>
        <View>
          <Text style={styles.availableLabel}>NEXT AVAILABLE</Text>
          <Text style={styles.availableText}>{mentor.available}</Text>
        </View>
        <View style={styles.priceWrap}>
          <Text style={styles.price}>${mentor.price}</Text><Text style={styles.priceSuffix}> / session</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HomeScreen({ onFindMentors, onOpenMentor }) {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState([]);
  const homeMentors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? mentors.filter((m) => [m.name, m.title, m.category, ...m.tags].some((v) => v.toLowerCase().includes(q))) : mentors.slice(0, 3);
  }, [search]);
  const toggleSave = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.topRow}>
        <View><Text style={styles.wordmark}>Ment<Text style={styles.wordmarkAccent}>Education</Text></Text><Text style={styles.greeting}>Good evening, Destiny 👋</Text></View>
        <TouchableOpacity style={styles.notificationButton}><Ionicons name="notifications-outline" size={22} color={colors.ink} /><View style={styles.notificationDot} /></TouchableOpacity>
      </View>
      <Text style={styles.heroTitle}>What would you like guidance with?</Text>
      <Text style={styles.heroSubtitle}>Find someone who has been where you want to go.</Text>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.muted} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search mentors, careers, skills..." placeholderTextColor="#9297A5" style={styles.searchInput} />
      </View>
      <View style={styles.sessionCard}>
        <Text style={styles.upcomingLabel}>UPCOMING SESSION</Text>
        <Text style={styles.sessionTitle}>Career Strategy Session</Text>
        <Text style={styles.sessionMentor}>Avery Morgan</Text>
        <Text style={styles.sessionMeta}>Tomorrow • 4:00 PM • 60 min</Text>
        <TouchableOpacity style={styles.sessionButton}><Text style={styles.sessionButtonText}>View Session</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></TouchableOpacity>
      </View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Explore mentorship</Text><TouchableOpacity onPress={onFindMentors}><Text style={styles.sectionAction}>See all</Text></TouchableOpacity></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.slice(1).map((category) => <TouchableOpacity key={category} style={styles.categoryCard} onPress={onFindMentors}><View style={styles.categoryIcon}><Ionicons name="sparkles-outline" size={20} color={colors.purple} /></View><Text style={styles.categoryLabel}>{category}</Text></TouchableOpacity>)}
      </ScrollView>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{search ? `Results for “${search}”` : 'Recommended for you'}</Text><TouchableOpacity onPress={onFindMentors}><Text style={styles.sectionAction}>View all</Text></TouchableOpacity></View>
      {homeMentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} saved={saved.includes(mentor.id)} onSave={toggleSave} onOpen={onOpenMentor} />)}
    </ScrollView>
  );
}

function FindMentorsScreen({ onOpenMentor }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState('all');
  const [availableToday, setAvailableToday] = useState(false);
  const [sort, setSort] = useState('recommended');
  const [saved, setSaved] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = mentors.filter((m) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || [m.name, m.title, m.category, ...m.tags].some((v) => v.toLowerCase().includes(q));
      const matchesCategory = category === 'All' || m.category === category || m.tags.includes(category);
      const matchesPrice = price === 'all' || (price === 'under60' && m.price < 60) || (price === '60to80' && m.price >= 60 && m.price <= 80) || (price === 'over80' && m.price > 80);
      const matchesAvailability = !availableToday || m.availableNow;
      return matchesQuery && matchesCategory && matchesPrice && matchesAvailability;
    });
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === 'priceLow') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [query, category, price, availableToday, sort]);

  const toggleSave = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const resetFilters = () => { setCategory('All'); setPrice('all'); setAvailableToday(false); setSort('recommended'); };
  const activeFilterCount = (category !== 'All' ? 1 : 0) + (price !== 'all' ? 1 : 0) + (availableToday ? 1 : 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.findContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.findHeader}>
        <View><Text style={styles.findEyebrow}>MENTOR DISCOVERY</Text><Text style={styles.findTitle}>Find your mentor</Text><Text style={styles.findSubtitle}>Search by goal, profession, skill, or experience.</Text></View>
        <TouchableOpacity style={styles.savedCircle}><Ionicons name="bookmark-outline" size={21} color={colors.purple} />{saved.length ? <View style={styles.savedBadge}><Text style={styles.savedBadgeText}>{saved.length}</Text></View> : null}</TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search mentors or specialties" placeholderTextColor="#9297A5" style={styles.searchInput} returnKeyType="search" />
        {query ? <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={20} color="#A5A8B4" /></TouchableOpacity> : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
        {categories.map((item) => <TouchableOpacity key={item} style={[styles.filterChip, category === item && styles.filterChipActive]} onPress={() => setCategory(item)}><Text style={[styles.filterChipText, category === item && styles.filterChipTextActive]}>{item}</Text></TouchableOpacity>)}
      </ScrollView>

      <View style={styles.filterActionRow}>
        <TouchableOpacity style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]} onPress={() => setShowFilters((v) => !v)}>
          <Ionicons name="options-outline" size={18} color={activeFilterCount ? colors.white : colors.ink} />
          <Text style={[styles.filterButtonText, activeFilterCount > 0 && { color: colors.white }]}>Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {[['recommended','Recommended'],['rating','Top rated'],['priceLow','Price ↑'],['priceHigh','Price ↓']].map(([key,label]) => <TouchableOpacity key={key} style={[styles.sortChip, sort === key && styles.sortChipActive]} onPress={() => setSort(key)}><Text style={[styles.sortChipText, sort === key && styles.sortChipTextActive]}>{label}</Text></TouchableOpacity>)}
        </ScrollView>
      </View>

      {showFilters ? <View style={styles.filterPanel}>
        <View style={styles.panelHeader}><Text style={styles.panelTitle}>Refine results</Text><TouchableOpacity onPress={resetFilters}><Text style={styles.resetText}>Reset</Text></TouchableOpacity></View>
        <Text style={styles.filterLabel}>Session price</Text>
        <View style={styles.wrapRow}>{priceOptions.map((option) => <TouchableOpacity key={option.key} style={[styles.choice, price === option.key && styles.choiceActive]} onPress={() => setPrice(option.key)}><Text style={[styles.choiceText, price === option.key && styles.choiceTextActive]}>{option.label}</Text></TouchableOpacity>)}</View>
        <TouchableOpacity style={styles.availabilityToggle} onPress={() => setAvailableToday((v) => !v)}>
          <View style={[styles.checkbox, availableToday && styles.checkboxActive]}>{availableToday ? <Ionicons name="checkmark" size={15} color="#fff" /> : null}</View>
          <View><Text style={styles.availabilityTitle}>Available today</Text><Text style={styles.availabilitySub}>Show mentors with a session available today.</Text></View>
        </TouchableOpacity>
      </View> : null}

      <View style={styles.resultsHeader}>
        <View><Text style={styles.resultsTitle}>{filtered.length} mentor{filtered.length === 1 ? '' : 's'} found</Text><Text style={styles.resultsSub}>{category === 'All' ? 'Across all mentorship areas' : `Matching ${category}`}</Text></View>
      </View>

      {filtered.length ? filtered.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} saved={saved.includes(mentor.id)} onSave={toggleSave} onOpen={onOpenMentor} />) : <View style={styles.emptyCard}><Ionicons name="search-outline" size={30} color={colors.purple} /><Text style={styles.emptyTitle}>No mentors match those filters</Text><Text style={styles.emptyText}>Try changing the category, price, or availability.</Text><TouchableOpacity style={styles.resetButton} onPress={resetFilters}><Text style={styles.resetButtonText}>Clear filters</Text></TouchableOpacity></View>}
    </ScrollView>
  );
}

function PlaceholderScreen({ icon, title, description }) {
  return <View style={styles.placeholderScreen}><View style={styles.placeholderIcon}><Ionicons name={icon} size={34} color={colors.purple} /></View><Text style={styles.placeholderTitle}>{title}</Text><Text style={styles.placeholderText}>{description}</Text></View>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const openMentor = () => {};
  const content = {
    home: <HomeScreen onFindMentors={() => setActiveTab('find')} onOpenMentor={openMentor} />,
    find: <FindMentorsScreen onOpenMentor={openMentor} />,
    sessions: <PlaceholderScreen icon="calendar-outline" title="My Sessions" description="Upcoming, completed, cancelled, and session details will live here." />,
    messages: <PlaceholderScreen icon="chatbubbles-outline" title="Messages" description="Your mentor conversations and booking messages will live here." />,
    profile: <PlaceholderScreen icon="person-outline" title="Profile" description="Goals, saved mentors, payment settings, notifications, and mentor role upgrade will live here." />,
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
      <View style={styles.content}>{content[activeTab]}</View>
      <View style={styles.tabBar}>{tabs.map((tab) => { const active = activeTab === tab.key; return <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => setActiveTab(tab.key)}><Ionicons name={active ? tab.activeIcon : tab.icon} size={22} color={active ? colors.purple : '#858A98'} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>{tab.label}</Text></TouchableOpacity>; })}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app:{flex:1,backgroundColor:colors.paper},content:{flex:1},screen:{flex:1,backgroundColor:colors.paper},scrollContent:{paddingHorizontal:18,paddingTop:10,paddingBottom:34},findContent:{paddingHorizontal:18,paddingTop:12,paddingBottom:34},
  topRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:24},wordmark:{fontSize:21,fontWeight:'900',letterSpacing:-.8,color:colors.navy},wordmarkAccent:{color:colors.purple2},greeting:{color:colors.muted,marginTop:5,fontSize:13.5,fontWeight:'500'},notificationButton:{width:43,height:43,backgroundColor:colors.white,borderRadius:14,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line},notificationDot:{position:'absolute',right:9,top:8,width:7,height:7,borderRadius:4,backgroundColor:colors.red,borderWidth:1.5,borderColor:colors.white},
  heroTitle:{fontSize:29,lineHeight:34,letterSpacing:-1.05,fontWeight:'800',color:colors.ink,maxWidth:330},heroSubtitle:{marginTop:8,marginBottom:18,color:colors.muted,fontSize:14.5,lineHeight:21},searchBox:{height:54,backgroundColor:colors.white,borderWidth:1,borderColor:colors.line,borderRadius:16,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:10,marginBottom:18},searchInput:{flex:1,height:'100%',color:colors.ink,fontSize:14.5},
  sessionCard:{backgroundColor:colors.navy,borderRadius:22,padding:18,marginBottom:28},upcomingLabel:{fontSize:10,fontWeight:'800',letterSpacing:1,color:'#D9D0FF'},sessionTitle:{color:'#fff',fontSize:21,fontWeight:'800',marginTop:16},sessionMentor:{color:'#F8F7FF',fontWeight:'700',fontSize:13.5,marginTop:14},sessionMeta:{color:'#AEB3C6',fontSize:12,marginTop:3},sessionButton:{marginTop:18,backgroundColor:colors.purple,minHeight:45,borderRadius:13,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},sessionButtonText:{color:'#fff',fontSize:13.5,fontWeight:'800'},
  sectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:13,marginTop:2},sectionTitle:{fontSize:19,fontWeight:'800',letterSpacing:-.45,color:colors.ink},sectionAction:{fontSize:12.5,color:colors.purple,fontWeight:'700'},categoryRow:{gap:10,paddingBottom:25},categoryCard:{width:102,minHeight:94,backgroundColor:'#fff',borderRadius:17,borderWidth:1,borderColor:colors.line,padding:12,justifyContent:'space-between'},categoryIcon:{width:36,height:36,borderRadius:11,backgroundColor:'#F0ECFF',alignItems:'center',justifyContent:'center'},categoryLabel:{fontSize:12,fontWeight:'700',color:colors.ink},
  mentorCard:{backgroundColor:'#fff',borderRadius:18,borderWidth:1,borderColor:colors.line,padding:15,marginBottom:12},mentorTop:{flexDirection:'row',alignItems:'flex-start'},avatar:{width:52,height:52,borderRadius:16,backgroundColor:'#EEE9FF',alignItems:'center',justifyContent:'center'},avatarText:{fontSize:14,fontWeight:'900',color:colors.purple},mentorInfo:{flex:1,marginLeft:12},mentorName:{fontSize:16,fontWeight:'800',color:colors.ink},mentorTitle:{fontSize:12.5,color:colors.muted,marginTop:3},ratingRow:{flexDirection:'row',alignItems:'center',marginTop:7,gap:4},ratingText:{fontSize:12,fontWeight:'800',color:colors.ink},reviewText:{fontSize:11.5,color:colors.muted},saveButton:{width:36,height:36,borderRadius:11,backgroundColor:'#F8F6FF',alignItems:'center',justifyContent:'center'},tagRow:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:14},tag:{backgroundColor:'#F4F2FA',paddingHorizontal:9,paddingVertical:6,borderRadius:999},tagText:{fontSize:10.5,color:'#665F77',fontWeight:'600'},mentorBottom:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',borderTopWidth:1,borderTopColor:colors.line,marginTop:14,paddingTop:13},availableLabel:{fontSize:8.5,fontWeight:'800',letterSpacing:.7,color:colors.muted},availableText:{fontSize:12,fontWeight:'700',color:colors.ink,marginTop:4},priceWrap:{flexDirection:'row',alignItems:'baseline'},price:{fontSize:17,fontWeight:'900',color:colors.ink},priceSuffix:{fontSize:10,color:colors.muted},
  findHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20},findEyebrow:{fontSize:9.5,fontWeight:'900',letterSpacing:1,color:colors.purple},findTitle:{fontSize:30,fontWeight:'900',letterSpacing:-1,color:colors.ink,marginTop:6},findSubtitle:{fontSize:13.5,color:colors.muted,marginTop:6,maxWidth:285,lineHeight:19},savedCircle:{width:43,height:43,borderRadius:14,borderWidth:1,borderColor:colors.line,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},savedBadge:{position:'absolute',right:-3,top:-4,minWidth:17,height:17,borderRadius:9,backgroundColor:colors.purple,alignItems:'center',justifyContent:'center',paddingHorizontal:4},savedBadgeText:{color:'#fff',fontSize:9,fontWeight:'900'},
  filterChips:{gap:8,paddingBottom:16},filterChip:{paddingHorizontal:14,paddingVertical:9,borderRadius:999,backgroundColor:'#fff',borderWidth:1,borderColor:colors.line},filterChipActive:{backgroundColor:colors.navy,borderColor:colors.navy},filterChipText:{fontSize:12,fontWeight:'700',color:'#5F6575'},filterChipTextActive:{color:'#fff'},filterActionRow:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14},filterButton:{height:39,paddingHorizontal:12,borderRadius:11,borderWidth:1,borderColor:colors.line,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',gap:7},filterButtonActive:{backgroundColor:colors.purple,borderColor:colors.purple},filterButtonText:{fontSize:11.5,fontWeight:'800',color:colors.ink},sortRow:{gap:7},sortChip:{height:39,paddingHorizontal:11,borderRadius:11,backgroundColor:'#F3F1F8',justifyContent:'center'},sortChipActive:{backgroundColor:'#EEE9FF'},sortChipText:{fontSize:10.5,fontWeight:'700',color:colors.muted},sortChipTextActive:{color:colors.purple},
  filterPanel:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:17,padding:15,marginBottom:17},panelHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},panelTitle:{fontSize:15,fontWeight:'800',color:colors.ink},resetText:{fontSize:11.5,fontWeight:'800',color:colors.purple},filterLabel:{fontSize:11,fontWeight:'800',color:colors.muted,marginTop:16,marginBottom:9,textTransform:'uppercase',letterSpacing:.5},wrapRow:{flexDirection:'row',flexWrap:'wrap',gap:8},choice:{paddingHorizontal:12,paddingVertical:9,borderRadius:10,borderWidth:1,borderColor:colors.line},choiceActive:{borderColor:colors.purple,backgroundColor:'#F6F3FF'},choiceText:{fontSize:11,color:colors.muted,fontWeight:'700'},choiceTextActive:{color:colors.purple},availabilityToggle:{flexDirection:'row',alignItems:'center',gap:10,marginTop:17,paddingTop:15,borderTopWidth:1,borderTopColor:colors.line},checkbox:{width:22,height:22,borderRadius:7,borderWidth:1.5,borderColor:'#C8CAD3',alignItems:'center',justifyContent:'center'},checkboxActive:{backgroundColor:colors.purple,borderColor:colors.purple},availabilityTitle:{fontSize:12.5,fontWeight:'800',color:colors.ink},availabilitySub:{fontSize:10.5,color:colors.muted,marginTop:2},
  resultsHeader:{marginTop:5,marginBottom:12},resultsTitle:{fontSize:17,fontWeight:'800',color:colors.ink},resultsSub:{fontSize:11.5,color:colors.muted,marginTop:3},emptyCard:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:18,padding:28,alignItems:'center'},emptyTitle:{fontSize:15,fontWeight:'800',color:colors.ink,marginTop:10},emptyText:{fontSize:12,color:colors.muted,textAlign:'center',marginTop:5,lineHeight:18},resetButton:{marginTop:14,backgroundColor:colors.purple,paddingHorizontal:15,paddingVertical:10,borderRadius:10},resetButtonText:{color:'#fff',fontWeight:'800',fontSize:11.5},
  placeholderScreen:{flex:1,alignItems:'center',justifyContent:'center',padding:30},placeholderIcon:{width:70,height:70,borderRadius:24,backgroundColor:'#EEE9FF',alignItems:'center',justifyContent:'center'},placeholderTitle:{fontSize:24,fontWeight:'900',color:colors.ink,marginTop:18},placeholderText:{fontSize:13.5,lineHeight:20,textAlign:'center',color:colors.muted,marginTop:8,maxWidth:320},
  tabBar:{minHeight:68,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:colors.line,flexDirection:'row',paddingHorizontal:5,paddingTop:8,paddingBottom:7},tabItem:{flex:1,alignItems:'center',justifyContent:'center',gap:4},tabLabel:{fontSize:9.5,color:'#858A98',fontWeight:'600'},tabLabelActive:{color:colors.purple,fontWeight:'800'},
});