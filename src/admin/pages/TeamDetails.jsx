import { useParams, useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { ChevronLeft, Calendar, Clock, User, Briefcase, Phone, Mail, MapPin, Activity, ShieldCheck } from "lucide-react";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teamMembers, schedules } = useTeam();
  
  const member = teamMembers.find(m => String(m.id) === id);
  const memberSchedules = schedules.filter(s => String(s.memberId) === id);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <User className="h-16 w-16 text-zinc-200 dark:text-zinc-800" />
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100 uppercase tracking-tightest">Staff Member Not Found</h2>
        <Button onClick={() => navigate('/admin/team')}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <button 
        onClick={() => navigate('/admin/team')} 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 hover:text-brand-primary transition-all group"
      >
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Team
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-2xl overflow-hidden bg-white dark:bg-zinc-950 rounded-3xl">
            <div className="h-32 bg-brand-primary relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary opacity-20"></div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="h-24 w-24 rounded-full border-4 border-white dark:border-zinc-950 shadow-2xl object-cover bg-white dark:bg-zinc-900"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=128`;
                  }}
                />
              </div>
            </div>
            <CardContent className="pt-16 text-center space-y-6 pb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-zinc-950 dark:text-zinc-100 tracking-tighter uppercase leading-none">{member.name}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  <Briefcase className="h-3.5 w-3.5" /> {member.role}
                </div>
              </div>

              <div className="pt-8 space-y-5 text-left px-4">
                <div className="flex items-center gap-4 group">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:border-brand-primary/30">
                    <Phone className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Mobile Phone</span>
                    <span className="text-sm font-black text-zinc-950 dark:text-zinc-100">{member.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:border-brand-primary/30">
                    <Mail className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Corporate Email</span>
                    <span className="text-sm font-black text-zinc-950 dark:text-zinc-100 truncate max-w-[180px]">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:border-brand-primary/30">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Office Location</span>
                    <span className="text-sm font-black text-zinc-950 dark:text-zinc-100">Cairo, Egypt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-md bg-white dark:bg-zinc-950 p-6 rounded-2xl">
            <h3 className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Performance Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest">Monthly Sales target</span>
                <span className="text-xs font-black text-emerald-500">85%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between px-8 py-6 bg-zinc-50/50 dark:bg-zinc-900/30">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3 text-zinc-950 dark:text-zinc-100 uppercase">
                <Calendar className="h-5 w-5 text-brand-primary" /> Weekly Schedule
              </CardTitle>
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Published 
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] border-b border-zinc-100 dark:border-zinc-900">
                    <tr>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-6 py-5">Engagement</th>
                      <th className="px-6 py-5">Conclusion</th>
                      <th className="px-8 py-5 text-right">Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
                    {memberSchedules.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center text-zinc-400 dark:text-zinc-600 italic font-medium uppercase tracking-[0.1em] text-[10px]">
                          No active operational schedules published.
                        </td>
                      </tr>
                    ) : (
                      memberSchedules.map((sched) => (
                        <tr key={sched.id} className="hover:bg-brand-primary/[0.02] dark:hover:bg-brand-primary/[0.02] transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                              <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Active</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-bold text-zinc-950 dark:text-zinc-100">{sched.date}</td>
                          <td className="px-6 py-5"><div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium"><Clock className="h-3.5 w-3.5 text-brand-primary/50" /> {sched.startTime}</div></td>
                          <td className="px-6 py-5"><div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium"><Clock className="h-3.5 w-3.5 text-brand-secondary/50" /> {sched.endTime}</div></td>
                          <td className="px-8 py-5 text-right font-black text-brand-primary">8.0 HRS</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 rounded-3xl p-8 flex items-start gap-6 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
              <Activity className="h-32 w-32 text-zinc-950 dark:text-white" />
            </div>
            <div className="bg-brand-primary/10 dark:bg-brand-primary/20 p-4 rounded-xl relative z-10">
              <Activity className="h-6 w-6 text-brand-primary" />
            </div>
            <div className="space-y-2 relative z-10">
              <h4 className="font-black text-zinc-950 dark:text-white uppercase tracking-[0.2em] text-[11px]">Shift Management Protocol</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Operational adjustments must be authorized through our institutional portal 24 hours prior to shift commencement. Unsanctioned deviations are strictly monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
