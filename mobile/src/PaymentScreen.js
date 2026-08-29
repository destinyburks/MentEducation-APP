import React,{useState} from 'react';
import {ActivityIndicator,ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useStripe} from '@stripe/stripe-react-native';
import {colors} from './theme';
import {supabase,supabaseConfigured} from './supabase';

export default function PaymentScreen({booking,onBack,onSuccess}){
 const {initPaymentSheet,presentPaymentSheet}=useStripe();
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const total=Number(booking?.total??booking?.session?.[2]??0);
 const backendBookingId=booking?.booking_id||booking?.bookingId||booking?.id;

 const pay=async()=>{
  setError('');
  if(!supabaseConfigured||!supabase){setError('Supabase mobile environment variables are not configured yet.');return;}
  if(!backendBookingId){setError('This booking must be saved to the shared MentEducation backend before payment can be submitted.');return;}
  setLoading(true);
  try{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token) throw new Error('Please sign in before paying for a session.');
   const {data,error:functionError}=await supabase.functions.invoke('create-mobile-payment-intent',{body:{booking_id:backendBookingId}});
   if(functionError) throw functionError;
   if(!data?.payment_intent_client_secret) throw new Error(data?.error||'Unable to initialize payment.');

   const {error:initError}=await initPaymentSheet({
    merchantDisplayName:'MentEducation',
    paymentIntentClientSecret:data.payment_intent_client_secret,
    allowsDelayedPaymentMethods:false,
    returnURL:'menteducation://stripe-redirect',
    appearance:{colors:{primary:colors.purple,background:colors.white,componentBackground:colors.white,primaryText:colors.ink,secondaryText:colors.muted}},
   });
   if(initError) throw new Error(initError.message);
   const {error:paymentError}=await presentPaymentSheet();
   if(paymentError){
    if(paymentError.code!=='Canceled') throw new Error(paymentError.message);
    return;
   }
   onSuccess?.({...booking,payment_intent_id:data.payment_intent_id,amount_cents:data.amount_cents});
  }catch(e){setError(e?.message||'Payment could not be completed.');}
  finally{setLoading(false);}
 };

 return <View style={s.page}>
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
   <View style={s.nav}><TouchableOpacity style={s.icon} onPress={onBack}><Ionicons name="arrow-back" size={21} color={colors.ink}/></TouchableOpacity><Text style={s.navTitle}>Payment</Text><View style={s.iconGhost}/></View>
   <View style={s.progress}><View style={s.progressOn}/><View style={s.progressOn}/><View style={s.progressOn}/></View>
   <Text style={s.step}>STEP 3 OF 3</Text><Text style={s.title}>Complete payment</Text><Text style={s.subtitle}>Your payment details are handled securely by Stripe.</Text>

   <View style={s.testBanner}><Ionicons name="flask-outline" size={18} color={colors.purple}/><View style={{flex:1}}><Text style={s.testTitle}>Stripe sandbox</Text><Text style={s.testText}>This build is connected for test payments only. No real money should be charged while sandbox credentials are configured.</Text></View></View>

   <View style={s.card}><Text style={s.heading}>Session</Text><View style={s.mentorRow}><View style={s.avatar}><Text style={s.initials}>{booking.mentor.initials}</Text></View><View style={{flex:1}}><Text style={s.mentor}>{booking.mentor.name}</Text><Text style={s.detail}>{booking.session[0]}</Text><Text style={s.detail}>{booking.date?.label} • {booking.time}</Text></View><Text style={s.price}>${total.toFixed(2)}</Text></View></View>

   <View style={s.card}><Text style={s.heading}>Payment method</Text><View style={s.paymentMethod}><View style={s.cardIcon}><Ionicons name="card-outline" size={22} color={colors.purple}/></View><View style={{flex:1}}><Text style={s.methodTitle}>Credit, debit, or supported wallet</Text><Text style={s.methodText}>Stripe PaymentSheet will securely collect your payment details.</Text></View><Ionicons name="shield-checkmark" size={20} color={colors.green}/></View></View>

   <View style={s.card}><Text style={s.heading}>Order total</Text><View style={s.row}><Text style={s.rowLabel}>Mentorship session</Text><Text style={s.rowValue}>${total.toFixed(2)}</Text></View><View style={s.row}><Text style={s.rowLabel}>Booking fee</Text><Text style={s.included}>Included</Text></View><View style={s.divider}/><View style={s.totalRow}><Text style={s.totalLabel}>Total due</Text><Text style={s.total}>${total.toFixed(2)}</Text></View></View>

   {error?<View style={s.errorBox}><Ionicons name="alert-circle-outline" size={18} color={colors.red}/><Text style={s.errorText}>{error}</Text></View>:null}
   <View style={s.secure}><Ionicons name="lock-closed" size={15} color={colors.muted}/><Text style={s.secureText}>MentEducation never stores raw card details.</Text></View>
  </ScrollView>
  <View style={s.bottom}><View><Text style={s.bottomLabel}>Total</Text><Text style={s.bottomTotal}>${total.toFixed(2)}</Text></View><TouchableOpacity disabled={loading} style={[s.pay,loading&&s.payDisabled]} onPress={pay}>{loading?<ActivityIndicator color="#fff"/>:<><Text style={s.payText}>Pay securely</Text><Ionicons name="lock-closed" size={16} color="#fff"/></>}</TouchableOpacity></View>
 </View>
}

