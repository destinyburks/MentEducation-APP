import React,{useState} from 'react';
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from './theme';

export default function BookingReviewScreen({booking,onBack,onEdit,onContinue}){
 const [agreed,setAgreed]=useState(false);
 const {mentor,session,date,time}=booking;
 const subtotal=session[2];
 const serviceFee=0;
 const total=subtotal+serviceFee;
 return <View style={s.page}>
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
   <View style={s.nav}><TouchableOpacity style={s.icon} onPress={onBack}><Ionicons name="arrow-back" size={21} color={colors.ink}/></TouchableOpacity><Text style={s.navTitle}>Review Booking</Text><View style={s.iconGhost}/></View>
   <View style={s.progress}><View style={s.progressDone}/><View style={s.progressOn}/><View style={s.progressOff}/></View>
   <Text style={s.step}>STEP 2 OF 3</Text><Text style={s.title}>Review your session</Text><Text style={s.subtitle}>Make sure everything looks right before payment.</Text>

   <View style={s.card}>
    <View style={s.cardHeader}><Text style={s.heading}>Mentor</Text><TouchableOpacity onPress={onEdit}><Text style={s.edit}>Edit</Text></TouchableOpacity></View>
    <View style={s.mentorRow}><View style={s.avatar}><Text style={s.initials}>{mentor.initials}</Text></View><View style={{flex:1}}><Text style={s.mentor}>{mentor.name}</Text><Text style={s.mentorTitle}>{mentor.title}</Text><View style={s.rating}><Ionicons name="star" size={13} color="#F3A900"/><Text style={s.ratingText}>{mentor.rating.toFixed(1)} ({mentor.reviews})</Text></View></View><Ionicons name="checkmark-circle" size={20} color={colors.purple}/></View>
   </View>

   <View style={s.card}>
    <View style={s.cardHeader}><Text style={s.heading}>Session details</Text><TouchableOpacity onPress={onEdit}><Text style={s.edit}>Edit</Text></TouchableOpacity></View>
    <View style={s.detail}><View style={s.detailIcon}><Ionicons name="videocam-outline" size={18} color={colors.purple}/></View><View><Text style={s.detailLabel}>Session</Text><Text style={s.detailValue}>{session[0]}</Text><Text style={s.detailSub}>{session[1]} • Video session</Text></View></View>
    <View style={s.detail}><View style={s.detailIcon}><Ionicons name="calendar-outline" size={18} color={colors.purple}/></View><View><Text style={s.detailLabel}>Date</Text><Text style={s.detailValue}>{date.label}</Text></View></View>
    <View style={s.detail}><View style={s.detailIcon}><Ionicons name="time-outline" size={18} color={colors.purple}/></View><View><Text style={s.detailLabel}>Time</Text><Text style={s.detailValue}>{time}</Text><Text style={s.detailSub}>Shown in your local time</Text></View></View>
   </View>

   <View style={s.card}>
    <Text style={s.heading}>Price summary</Text>
    <View style={s.priceRow}><Text style={s.priceLabel}>{session[0]}</Text><Text style={s.priceValue}>${subtotal.toFixed(2)}</Text></View>
    <View style={s.priceRow}><Text style={s.priceLabel}>Booking fee</Text><Text style={s.free}>Included</Text></View>
    <View style={s.divider}/>
    <View style={s.totalRow}><Text style={s.totalLabel}>Total</Text><Text style={s.total}>${total.toFixed(2)}</Text></View>
    <Text style={s.taxNote}>Any applicable taxes will be shown before payment is submitted.</Text>
   </View>

   <View style={s.policyCard}>
    <View style={s.policyHead}><View style={s.policyIcon}><Ionicons name="shield-checkmark-outline" size={19} color={colors.purple}/></View><View style={{flex:1}}><Text style={s.policyTitle}>Booking policy</Text><Text style={s.policyText}>Your session is subject to MentEducation's cancellation, rescheduling, and attendance policies.</Text></View></View>
    <TouchableOpacity style={s.agreeRow} onPress={()=>setAgreed(v=>!v)}>
      <View style={[s.checkbox,agreed&&s.checkboxOn]}>{agreed?<Ionicons name="checkmark" size={15} color="#fff"/>:null}</View>
      <Text style={s.agreeText}>I understand and agree to the booking policies for this session.</Text>
    </TouchableOpacity>
   </View>

   <View style={s.secure}><Ionicons name="lock-closed-outline" size={16} color={colors.muted}/><Text style={s.secureText}>Payment will be securely processed in the next step.</Text></View>
  </ScrollView>
  <View style={s.bottom}><View><Text style={s.bottomLabel}>Total due</Text><Text style={s.bottomTotal}>${total.toFixed(2)}</Text></View><TouchableOpacity disabled={!agreed} style={[s.continue,!agreed&&s.continueDisabled]} onPress={()=>onContinue?.({...booking,total})}><Text style={s.continueText}>Continue to Payment</Text><Ionicons name="arrow-forward" size={17} color="#fff"/></TouchableOpacity></View>
 </View>
}

