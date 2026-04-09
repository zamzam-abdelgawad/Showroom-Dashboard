import { useTeam } from "../context/TeamContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { Phone, Mail, ChevronRight, Briefcase, UserPlus, Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { TeamFormModal } from "../components/team/TeamFormModal";

export default function Team() {
  const { teamMembers, addTeamMember } = useTeam();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTeam = useMemo(() => {
    return teamMembers.filter(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.role.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teamMembers, searchTerm]);

  const handleAddStaff = async (data) => {
    setIsSubmitting(true);
    try { await addTeamMember(data); addToast(`${data.name} added to the team!`, "success"); setIsModalOpen(false); }
    catch (err) { addToast("Failed to add staff member.", "error"); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1"><h1 className="text-2xl font-bold text-gray-900">Dealership Team</h1><p className="text-gray-500 text-sm">Manage internal staff roles and weekly schedules.</p></div>
        <Button className="shadow-md" onClick={() => setIsModalOpen(true)}><UserPlus className="h-4 w-4 mr-2" /> Add Staff Member</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full border-none shadow-sm bg-white p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input placeholder="Search team members by name or role..." className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </Card>
        {filteredTeam.map((member) => (
          <Card key={member.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white overflow-hidden">
            <div className="h-2 bg-indigo-600"></div>
            <CardContent className="pt-6 text-center">
              <div className="relative inline-block mb-4">
                <img src={member.image} alt={member.name} className="h-20 w-20 rounded-full border-2 border-indigo-50 shadow-sm object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm text-amber-500"><Star className="h-4 w-4 fill-current" /></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mt-1"><Briefcase className="h-3 w-3" /> {member.role}</div>
              <div className="mt-6 space-y-3 text-left pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600"><Mail className="h-4 w-4 text-gray-400" /><span className="truncate">{member.email}</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="h-4 w-4 text-gray-400" /><span>{member.phone}</span></div>
              </div>
              <div className="mt-8 pt-4">
                <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest py-5 border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 group" onClick={() => navigate(`/admin/team/${member.id}`)}>
                  View Schedule <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <TeamFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddStaff} isSubmitting={isSubmitting} />
    </div>
  );
}
