import React,{useMemo,useState} from 'react';
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from './theme';

const dates=[
 {id:'aug28',day:'Fri',date:'28',month:'Aug',label:'Friday, August 28'},
 {id:'aug29',day:'Sat',date:'29',month:'Aug',label:'Saturday, August 29'},
 {id:'aug31',day:'Mon',date:'31',month:'Aug',label:'Monday, August 31'},
 {id:'sep1',day:'Tue',date:'1',month:'Sep',label:'Tuesday, September 1'},
 {id:'sep2',day:'Wed',date:'2',month:'Sep',label:'Wednesday, September 2'},
];
const slots={
 aug28:['6:30 PM','7:30 PM','8:30 PM'],
 aug29:['10:00 AM','11:30 AM','2:00 PM'],
 aug31:['12:00 PM','4:00 PM','5:30 PM'],
 sep1:['9:30 AM','12:30 PM','3:00 PM','6:00 PM'],
 sep2:['11:00 AM','1:30 PM','4:30 PM'],
};

export default function BookingScreen({mentor,session,onBack,onContinue}){
 const [selectedDate,setSelectedDate]=useState(dates[0]);
 const [selectedTime,setSelectedTime]=useState(null);
 const available=useMemo(()=>slots[selectedDate.id]||[],[selectedDate]);
 const chooseDate=(date)=>{setSelectedDate(date);setSelectedTime(null)};
 return <View style={s.page}>
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
   <View style={s.nav}><TouchableOpacity style={s.icon} onPress={onBack}><Ionicons name="arrow-back" size={21} color={colors.ink}/></TouchableOpacity><Text style={s.navTitle}>Book a Session</Text><View style={s.iconGhost}/></View>
   <View style={s.progress}><View style={s.progressOn}/><View style={s.progressOff}/><View style={s.progressOff}/></View>
   <Text style={s.step}>STEP 1 OF 3</Text><Text style={s.title}>Choose a date & time</Text><Text style={s.subtitle}>Select an available time that works for you.</Text>

   <View style={s.summary}><View style={s.avatar}><Text style={s.initials}>{mentor.initials}</Text></View><View style={{flex:1}}><Text style={s.mentor}>{mentor.name}</Text><Text style={s.session}>{session[0]}</Text><View style={s.meta}><Ionicons name="videocam-outline" size={14} color={colors.muted}/><Text style={s.metaText}>{session[1]} • Video session</Text></View></View><Text style={s.price}>${session[2]}</Text></View>

   <View style={s.sectionHead}><Text style={s.heading}>Select date</Text><View style={s.tz}><Ionicons name="globe-outline" size={13} color={colors.muted}/><Text style={s.tzText}>Your local time</Text></View></View>
   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dates}>
    {dates.map(date=><TouchableOpacity key={date.id} onPress={()=>chooseDate(date)} style={[s.dateCard,selectedDate.id===date.id&&s.dateCardOn]}><Text style={[s.day,selectedDate.id===date.id&&s.white]}>{date.day}</Text><Text style={[s.date,selectedDate.id===date.id&&s.white]}>{date.date}</Text><Text style={[s.month,selectedDate.id===date.id&&s.whiteSoft]}>{date.month}</Text></TouchableOpacity>)}
   </ScrollView>

   <View style={s.sectionHead}><Text style={s.heading}>Available times</Text><Text style={s.slotCount}>{available.length} times</Text></View>
   <View style={s.times}>{available.map(time=><TouchableOpacity key={time} onPress={()=>setSelectedTime(time)} style={[s.time,selectedTime===time&&s.timeOn]}><Ionicons name="time-outline" size={16} color={selectedTime===time?colors.purple:colors.muted}/><Text style={[s.timeText,selectedTime===time&&s.timeTextOn]}>{time}</Text>{selectedTime===time?<Ionicons name="checkmark-circle" size={17} color={colors.purple}/>:null}</TouchableOpacity>)}</View>

   <View style={s.notice}><Ionicons name="information-circle-outline" size={19} color={colors.purple}/><Text style={s.noticeText}>Times are shown in your local time zone. Your selected slot is reserved when booking is completed.</Text></View>

   {selectedTime?<View style={s.selected}><Text style={s.selectedLabel}>YOUR SELECTION</Text><View style={s.selectedRow}><Ionicons name="calendar" size={18} color={colors.purple}/><View><Text style={s.selectedDate}>{selectedDate.label}</Text><Text style={s.selectedTime}>{selectedTime} • {session[1]}</Text></View></View></View>:null}
  </ScrollView>
  <View style={s.bottom}><View><Text style={s.totalLabel}>Session total</Text><Text style={s.total}>${session[2]}</Text></View><TouchableOpacity disabled={!selectedTime} style={[s.continue,!selectedTime&&s.continueDisabled]} onPress={()=>onContinue?.({mentor,session,date:selectedDate,time:selectedTime})}><Text style={s.continueText}>Continue</Text><Ionicons name="arrow-forward" size={17} color="#fff"/></TouchableOpacity></View>
 </View>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:colors.paper},content:{padding:18,paddingBottom:110},nav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},navTitle:{fontSize:15,fontWeight:'900',color:colors.ink},icon:{width:42,height:42,borderRadius:13,backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},iconGhost:{width:42},progress:{flexDirection:'row',gap:6,marginTop:3},progressOn:{height:4,flex:1,borderRadius:4,backgroundColor:colors.purple},progressOff:{height:4,flex:1,borderRadius:4,backgroundColor:'#E6E3ED'},step:{fontSize:9,fontWeight:'900',letterSpacing:1,color:colors.purple,marginTop:18},title:{fontSize:28,fontWeight:'900',letterSpacing:-.9,color:colors.ink,marginTop:6},subtitle:{fontSize:13,color:colors.muted,marginTop:6,marginBottom:17},summary:{flexDirection:'row',alignItems:'center',gap:11,backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:18,padding:14,marginBottom:24},avatar:{width:48,height:48,borderRadius:15,backgroundColor:'#EEE9FF',alignItems:'center',justifyContent:'center'},initials:{fontSize:13,fontWeight:'900',color:colors.purple},mentor:{fontSize:13.5,fontWeight:'900',color:colors.ink},session:{fontSize:11,color:colors.muted,marginTop:2},meta:{flexDirection:'row',alignItems:'center',gap:4,marginTop:5},metaText:{fontSize:9.5,color:colors.muted},price:{fontSize:17,fontWeight:'900',color:colors.ink},sectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:11},heading:{fontSize:16,fontWeight:'900',color:colors.ink},tz:{flexDirection:'row',alignItems:'center',gap:4},tzText:{fontSize:9.5,color:colors.muted},dates:{gap:9,paddingBottom:24},dateCard:{width:66,height:86,borderRadius:16,borderWidth:1,borderColor:colors.line,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},dateCardOn:{backgroundColor:colors.navy,borderColor:colors.navy},day:{fontSize:10,color:colors.muted,fontWeight:'700'},date:{fontSize:23,fontWeight:'900',color:colors.ink,marginVertical:3},month:{fontSize:9.5,color:colors.muted,fontWeight:'700'},white:{color:'#fff'},whiteSoft:{color:'#D8DBE5'},slotCount:{fontSize:10,color:colors.muted,fontWeight:'700'},times:{flexDirection:'row',flexWrap:'wrap',gap:9,marginBottom:18},time:{width:'48.5%',minHeight:48,borderRadius:13,borderWidth:1,borderColor:colors.line,backgroundColor:'#fff',paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:7},timeOn:{borderColor:colors.purple,backgroundColor:'#F8F5FF'},timeText:{fontSize:11.5,fontWeight:'800',color:colors.ink,flex:1},timeTextOn:{color:colors.purple},notice:{flexDirection:'row',alignItems:'flex-start',gap:8,backgroundColor:'#F4F1FF',borderRadius:14,padding:13},noticeText:{fontSize:10.5,lineHeight:16,color:'#625C73',flex:1},selected:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:16,padding:14,marginTop:14},selectedLabel:{fontSize:8.5,fontWeight:'900',letterSpacing:.8,color:colors.purple},selectedRow:{flexDirection:'row',alignItems:'center',gap:9,marginTop:9},selectedDate:{fontSize:12.5,fontWeight:'900',color:colors.ink},selectedTime:{fontSize:10.5,color:colors.muted,marginTop:3},bottom:{position:'absolute',left:0,right:0,bottom:0,minHeight:82,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:colors.line,paddingHorizontal:18,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:15},totalLabel:{fontSize:9.5,color:colors.muted},total:{fontSize:20,fontWeight:'900',color:colors.ink,marginTop:2},continue:{flex:1,maxWidth:210,minHeight:50,borderRadius:14,backgroundColor:colors.purple,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},continueDisabled:{opacity:.4},continueText:{color:'#fff',fontSize:12.5,fontWeight:'900'}});