const s=StyleSheet.create({page:{flex:1,backgroundColor:colors.paper},content:{padding:18,paddingBottom:112},nav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},navTitle:{fontSize:15,fontWeight:'900',color:colors.ink},icon:{width:42,height:42,borderRadius:13,backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},iconGhost:{width:42},progress:{flexDirection:'row',gap:6,marginTop:3},progressDone:{height:4,flex:1,borderRadius:4,backgroundColor:colors.purple},progressOn:{height:4,flex:1,borderRadius:4,backgroundColor:colors.purple},progressOff:{height:4,flex:1,borderRadius:4,backgroundColor:'#E6E3ED'},step:{fontSize:9,fontWeight:'900',letterSpacing:1,color:colors.purple,marginTop:18},title:{fontSize:28,fontWeight:'900',letterSpacing:-.9,color:colors.ink,marginTop:6},subtitle:{fontSize:13,color:colors.muted,marginTop:6,marginBottom:17},card:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:18,padding:16,marginBottom:12},cardHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},heading:{fontSize:16,fontWeight:'900',color:colors.ink},edit:{fontSize:11,fontWeight:'800',color:colors.purple},mentorRow:{flexDirection:'row',alignItems:'center',gap:11,marginTop:14},avatar:{width:52,height:52,borderRadius:16,backgroundColor:'#EEE9FF',alignItems:'center',justifyContent:'center'},initials:{fontSize:14,fontWeight:'900',color:colors.purple},mentor:{fontSize:14,fontWeight:'900',color:colors.ink},mentorTitle:{fontSize:10.5,color:colors.muted,marginTop:2},rating:{flexDirection:'row',alignItems:'center',gap:4,marginTop:5},ratingText:{fontSize:10,fontWeight:'700',color:colors.ink},detail:{flexDirection:'row',gap:11,marginTop:15,paddingTop:14,borderTopWidth:1,borderTopColor:colors.line},detailIcon:{width:36,height:36,borderRadius:11,backgroundColor:'#F4F1FF',alignItems:'center',justifyContent:'center'},detailLabel:{fontSize:9.5,color:colors.muted,fontWeight:'700'},detailValue:{fontSize:12.5,fontWeight:'900',color:colors.ink,marginTop:2},detailSub:{fontSize:10,color:colors.muted,marginTop:2},priceRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:13},priceLabel:{fontSize:11.5,color:colors.muted},priceValue:{fontSize:12.5,fontWeight:'800',color:colors.ink},free:{fontSize:10.5,fontWeight:'800',color:colors.purple},divider:{height:1,backgroundColor:colors.line,marginTop:14},totalRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:14},totalLabel:{fontSize:13.5,fontWeight:'900',color:colors.ink},total:{fontSize:20,fontWeight:'900',color:colors.ink},taxNote:{fontSize:9.5,lineHeight:14,color:colors.muted,marginTop:8},policyCard:{backgroundColor:'#F8F6FF',borderWidth:1,borderColor:'#E8E1FF',borderRadius:18,padding:15,marginBottom:12},policyHead:{flexDirection:'row',gap:10},policyIcon:{width:36,height:36,borderRadius:11,backgroundColor:'#EEE9FF',alignItems:'center',justifyContent:'center'},policyTitle:{fontSize:13,fontWeight:'900',color:colors.ink},policyText:{fontSize:10.5,lineHeight:16,color:colors.muted,marginTop:4},agreeRow:{flexDirection:'row',alignItems:'flex-start',gap:9,marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:'#E6DFFF'},checkbox:{width:22,height:22,borderRadius:7,borderWidth:1.5,borderColor:'#B9B2CD',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},checkboxOn:{backgroundColor:colors.purple,borderColor:colors.purple},agreeText:{fontSize:10.5,lineHeight:16,color:colors.ink,flex:1,fontWeight:'600'},secure:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingVertical:7},secureText:{fontSize:9.5,color:colors.muted},bottom:{position:'absolute',left:0,right:0,bottom:0,minHeight:82,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:colors.line,paddingHorizontal:18,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:14},bottomLabel:{fontSize:9.5,color:colors.muted},bottomTotal:{fontSize:20,fontWeight:'900',color:colors.ink,marginTop:2},continue:{flex:1,maxWidth:220,minHeight:50,borderRadius:14,backgroundColor:colors.purple,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},continueDisabled:{opacity:.4},continueText:{color:'#fff',fontSize:12,fontWeight:'900'}});