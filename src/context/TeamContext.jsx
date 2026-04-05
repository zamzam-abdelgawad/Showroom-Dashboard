import { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('showroom_team');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Alice Johnson", role: "Manager", phone: "+1 555-0198", email: "alice@showroom.com", image: "https://i.pravatar.cc/150?u=a" },
      { id: 2, name: "Bob Smith", role: "Sales Associate", phone: "+1 555-0123", email: "bob@showroom.com", image: "https://i.pravatar.cc/150?u=b" },
      { id: 3, name: "Charlie Davis", role: "Sales Associate", phone: "+1 555-0145", email: "charlie@showroom.com", image: "https://i.pravatar.cc/150?u=c" }
    ];
  });
  
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('showroom_schedules');
    if (saved) return JSON.parse(saved);
    // Generic schedules
    return [
      { id: 101, memberId: 1, date: new Date().toISOString().split('T')[0], startTime: "09:00 AM", endTime: "05:00 PM" },
      { id: 103, memberId: 2, date: new Date().toISOString().split('T')[0], startTime: "10:00 AM", endTime: "06:00 PM" },
      { id: 104, memberId: 3, date: new Date().toISOString().split('T')[0], startTime: "12:00 PM", endTime: "08:00 PM" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('showroom_team', JSON.stringify(teamMembers));
    localStorage.setItem('showroom_schedules', JSON.stringify(schedules));
  }, [teamMembers, schedules]);

  const addTeamMember = async (memberData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMember = {
          id: Date.now(),
          image: `https://i.pravatar.cc/150?u=${Date.now()}`,
          ...memberData
        };
        setTeamMembers(prev => [newMember, ...prev]);
        resolve(newMember);
      }, 500);
    });
  };

  return (
    <TeamContext.Provider value={{ teamMembers, schedules, addTeamMember }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
