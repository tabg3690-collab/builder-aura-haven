export interface Member {
  id: number;
  name: string;
  zone: string;
  mandal: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

// Helper function to get birthday info with days remaining
export const getBirthdayInfo = (member: Member) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthDate = new Date(member.dateOfBirth);
  const thisYearBirthday = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  const nextYearBirthday = new Date(
    currentYear + 1,
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  const daysUntilThisYear = Math.ceil(
    (thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilThisYear >= 0) {
    return {
      birthday: thisYearBirthday,
      daysRemaining: daysUntilThisYear,
      isToday: daysUntilThisYear === 0,
    };
  } else {
    const daysUntilNextYear = Math.ceil(
      (nextYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return {
      birthday: nextYearBirthday,
      daysRemaining: daysUntilNextYear,
      isToday: false,
    };
  }
};
