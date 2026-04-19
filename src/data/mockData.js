export const mockPatients = [
  { id: 1, name: 'Max', type: 'Dog', breed: 'Golden Retriever', owner: 'John Doe', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150', status: 'Healthy' },
  { id: 2, name: 'Luna', type: 'Cat', breed: 'Siamese', owner: 'Sarah Smith', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150&h=150', status: 'Treatment' },
  { id: 3, name: 'Charlie', type: 'Dog', breed: 'Beagle', owner: 'Mike Tyson', image: 'https://images.unsplash.com/photo-1537151608804-ea6f04642fb2?auto=format&fit=crop&q=80&w=150&h=150', status: 'Emergency' },
  { id: 4, name: 'Bella', type: 'Cat', breed: 'Persian', owner: 'Emma Watson', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=150&h=150', status: 'Healthy' },
];

export const mockSchedule = [
  { id: 1, time: '09:00 AM', patient: 'Max', reason: 'General Checkup', status: 'completed' },
  { id: 2, time: '10:30 AM', patient: 'Luna', reason: 'Vaccination', status: 'upcoming' },
  { id: 3, time: '11:45 AM', patient: 'Charlie', reason: 'Emergency Surgery', status: 'urgent' },
  { id: 4, time: '02:00 PM', patient: 'Bella', reason: 'Dental Cleaning', status: 'upcoming' },
];

export const mockStats = {
  totalPatients: 1248,
  todayAppointments: 24,
  vaccinationRate: 92,
  emergencies: 3,
};

export const userPets = [
  { id: 101, name: 'Buddy', type: 'Dog', age: '3 yrs', status: 'Healthy', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 102, name: 'Milo', type: 'Cat', age: '1 yr', status: 'Needs Vaccine', image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=150&h=150' },
];

export const userRequests = [
  { id: 201, title: 'Annual Checkup for Buddy', date: 'Oct 24, 2023', status: 'Accepted' },
  { id: 202, title: 'Flea Treatment for Milo', date: 'Oct 28, 2023', status: 'Pending' },
  { id: 203, title: 'Dental Consultation', date: 'Nov 02, 2023', status: 'Rejected' },
];
