export interface Member {
  id: number;
  name: string;
  zone: string;
  mandal: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

export const membersData: Member[] = [
  {
    id: 1,
    name: "Rajesh Patel",
    zone: "Vapi",
    mandal: "Vapi Central",
    dateOfBirth: "1985-03-15",
    phoneNumber: "+91 98765 43210",
    email: "rajesh.patel@email.com"
  },
  {
    id: 2,
    name: "Priya Shah",
    zone: "Gandevi",
    mandal: "Gandevi North",
    dateOfBirth: "1990-07-22",
    phoneNumber: "+91 87654 32109",
    email: "priya.shah@email.com"
  },
  {
    id: 3,
    name: "Amit Kumar",
    zone: "Valsad",
    mandal: "Valsad East",
    dateOfBirth: "1988-11-08",
    phoneNumber: "+91 76543 21098",
    email: "amit.kumar@email.com"
  },
  {
    id: 4,
    name: "Kavita Desai",
    zone: "Dharampur",
    mandal: "Dharampur West",
    dateOfBirth: "1992-12-03",
    phoneNumber: "+91 65432 10987",
    email: "kavita.desai@email.com"
  },
  {
    id: 5,
    name: "Suresh Mehta",
    zone: "Amalsad",
    mandal: "Amalsad South",
    dateOfBirth: "1987-05-18",
    phoneNumber: "+91 54321 09876",
    email: "suresh.mehta@email.com"
  },
  {
    id: 6,
    name: "Nisha Joshi",
    zone: "Vapi",
    mandal: "Vapi Industrial",
    dateOfBirth: "1995-09-12",
    phoneNumber: "+91 43210 98765",
    email: "nisha.joshi@email.com"
  },
  {
    id: 7,
    name: "Vikram Singh",
    zone: "Gandevi",
    mandal: "Gandevi South",
    dateOfBirth: "1983-01-27",
    phoneNumber: "+91 32109 87654",
    email: "vikram.singh@email.com"
  },
  {
    id: 8,
    name: "Meera Agarwal",
    zone: "Valsad",
    mandal: "Valsad Central",
    dateOfBirth: "1991-04-14",
    phoneNumber: "+91 21098 76543",
    email: "meera.agarwal@email.com"
  },
  {
    id: 9,
    name: "Rohit Sharma",
    zone: "Vapi",
    mandal: "Vapi South",
    dateOfBirth: "1994-12-25",
    phoneNumber: "+91 11223 44556",
    email: "rohit.sharma@email.com"
  },
  {
    id: 10,
    name: "Anjali Patil",
    zone: "Gandevi",
    mandal: "Gandevi Central",
    dateOfBirth: "1989-12-31",
    phoneNumber: "+91 22334 55667",
    email: "anjali.patil@email.com"
  }
];

// Helper function to get upcoming birthdays based on current date
export const getUpcomingBirthdays = (days: number = 30): Member[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  return membersData.filter(member => {
    const birthDate = new Date(member.dateOfBirth);
    const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    
    // Calculate days until birthday (this year or next year)
    const daysUntilThisYear = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilNextYear = Math.ceil((nextYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check if birthday is within the specified number of days
    return (daysUntilThisYear >= 0 && daysUntilThisYear <= days) || 
           (daysUntilThisYear < 0 && daysUntilNextYear <= days);
  }).sort((a, b) => {
    // Sort by upcoming birthday date
    const birthDateA = new Date(a.dateOfBirth);
    const birthDateB = new Date(b.dateOfBirth);
    const thisYearBirthdayA = new Date(currentYear, birthDateA.getMonth(), birthDateA.getDate());
    const thisYearBirthdayB = new Date(currentYear, birthDateB.getMonth(), birthDateB.getDate());
    
    // If birthday has passed this year, use next year's date for comparison
    const effectiveDateA = thisYearBirthdayA < today ? 
      new Date(currentYear + 1, birthDateA.getMonth(), birthDateA.getDate()) : thisYearBirthdayA;
    const effectiveDateB = thisYearBirthdayB < today ? 
      new Date(currentYear + 1, birthDateB.getMonth(), birthDateB.getDate()) : thisYearBirthdayB;
    
    return effectiveDateA.getTime() - effectiveDateB.getTime();
  });
};

// Helper function to get birthday info with days remaining
export const getBirthdayInfo = (member: Member) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthDate = new Date(member.dateOfBirth);
  const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
  
  const daysUntilThisYear = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilThisYear >= 0) {
    return {
      birthday: thisYearBirthday,
      daysRemaining: daysUntilThisYear,
      isToday: daysUntilThisYear === 0
    };
  } else {
    const daysUntilNextYear = Math.ceil((nextYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      birthday: nextYearBirthday,
      daysRemaining: daysUntilNextYear,
      isToday: false
    };
  }
};
