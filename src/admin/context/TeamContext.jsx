import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../shared/lib/firebase";

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTeamMembers([]);
        setSchedules([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const qTeam = query(collection(db, "team"), orderBy("name", "asc"));
      const unsubTeam = onSnapshot(
        qTeam,
        (snapshot) => {
          const teamData = snapshot.docs.map(doc => ({
            ...doc.data(),
            firestoreId: doc.id
          }));
          setTeamMembers(teamData);
        },
        (error) => {
          console.error("Error fetching team members:", error);
        }
      );

      const qSchedules = query(collection(db, "schedules"), orderBy("date", "desc"));
      const unsubSchedules = onSnapshot(
        qSchedules,
        (snapshot) => {
          const scheduleData = snapshot.docs.map(doc => ({
            ...doc.data(),
            firestoreId: doc.id
          }));
          setSchedules(scheduleData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching schedules:", error);
          setLoading(false);
        }
      );

      return () => {
        unsubTeam();
        unsubSchedules();
      };
    });

    return () => unsubAuth();
  }, []);

  const addTeamMember = async (memberData) => {
    try {
      const newMember = {
        ...memberData,
        image: memberData.image || `https://i.pravatar.cc/150?u=${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "team"), newMember);
      return { ...newMember, firestoreId: docRef.id };
    } catch (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
  };

  return (
    <TeamContext.Provider value={{ teamMembers, schedules, addTeamMember, loading }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
