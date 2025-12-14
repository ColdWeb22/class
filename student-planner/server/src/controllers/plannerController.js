const { User, Semester, Course } = require('../models');

const calculateRequiredGPA = async (req, res, next) => {
    try {
        const { currentCGPA, creditsCompleted, desiredCGPA, semesterCredits, saveToProfile } = req.body;

    // Formula: (Desired * TotalCredits - Current * Completed) / SemesterCredits
    // TotalCredits = Completed + Semester

        const totalCredits = creditsCompleted + semesterCredits;
        const requiredPoints = desiredCGPA * totalCredits;
        const currentPoints = currentCGPA * creditsCompleted;

        const requiredSemesterPoints = requiredPoints - currentPoints;
        const requiredSemesterGPA = requiredSemesterPoints / semesterCredits;

        // Save to user profile if authenticated and requested
        if (req.user && saveToProfile) {
            await User.update(
                { 
                    current_cgpa: currentCGPA,
                    credits_completed: creditsCompleted,
                    target_cgpa: desiredCGPA
                },
                { where: { id: req.user.id } }
            );
        }

        res.json({
            success: true,
            data: {
                requiredSemesterGPA: parseFloat(requiredSemesterGPA.toFixed(2)),
                isAchievable: requiredSemesterGPA <= 5.0 && requiredSemesterGPA >= 0
            }
        });
    } catch (error) {
        next(error);
    }
};

const calculateStudyHours = async (req, res, next) => {
    try {
        const { courses, targetCGPA } = req.body;
        // courses: [{ name, units, targetGrade }]
        // targetCGPA is used for adjustment factor

    let totalHours = 0;
    const courseBreakdown = courses.map(course => {
        let baseHours = 0;
        // Map grade to hours/unit
        switch (course.targetGrade.toUpperCase()) {
            case 'A': baseHours = 3; break;
            case 'B': baseHours = 2; break;
            case 'C': baseHours = 1; break;
            default: baseHours = 1; // Minimum assumption
        }

        let hours = baseHours * course.units;
        totalHours += hours;

        return { ...course, hours };
    });

    // Adjust based on Target CGPA (from requirements)
    // GPA >= 4.75 -> +30%
    // GPA >= 4.90 -> +40%
    // GPA 4.0 - 4.74 -> +15%
    // GPA <= 3.5 -> 0%
    // Gap 3.5 - 3.99? Assuming 0 or interpolation? Requirements say <= 3.5 no adj. 
    // Suggests > 3.5 has some adjustment? 
    // Let's stick to explicit rules:
    // "GPA 4.0-4.74 -> +15%"
    // So 3.51 - 3.99 is undefined. I'll assume 0% or linear? I'll assume 0% for < 4.0 for now unless clarified.

    let multiplier = 1.0;
    if (targetCGPA >= 4.9) multiplier = 1.4;
    else if (targetCGPA >= 4.75) multiplier = 1.3;
    else if (targetCGPA >= 4.0) multiplier = 1.15;

        const adjustedTotalHours = totalHours * multiplier;

        res.json({
            success: true,
            data: {
                baseHours: totalHours,
                adjustedTotalHours: parseFloat(adjustedTotalHours.toFixed(2)),
                courseBreakdown,
                multiplier
            }
        });
    } catch (error) {
        next(error);
    }
};

const analyzeGradeCombinations = async (req, res, next) => {
    try {
        const { courses, targetSemesterGPA } = req.body;
        // courses: [{ name, units }] (no grade yet)

    // Greedy Approach:
    // 1. Assign lowest passing grade (C = 2.0? or D? Req says "lowest passing grade (e.g. C)")
    // Let's assume Scale is 5.0? Or 4.0? Req says "supports different scales".
    // I need to know the scale. I'll accept scale config or assume 5.0 for the example numbers (4.75 etc).
    // 5.0 Scale: A=5, B=4, C=3, D=2, E=1, F=0? Or A=5, B=4, C=3, D=2, F=0.
    // Req says "A->3hr, B->2hr, C->1hr" implies A, B, C are main grades.
    // Let's assume standard 5.0 scale: A=5, B=4, C=3, D=2, F=0.

    // Greedy Step 1: All C (3.0)
    // Calculate GPA.
    // While GPA < Target:
    //   Find course with Highest Units (Impact) that is not maxed (A).
    //   Upgrade it (C->B or B->A).
    //   Recalculate.

    const gradePoints = { 'A': 5, 'B': 4, 'C': 3 }; // Simplified
    const pointToGrade = { 5: 'A', 4: 'B', 3: 'C' };

    // Initialize with C (3 points)
    let currentConfig = courses.map(c => ({ ...c, grade: 'C', points: 3 }));

    const calculateGPA = (cfg) => {
        const totalUnits = cfg.reduce((sum, c) => sum + c.units, 0);
        const totalPoints = cfg.reduce((sum, c) => sum + (c.points * c.units), 0);
        return totalPoints / totalUnits;
    };

    let currentGPA = calculateGPA(currentConfig);
    let iterations = 0;

    while (currentGPA < targetSemesterGPA && iterations < 100) {
        // Find best candidate to upgrade
        // Highest units -> biggest jump in total points.
        // Sort by units desc, then current grade (C before B).

        const candidate = currentConfig
            .filter(c => c.points < 5) // Can be upgraded
            .sort((a, b) => b.units - a.units)[0]; // Highest units

        if (!candidate) break; // Maxed out

        // Upgrade
        candidate.points += 1;
        candidate.grade = pointToGrade[candidate.points];

            currentGPA = calculateGPA(currentConfig);
            iterations++;
        }

        res.json({
            success: true,
            data: {
                achievedGPA: parseFloat(currentGPA.toFixed(2)),
                gradeCombination: currentConfig,
                isAchievable: currentGPA >= targetSemesterGPA
            }
        });
    } catch (error) {
        next(error);
    }
};

const saveSemesterPlan = async (req, res) => {
    try {
        const { userId, semesterName, targetGPA, courses } = req.body;

        // For MVP: Find or create a default user if no userId provided
        let user;
        if (userId) {
            user = await User.findByPk(userId);
        }
        
        if (!user) {
            [user] = await User.findOrCreate({
                where: { name: 'Student' },
                defaults: { 
                    current_cgpa: 0, 
                    credits_completed: 0,
                    unique_id: 'default-student'
                }
            });
        }

        const semester = await Semester.create({
            name: semesterName || `Semester ${new Date().getFullYear()}`,
            target_gpa: targetGPA,
            UserId: user.id
        });

        if (courses && courses.length > 0) {
            const courseData = courses.map(c => ({
                name: c.name || 'Unnamed Course',
                units: c.units,
                target_grade: c.targetGrade || c.grade, // Handle both formats
                study_hours: c.hours || 0,
                SemesterId: semester.id
            }));
            await Course.bulkCreate(courseData);
        }

        res.status(201).json({ 
            message: 'Plan saved successfully', 
            semesterId: semester.id,
            user: { id: user.id, name: user.name }
        });
    } catch (error) {
        console.error('Error saving plan:', error);
        res.status(500).json({ message: 'Error saving plan', error: error.message });
    }
};

module.exports = {
    calculateRequiredGPA,
    calculateStudyHours,
    analyzeGradeCombinations,
    saveSemesterPlan
};
