import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Clock, FileText, FileSpreadsheet, File } from 'lucide-react';
import { apiClient } from '../config/api';
import { exportToPDF, exportToCSV, exportToText } from '../utils/export';

const StudyHoursPlanner = () => {
    const [courses, setCourses] = useState([
        { id: 1, name: '', units: '', targetGrade: 'A' }
    ]);
    const [targetCGPA, setTargetCGPA] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), name: '', units: '', targetGrade: 'A' }]);
    };

    const removeCourse = (id) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const calculate = async () => {
        setLoading(true);
        try {
            const payload = {
                courses: courses.map(c => ({
                    name: c.name || 'Course',
                    units: parseFloat(c.units) || 0,
                    targetGrade: c.targetGrade
                })),
                targetCGPA: parseFloat(targetCGPA) || 0
            };

            const response = await apiClient.post('/api/planner/plan-study', payload);
            // Backend returns { success, data: { adjustedTotalHours, courseBreakdown, multiplier } }
            const resultData = response.data || response;
            console.log('Study plan result:', resultData);
            setResult(resultData);
        } catch (error) {
            console.error('Study hours error:', error);
            alert('Error calculating study hours. Please check the console for details.');
        } finally {
            setLoading(false);
        }
    };

    const downloadResult = (format = 'txt') => {
        if (!result) return;

        if (format === 'txt') {
            let report = `
Student Planner - Study Hours Plan
----------------------------------
Goal CGPA: ${targetCGPA}
Total Weekly Study Hours (Adjusted): ${result.adjustedTotalHours}

Course Breakdown:
`;
            if (result.courseBreakdown && Array.isArray(result.courseBreakdown)) {
                result.courseBreakdown.forEach(c => {
                    report += `- ${c.name || 'Course'}: ${c.hours} hrs/wk (${c.units} Units, Target: ${c.targetGrade})\n`;
                });
            }
            if (result.multiplier > 1) {
                report += `\nNote: Includes ${((result.multiplier - 1) * 100).toFixed(0)}% adjustment for high GPA goal.`;
            }
            exportToText(report, 'study_hours_plan.txt');
        } else if (format === 'pdf') {
            const pdfData = {
                title: 'Study Hours Plan',
                summary: {
                    'Goal CGPA': targetCGPA,
                    'Total Weekly Study Hours': result.adjustedTotalHours + ' hrs',
                    'Adjustment Factor': result.multiplier > 1 ? `${((result.multiplier - 1) * 100).toFixed(0)}% for high GPA` : 'None'
                },
                table: {
                    headers: ['Course', 'Hours/Week', 'Units', 'Target Grade'],
                    rows: result.courseBreakdown ? result.courseBreakdown.map(c => [
                        c.name || 'Course',
                        c.hours,
                        c.units,
                        c.targetGrade
                    ]) : []
                }
            };
            exportToPDF(pdfData, 'study_hours_plan.pdf');
        } else if (format === 'csv') {
            const csvData = result.courseBreakdown ? result.courseBreakdown.map(c => ({
                Course: c.name || 'Course',
                'Hours per Week': c.hours,
                Units: c.units,
                'Target Grade': c.targetGrade
            })) : [];
            exportToCSV(csvData, 'study_hours_plan.csv');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="text-secondary" />
                    Course Load
                </h3>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                    {courses.map((course, index) => (
                        <div key={course.id} className="flex gap-2 items-start p-3 bg-white/5 rounded-lg">
                            <div className="flex-1 space-y-2">
                                <input
                                    placeholder="Course Name"
                                    className="input-field text-sm"
                                    value={course.name}
                                    onChange={e => {
                                        const newCourses = [...courses];
                                        newCourses[index].name = e.target.value;
                                        setCourses(newCourses);
                                    }}
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number" placeholder="Units"
                                        className="input-field text-sm w-24"
                                        value={course.units}
                                        onChange={e => {
                                            const newCourses = [...courses];
                                            newCourses[index].units = e.target.value;
                                            setCourses(newCourses);
                                        }}
                                    />
                                    <select
                                        className="input-field text-sm flex-1"
                                        value={course.targetGrade}
                                        onChange={e => {
                                            const newCourses = [...courses];
                                            newCourses[index].targetGrade = e.target.value;
                                            setCourses(newCourses);
                                        }}
                                    >
                                        <option value="A">Target: A</option>
                                        <option value="B">Target: B</option>
                                        <option value="C">Target: C</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => removeCourse(course.id)} className="p-2 text-red-400 hover:text-red-300">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={addCourse} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-text-muted hover:text-white hover:bg-white/5 mb-4 flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Course
                </button>

                <div className="mb-4">
                    <label className="text-sm font-medium text-text-muted mb-1 block">Goal CGPA (For Adjustment)</label>
                    <input
                        type="number" step="0.01"
                        className="input-field"
                        value={targetCGPA}
                        onChange={e => setTargetCGPA(e.target.value)}
                    />
                </div>

                <button onClick={calculate} disabled={loading} className="btn-primary w-full">
                    {loading ? 'Planning...' : 'Generate Study Plan'}
                </button>
            </div>

            <div className="glass-panel p-6">
                {result ? (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="text-center p-6 bg-primary/10 rounded-xl border border-primary/20">
                            <p className="text-sm text-text-muted mb-1">Total Weekly Study Hours</p>
                            <div className="text-5xl font-bold text-primary flex items-center justify-center gap-2">
                                <Clock size={32} />
                                {result.adjustedTotalHours || result.totalHours || 'N/A'}
                            </div>
                            {result.multiplier && result.multiplier > 1 && (
                                <p className="text-xs text-accent mt-2">
                                    Includes {((result.multiplier - 1) * 100).toFixed(0)}% adjustment for high GPA goal
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-lg">Course Breakdown</h4>
                            {result.courseBreakdown && result.courseBreakdown.length > 0 ? (
                                result.courseBreakdown.map((c, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-background/40 rounded-lg border border-white/5">
                                        <div>
                                            <div className="font-medium">{c.name || `Course ${i + 1}`}</div>
                                            <div className="text-xs text-text-muted">{c.units} Units • Target {c.targetGrade}</div>
                                        </div>
                                        <div className="font-bold text-secondary">{c.hours} hrs/wk</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-text-muted text-sm">No course breakdown available</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => downloadResult('pdf')}
                                className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText size={16} /> PDF
                            </button>
                            <button
                                onClick={() => downloadResult('csv')}
                                className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <FileSpreadsheet size={16} /> CSV
                            </button>
                            <button
                                onClick={() => downloadResult('txt')}
                                className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <File size={16} /> TXT
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                        <BookOpen size={48} className="mb-4" />
                        <p>Add courses and click "Generate Study Plan"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyHoursPlanner;
