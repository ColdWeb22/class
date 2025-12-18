// Email validation with proper regex
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

// Password validation - min 6 characters
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

// GPA validation with configurable range
export const validateGPA = (gpa, min = 0, max = 5) => {
  const num = parseFloat(gpa);
  return !isNaN(num) && num >= min && num <= max;
};

// Credits validation
export const validateCredits = (credits) => {
  const num = parseInt(credits);
  return !isNaN(num) && num >= 0 && num <= 200;
};

// Study hours validation (max 168 hours per week)
export const validateStudyHours = (hours) => {
  const num = parseInt(hours);
  return !isNaN(num) && num >= 0 && num <= 168;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

// Course validation with comprehensive checks
export const validateCourse = (course) => {
  const errors = {};
  
  if (!course.name || course.name.trim() === '') {
    errors.name = 'Course name is required';
  } else if (course.name.trim().length < 2) {
    errors.name = 'Course name must be at least 2 characters';
  } else if (course.name.trim().length > 100) {
    errors.name = 'Course name must not exceed 100 characters';
  }
  
  const units = parseInt(course.units);
  if (isNaN(units) || units < 1 || units > 10) {
    errors.units = 'Units must be between 1 and 10';
  }
  
  const validGrades = ['A', 'B', 'C', 'D', 'F'];
  if (course.targetGrade && !validGrades.includes(course.targetGrade.toUpperCase())) {
    errors.targetGrade = 'Invalid grade (must be A, B, C, D, or F)';
  }
  
  if (course.actualGrade && !validGrades.includes(course.actualGrade.toUpperCase())) {
    errors.actualGrade = 'Invalid grade (must be A, B, C, D, or F)';
  }

  if (course.study_hours !== undefined && !validateStudyHours(course.study_hours)) {
    errors.study_hours = 'Study hours must be between 0 and 168 per week';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Semester validation with comprehensive checks
export const validateSemester = (semester) => {
  const errors = {};
  
  if (!semester.name || semester.name.trim() === '') {
    errors.name = 'Semester name is required';
  } else if (semester.name.trim().length < 2) {
    errors.name = 'Semester name must be at least 2 characters';
  } else if (semester.name.trim().length > 100) {
    errors.name = 'Semester name must not exceed 100 characters';
  }
  
  if (semester.target_gpa !== undefined && semester.target_gpa !== null && semester.target_gpa !== '' && !validateGPA(semester.target_gpa)) {
    errors.target_gpa = 'Target GPA must be between 0 and 5';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