const s=StyleSheet.create({page:{flex:1,backgroundColor:colors.paper},content:{padding:18,paddingBottom:112},nav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},navTitle:{fontSize:15,fontWeight:'900',color:colors.ink},icon:{width:42,height:42,borderRadius:13,backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},iconGhost:{width:42},progress:{flexDirection:'row',gap:6,marginTop:3},progressOn:{height:4,flex:1,borderRadius:4,backgroundColor:colors.purple},step:{fontSize:9,fontWeight:'900',letterSpacing:1,color:colors.purple,marginTop:18},title:{fontSize:28,fontWeight:'900',letterSpacing:-.9,color:colors.ink,marginTop:6},subtitle:{fontSize:13,color:colors.muted,marginTop:6,marginBottom:17},testBanner:{flexDirection:'row',gap:10,backgroundColor:'#F4F1FF',borderWidth:1,borderColor:'#E4DBFF',borderRadius:16,padding:14,marginBottom:12},testTitle:{fontSize:12.5,fontWeight:'900',color:colors.ink},testText:{fontSize:10.5,lineHeight:16,color:colors.muted,marginTop:3},card:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:18,padding:16,marginBottom:12},heading:{fontSize:16,fontWeight:'900',color:colors.ink},mentorRow:{flexDirection:'row',alignItems:'center',gap:11,marginTop:14},avatar:{width:48,height:48,borderRadius:15,backgroundColor:'#EEE9FF',alignItems:'center',justifyContent:'center'},initials:{fontSize:13,fontWeight:'900',color:colors.purple},mentor:{fontSize:13,fontWeight:'900',color:colors.ink},detail:{fontSize:10.5,color:colors.muted,marginTop:3},price:{fontSize:17,fontWeight:'900',color:colors.ink},paymentMethod:{flexDirection:'row',alignItems:'center',gap:11,marginTop:14},cardIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#F4F1FF',alignItems:'center',justifyContent:'center'},methodTitle:{fontSize:12.5,fontWeight:'900',color:colors.ink},methodText:{fontSize:10.5,lineHeight:15,color:colors.muted,marginTop:3},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:13},rowLabel:{fontSize:11.5,color:colors.muted},rowValue:{fontSize:12.5,fontWeight:'800',color:colors.ink},included:{fontSize:10.5,fontWeight:'800',color:colors.purple},divider:{height:1,backgroundColor:colors.line,marginTop:14},totalRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:14},totalLabel:{fontSize:13.5,fontWeight:'900',color:colors.ink},total:{fontSize:20,fontWeight:'900',color:colors.ink},errorBox:{flexDirection:'row',alignItems:'flex-start',gap:8,backgroundColor:'#FFF3F5',borderRadius:14,padding:13,marginBottom:12},errorText:{fontSize:10.5,lineHeight:16,color:colors.red,flex:1},secure:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingVertical:6},secureText:{fontSize:9.5,color:colors.muted},bottom:{position:'absolute',left:0,right:0,bottom:0,minHeight:82,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:colors.line,paddingHorizontal:18,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:14},bottomLabel:{fontSize:9.5,color:colors.muted},bottomTotal:{fontSize:20,fontWeight:'900',color:colors.ink,marginTop:2},pay:{flex:1,maxWidth:220,minHeight:50,borderRadius:14,backgroundColor:colors.purple,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},payDisabled:{opacity:.55},payText:{color:'#fff',fontSize:12.5,fontWeight:'900'}});