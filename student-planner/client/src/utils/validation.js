export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateGPA = (gpa, min = 0, max = 5) => {
  const num = parseFloat(gpa);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateCredits = (credits) => {
  const num = parseInt(credits);
  return !isNaN(num) && num >= 0;
};

export const validateCourse = (course) => {
  const errors = {};
  
  if (!course.name || course.name.trim() === '') {
    errors.name = 'Course name is required';
  }
  
  const units = parseInt(course.units);
  if (isNaN(units) || units < 1 || units > 6) {
    errors.units = 'Units must be between 1 and 6';
  }
  
  const validGrades = ['A', 'B', 'C', 'D', 'F'];
  if (course.targetGrade && !validGrades.includes(course.targetGrade.toUpperCase())) {
    errors.targetGrade = 'Invalid grade';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSemester = (semester) => {
  const errors = {};
  
  if (!semester.name || semester.name.trim() === '') {
    errors.name = 'Semester name is required';
  }
  
  if (semester.target_gpa !== undefined && !validateGPA(semester.target_gpa)) {
    errors.target_gpa = 'Target GPA must be between 0 and 5';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
