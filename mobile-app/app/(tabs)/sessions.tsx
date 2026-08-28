import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../../src/theme';

export default function Sessions(){return <SafeAreaView style={s.safe}><View style={s.content}><Text style={s.title}>My Sessions</Text><Text style={s.sub}>Upcoming and past mentorship sessions.</Text><View style={s.card}><Text style={s.kicker}>UPCOMING</Text><Text style={s.name}>Career Clarity & Next Steps</Text><Text style={s.meta}>Jasmine Williams • Tomorrow • 10:00 AM</Text></View></View></SafeAreaView>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.white},content:{padding:spacing.lg},title:{fontSize:28,fontWeight:'800',color:colors.navy},sub:{fontSize:15,color:colors.muted,marginTop:5},card:{marginTop:24,borderWidth:1,borderColor:colors.line,borderRadius:radii.md,padding:18},kicker:{fontSize:11,fontWeight:'800',color:colors.purple},name:{fontSize:18,fontWeight:'800',color:colors.ink,marginTop:8},meta:{fontSize:13,color:colors.muted,marginTop:7}})
