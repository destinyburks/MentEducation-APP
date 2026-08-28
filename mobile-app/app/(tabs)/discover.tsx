import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../../src/theme';

const categories = ['All Categories','Business','Career','Academic','Life'];
const mentors = [
  {name:'Jasmine Williams',field:'Career Development',rating:'4.9',sessions:243,price:85,availability:'Available today'},
  {name:'Marcus Thompson',field:'Entrepreneurship',rating:'4.8',sessions:178,price:80,availability:'Available tomorrow'},
  {name:'Aaliyah Brooks',field:'Academic Success',rating:'4.9',sessions:132,price:60,availability:'Available today'},
  {name:'Daniel Carter',field:'Business & Strategy',rating:'4.8',sessions:98,price:75,availability:'Available in 2 days'},
];

export default function DiscoverScreen(){
  return <SafeAreaView style={s.safe} edges={['top']}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.head}><Text style={s.title}>Discover Mentors</Text><TouchableOpacity style={s.icon}><Ionicons name="options-outline" size={22} color={colors.purple}/></TouchableOpacity></View>
    <View style={s.search}><Ionicons name="search-outline" size={21} color={colors.muted}/><TextInput placeholder="Search mentors or topics" placeholderTextColor={colors.muted} style={s.input}/></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{categories.map((c,i)=><TouchableOpacity key={c} style={[s.chip,i===0&&s.chipActive]}><Text style={[s.chipText,i===0&&s.chipTextActive]}>{c}</Text></TouchableOpacity>)}</ScrollView>
    <View style={s.sectionHead}><Text style={s.sectionTitle}>Popular Categories</Text><Text style={s.link}>See all</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10}}>{[['briefcase-outline','Career Development'],['rocket-outline','Entrepreneurship'],['trending-up-outline','Business & Strategy'],['school-outline','Academic Success']].map(([icon,label])=><View key={label} style={s.category}><Ionicons name={icon as any} size={24} color={colors.purple}/><Text style={s.catText}>{label}</Text></View>)}</ScrollView>
    <View style={s.sectionHead}><Text style={s.sectionTitle}>Top Rated Mentors</Text><Text style={s.link}>See all</Text></View>
    {mentors.map((m)=><TouchableOpacity key={m.name} style={s.card} onPress={()=>router.push('/mentor/jasmine-williams')}>
      <View style={s.avatar}><Ionicons name="person" size={32} color="#8E7BBE"/></View>
      <View style={{flex:1}}><View style={s.nameRow}><Text style={s.name}>{m.name}</Text><Ionicons name="checkmark-circle" size={16} color={colors.purple}/></View><Text style={s.tag}>{m.field}</Text><Text style={s.meta}>★ {m.rating}   •   {m.sessions} sessions</Text><Text style={s.available}>{m.availability}</Text></View>
      <View style={s.priceBox}><Text style={s.price}>${m.price}</Text><Text style={s.per}>/session</Text><Ionicons name="heart-outline" size={23} color={colors.purple}/></View>
    </TouchableOpacity>)}
  </ScrollView></SafeAreaView>
}

const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.white},content:{padding:spacing.lg,paddingBottom:30},head:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{fontSize:28,fontWeight:'800',color:colors.navy},icon:{width:44,height:44,borderRadius:14,backgroundColor:colors.lavender,alignItems:'center',justifyContent:'center'},search:{height:54,borderWidth:1,borderColor:colors.line,borderRadius:radii.md,flexDirection:'row',alignItems:'center',paddingHorizontal:15,gap:9,marginTop:18},input:{flex:1,fontSize:16,color:colors.ink},chips:{gap:9,paddingVertical:16},chip:{paddingHorizontal:15,paddingVertical:9,borderRadius:radii.pill,backgroundColor:colors.lavender},chipActive:{backgroundColor:colors.purple},chipText:{fontSize:13,fontWeight:'700',color:colors.purpleDark},chipTextActive:{color:'white'},sectionHead:{marginTop:18,marginBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},sectionTitle:{fontSize:19,fontWeight:'800',color:colors.navy},link:{fontSize:14,fontWeight:'700',color:colors.purple},category:{width:132,minHeight:112,borderWidth:1,borderColor:colors.line,borderRadius:radii.md,padding:14,justifyContent:'space-between'},catText:{fontSize:13,fontWeight:'700',color:colors.ink},card:{borderWidth:1,borderColor:colors.line,borderRadius:radii.md,padding:14,flexDirection:'row',gap:12,marginBottom:12,backgroundColor:'white'},avatar:{width:72,height:72,borderRadius:36,backgroundColor:colors.lavenderStrong,alignItems:'center',justifyContent:'center'},nameRow:{flexDirection:'row',alignItems:'center',gap:5},name:{fontSize:16,fontWeight:'800',color:colors.ink},tag:{alignSelf:'flex-start',marginTop:5,fontSize:11,fontWeight:'700',color:colors.purple,backgroundColor:colors.lavender,paddingHorizontal:8,paddingVertical:4,borderRadius:radii.pill},meta:{fontSize:12,color:colors.muted,marginTop:7},available:{alignSelf:'flex-start',fontSize:11,fontWeight:'700',color:colors.green,backgroundColor:colors.greenSoft,paddingHorizontal:8,paddingVertical:4,borderRadius:radii.pill,marginTop:7},priceBox:{alignItems:'flex-end',gap:2},price:{fontSize:18,fontWeight:'800',color:colors.ink},per:{fontSize:11,color:colors.muted,marginBottom:14}})
