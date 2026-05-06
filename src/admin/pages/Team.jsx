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
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Organization Team</h1>
          <p className="text-zinc-500 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Internal staff management and credentialing.</p>
        </div>
        <Button className="shadow-md rounded-xl" onClick={() => setIsModalOpen(true)}><UserPlus className="h-4 w-4 mr-2" /> Recruit Personnel</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full border border-zinc-100 dark:border-zinc-900 shadow-sm bg-white dark:bg-zinc-950 p-4 rounded-xl">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input placeholder="Search personnel by identity or role..." className="pl-10 h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-zinc-100 placeholder:text-zinc-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </Card>
        {filteredTeam.map((member) => (
          <Card key={member.id} className="border border-zinc-100 dark:border-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white dark:bg-zinc-950 overflow-hidden rounded-2xl">
            <div className="h-1.5 bg-brand-primary"></div>
            <CardContent className="pt-8 text-center px-6">
              <div className="relative inline-block mb-4">
                <div className="h-24 w-24 rounded-full p-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="h-full w-full rounded-full object-cover shadow-sm grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" 
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=128`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-950 p-1.5 rounded-full shadow-md text-brand-secondary border border-zinc-100 dark:border-zinc-900"><Star className="h-3.5 w-3.5 fill-current" /></div>
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-zinc-100">{member.name}</h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-[0.1em] mt-2"><Briefcase className="h-3 w-3" /> {member.role}</div>
              <div className="mt-8 space-y-4 text-left pt-6 border-t border-zinc-50 dark:border-zinc-900">
                <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-500"><Mail className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700" /><span className="truncate">{member.email}</span></div>
                <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-500"><Phone className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700" /><span>{member.phone}</span></div>
              </div>
              <div className="mt-8 pb-4">
                <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-[0.2em] py-5 rounded-xl border-zinc-100 dark:border-zinc-900 text-zinc-400 dark:text-zinc-600 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/[0.03] group transition-all" onClick={() => navigate(`/admin/team/${member.id || member.firestoreId}`)}>
                  View Profile <ChevronRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
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
