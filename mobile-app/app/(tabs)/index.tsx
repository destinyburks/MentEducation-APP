import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../../src/theme';

const mentors = [
  { name: 'Marcus Thompson', area: 'Career Development', rating: '4.9', price: '$75' },
  { name: 'Aaliyah Brooks', area: 'Entrepreneurship', rating: '4.8', price: '$80' },
  { name: 'Danielle Carter', area: 'Leadership', rating: '4.9', price: '$70' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topRow}>
          <View>
            <Text style={s.kicker}>Good morning,</Text>
            <Text style={s.title}>Destiny 👋</Text>
            <Text style={s.sub}>Keep learning. Keep growing.</Text>
          </View>
          <TouchableOpacity style={s.bell}><Ionicons name="notifications-outline" size={24} color={colors.navy} /></TouchableOpacity>
        </View>

        <TouchableOpacity style={s.search} onPress={() => router.push('/discover')}>
          <Ionicons name="search-outline" size={22} color={colors.muted} />
          <Text style={s.searchText}>Search mentors or topics</Text>
          <View style={s.filter}><Ionicons name="options-outline" size={20} color={colors.purple} /></View>
        </TouchableOpacity>

        <View style={s.sectionHead}><Text style={s.sectionTitle}>Your Next Session</Text><Text style={s.link}>View all</Text></View>
        <View style={s.nextCard}>
          <View style={s.pill}><Ionicons name="calendar-outline" size={15} color="#C8B5FF" /><Text style={s.pillText}>TOMORROW</Text></View>
          <Text style={s.nextTitle}>Career Clarity & Next Steps</Text>
          <Text style={s.nextMentor}>Jasmine Williams   ★ 4.9</Text>
          <View style={s.sessionMeta}><Ionicons name="time-outline" size={18} color="#E6E0FF" /><Text style={s.metaText}>10:00 AM – 11:00 AM</Text><Text style={s.dot}>•</Text><Ionicons name="videocam-outline" size={18} color="#E6E0FF" /><Text style={s.metaText}>Video Call</Text></View>
          <View style={s.actions}>
            <TouchableOpacity style={s.secondaryBtn}><Text style={s.secondaryText}>View Details</Text></TouchableOpacity>
            <TouchableOpacity style={s.primaryBtn}><Text style={s.primaryText}>Join Session</Text></TouchableOpacity>
          </View>
        </View>

        <Text style={[s.sectionTitle,{marginTop:26}]}>Quick Actions</Text>
        <View style={s.quickRow}>
          {[['calendar-outline','Book a\nSession'],['people-outline','Find\nMentors'],['chatbubble-outline','Messages'],['card-outline','My\nBookings']].map(([icon,label]) => (
            <TouchableOpacity key={label} style={s.quick} onPress={() => label.includes('Find') ? router.push('/discover') : undefined}>
              <Ionicons name={icon as any} size={25} color={colors.purple} />
              <Text style={s.quickText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.sectionHead}><Text style={s.sectionTitle}>Recommended for You</Text><Text style={s.link}>See all</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12}}>
          {mentors.map((m) => (
            <TouchableOpacity key={m.name} style={s.mentorCard} onPress={() => router.push('/mentor/jasmine-williams')}>
              <View style={s.avatar}><Ionicons name="person" size={34} color="#8E7BBE" /></View>
              <Text style={s.tag}>{m.area}</Text>
              <Text style={s.mentorName}>{m.name}</Text>
              <Text style={s.rating}>★ {m.rating}</Text>
              <Text style={s.price}>{m.price}<Text style={s.priceSub}> / session</Text></Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[s.sectionTitle,{marginTop:26}]}>Recent Activity</Text>
        <View style={s.activity}><View style={s.activityIcon}><Ionicons name="calendar-outline" size={22} color={colors.purple} /></View><View style={{flex:1}}><Text style={s.activityTitle}>Session booked with Marcus Thompson</Text><Text style={s.activitySub}>May 27 • 2:00 PM</Text></View><Text style={s.confirmed}>Confirmed</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.white},content:{padding:spacing.lg,paddingBottom:34},topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},kicker:{fontSize:20,fontWeight:'700',color:colors.navy},title:{fontSize:38,fontWeight:'800',color:colors.navy,marginTop:2},sub:{fontSize:16,color:colors.muted,marginTop:4},bell:{width:46,height:46,borderRadius:23,alignItems:'center',justifyContent:'center',backgroundColor:colors.lavender},search:{marginTop:28,borderWidth:1,borderColor:colors.line,borderRadius:radii.md,height:58,flexDirection:'row',alignItems:'center',paddingLeft:16,gap:10},searchText:{flex:1,fontSize:16,color:colors.muted},filter:{width:48,height:48,borderRadius:14,backgroundColor:colors.lavender,alignItems:'center',justifyContent:'center',marginRight:5},sectionHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:26,marginBottom:12},sectionTitle:{fontSize:20,fontWeight:'800',color:colors.navy},link:{fontSize:15,fontWeight:'700',color:colors.purple},nextCard:{backgroundColor:colors.navy,borderRadius:radii.lg,padding:20},pill:{alignSelf:'flex-start',backgroundColor:'#2F266B',borderRadius:radii.pill,paddingHorizontal:12,paddingVertical:7,flexDirection:'row',gap:6,alignItems:'center'},pillText:{color:'#C8B5FF',fontSize:12,fontWeight:'800'},nextTitle:{color:'white',fontSize:24,fontWeight:'800',marginTop:16},nextMentor:{color:'#E9E5FF',fontSize:15,marginTop:7},sessionMeta:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:6,marginTop:18},metaText:{color:'#E6E0FF',fontSize:14},dot:{color:'#8278A8',marginHorizontal:3},actions:{flexDirection:'row',gap:10,marginTop:20},secondaryBtn:{flex:1,height:48,borderWidth:1,borderColor:'#A99EF1',borderRadius:14,alignItems:'center',justifyContent:'center'},secondaryText:{color:'white',fontWeight:'800'},primaryBtn:{flex:1,height:48,borderRadius:14,backgroundColor:colors.purple,alignItems:'center',justifyContent:'center'},primaryText:{color:'white',fontWeight:'800'},quickRow:{flexDirection:'row',gap:10,marginTop:12},quick:{flex:1,minHeight:105,borderRadius:radii.md,backgroundColor:colors.lavender,alignItems:'center',justifyContent:'center',gap:8},quickText:{textAlign:'center',fontSize:13,fontWeight:'700',color:colors.navy},mentorCard:{width:190,borderWidth:1,borderColor:colors.line,borderRadius:radii.md,padding:15,backgroundColor:'white'},avatar:{width:72,height:72,borderRadius:36,backgroundColor:colors.lavenderStrong,alignItems:'center',justifyContent:'center',marginBottom:10},tag:{alignSelf:'flex-start',fontSize:11,fontWeight:'700',color:colors.purple,backgroundColor:colors.lavender,paddingHorizontal:8,paddingVertical:5,borderRadius:radii.pill},mentorName:{fontSize:16,fontWeight:'800',color:colors.ink,marginTop:10},rating:{fontSize:14,color:colors.amber,fontWeight:'700',marginTop:7},price:{fontSize:17,fontWeight:'800',color:colors.ink,marginTop:11},priceSub:{fontSize:12,fontWeight:'500',color:colors.muted},activity:{marginTop:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.md,padding:14,flexDirection:'row',alignItems:'center',gap:12},activityIcon:{width:44,height:44,borderRadius:14,backgroundColor:colors.lavender,alignItems:'center',justifyContent:'center'},activityTitle:{fontWeight:'700',color:colors.ink,fontSize:14},activitySub:{color:colors.muted,marginTop:4,fontSize:13},confirmed:{fontSize:11,fontWeight:'800',color:colors.green,backgroundColor:colors.greenSoft,paddingHorizontal:8,paddingVertical:6,borderRadius:radii.pill}
});
