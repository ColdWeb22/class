export const gradeToPoints = {
  'A': 5,
  'B': 4,
  'C': 3,
  'D': 2,
  'F': 0
};

export const pointsToGrade = {
  5: 'A',
  4: 'B',
  3: 'C',
  2: 'D',
  0: 'F'
};

export const calculateGPA = (courses) => {
  const totalUnits = courses.reduce((sum, c) => sum + (c.units || 0), 0);
  if (totalUnits === 0) return 0;
  
  const totalPoints = courses.reduce((sum, c) => {
    const grade = c.actual_grade || c.target_grade || 'C';
    const points = gradeToPoints[grade.toUpperCase()] || 0;
    return sum + (points * (c.units || 0));
  }, 0);
  
  return (totalPoints / totalUnits).toFixed(2);
};

export const calculateRequiredGPA = (currentCGPA, creditsCompleted, desiredCGPA, semesterCredits) => {
  const totalCredits = creditsCompleted + semesterCredits;
  const requiredPoints = desiredCGPA * totalCredits;
  const currentPoints = currentCGPA * creditsCompleted;
  const requiredSemesterPoints = requiredPoints - currentPoints;
  const requiredSemesterGPA = requiredSemesterPoints / semesterCredits;
  
  return {
    requiredGPA: parseFloat(requiredSemesterGPA.toFixed(2)),
    isAchievable: requiredSemesterGPA <= 5.0 && requiredSemesterGPA >= 0
  };
};

export const calculateStudyHours = (course, targetGPA = 4.0) => {
  const baseHoursMap = {
    'A': 3,
    'B': 2,
    'C': 1,
    'D': 1,
    'F': 0
  };
  
  const grade = (course.targetGrade || 'B').toUpperCase();
  const baseHours = baseHoursMap[grade] || 1;
  let hours = baseHours * (course.units || 1);
  
  // Apply multiplier based on target GPA
  let multiplier = 1.0;
  if (targetGPA >= 4.9) multiplier = 1.4;
  else if (targetGPA >= 4.75) multiplier = 1.3;
  else if (targetGPA >= 4.0) multiplier = 1.15;
  
  return Math.round(hours * multiplier * 10) / 10;
};

export const getGPAColor = (gpa) => {
  if (gpa >= 4.5) return 'text-green-500';
  if (gpa >= 4.0) return 'text-blue-500';
  if (gpa >= 3.5) return 'text-yellow-500';
  if (gpa >= 3.0) return 'text-orange-500';
  return 'text-red-500';
};

export const getGPAStatus = (gpa) => {
  if (gpa >= 4.5) return 'Excellent';
  if (gpa >= 4.0) return 'Very Good';
  if (gpa >= 3.5) return 'Good';
  if (gpa >= 3.0) return 'Fair';
  return 'Needs Improvement';
};
