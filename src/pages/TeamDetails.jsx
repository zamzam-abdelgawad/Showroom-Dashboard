import { useParams, useNavigate } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ChevronLeft, Calendar, Clock, User, Briefcase, Phone, Mail, MapPin, Activity, ShieldCheck } from "lucide-react";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teamMembers, schedules } = useTeam();
  
  const member = teamMembers.find(m => m.id === parseInt(id));
  const memberSchedules = schedules.filter(s => s.memberId === parseInt(id));

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <User className="h-16 w-16 text-gray-200" />
        <h2 className="text-2xl font-bold text-gray-900">Staff Member Not Found</h2>
        <Button onClick={() => navigate('/team')}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <button 
        onClick={() => navigate('/team')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Team Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-lg overflow-hidden bg-white">
            <div className="h-32 bg-indigo-600 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
              </div>
            </div>
            <CardContent className="pt-16 text-center space-y-4 pb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-gray-900">{member.name}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="h-3 w-3" /> {member.role}
                </div>
              </div>

              <div className="pt-6 space-y-4 text-left px-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="bg-gray-100 p-2 rounded-lg"><Phone className="h-4 w-4 text-gray-400" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Mobile Phone</span>
                    <span className="font-semibold">{member.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="bg-gray-100 p-2 rounded-lg"><Mail className="h-4 w-4 text-gray-400" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Corporate Email</span>
                    <span className="font-semibold truncate">{member.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="bg-gray-100 p-2 rounded-lg"><MapPin className="h-4 w-4 text-gray-400" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Office Location</span>
                    <span className="font-semibold">Main Showroom, Block B</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" /> Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Monthly Sales target</span>
                <span className="text-xs font-bold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[85%]"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Schedule & Weekly View */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md bg-white h-fit">
            <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" /> Weekly Work Schedule
              </CardTitle>
              <div className="bg-green-50 px-3 py-1 rounded-full text-green-700 text-[10px] font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Published Tasking
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Start Time</th>
                      <th className="px-6 py-4">End Time</th>
                      <th className="px-6 py-4">Total Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {memberSchedules.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No schedules published for this period.</td>
                      </tr>
                    ) : (
                      memberSchedules.map((sched) => (
                        <tr key={sched.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2 ring-4 ring-green-100"></span>
                            <span className="text-xs font-semibold text-gray-700">Scheduled</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">{sched.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Clock className="h-3.5 w-3.5 text-indigo-400" /> {sched.startTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Clock className="h-3.5 w-3.5 text-red-300" /> {sched.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-indigo-600">8.0 hrs</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-start gap-4 shadow-sm">
            <div className="bg-indigo-100 p-2.5 rounded-full"><Activity className="h-6 w-6 text-indigo-600" /></div>
            <div className="space-y-1">
              <h4 className="font-bold text-indigo-900">Shift Management Note</h4>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Changes to the published work schedule must be submitted via the HR Portal 24 hours in advance. Overtime hours require manager approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
