import React, { useState } from 'react';
import { Target, ArrowRight, Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { apiClient } from '../config/api';
import { exportToPDF, exportToCSV, exportToText } from '../utils/export';

const GradeAnalyzer = () => {
    const [courses, setCourses] = useState([
        { id: 1, name: '', units: '' }
    ]);
    const [targetGPA, setTargetGPA] = useState('');
    const [result, setResult] = useState(null);

    const addCourse = () => setCourses([...courses, { id: Date.now(), name: '', units: '' }]);
    const removeCourse = (id) => setCourses(courses.filter(c => c.id !== id));

    const analyze = async () => {
        try {
            const response = await apiClient.post('/api/planner/analyze-grades', {
                courses: courses.map(c => ({ name: c.name, units: parseFloat(c.units) })),
                targetSemesterGPA: parseFloat(targetGPA)
            });
            // Backend returns { success, data: { achievedGPA, gradeCombination, isAchievable } }
            const resultData = response.data || response;
            setResult(resultData);
            console.log('Grade analysis result:', resultData);
        } catch (e) {
            console.error('Analysis error:', e);
            alert('Analysis failed. Please check console for details.');
        }
    };

    const downloadResult = (format = 'txt') => {
        if (!result) return;

        if (format === 'txt') {
            let report = `
Study Planner - Grade Analysis Report
---------------------------------------
Target Semester GPA: ${targetGPA}

Result: ${result.success ? 'SUCCESS' : 'NOT POSSIBLE'}
Achieved GPA: ${result.achievedGPA}

Recommended Grade Path:
`;
            if (result.gradeCombination && Array.isArray(result.gradeCombination)) {
                result.gradeCombination.forEach(c => {
                    report += `- ${c.name || 'Course'}: Grade ${c.grade} (${c.points} pts, ${c.units} Units)\n`;
                });
            }
            if (!result.success) {
                report += `\nNote: Even with maximum grades, the target GPA cannot be reached.`;
            }
            exportToText(report, 'grade_analysis.txt');
        } else if (format === 'pdf') {
            const pdfData = {
                title: 'Grade Analysis Report',
                summary: {
                    'Target Semester GPA': targetGPA,
                    'Result': result.success ? 'SUCCESS' : 'NOT POSSIBLE',
                    'Achieved GPA': result.achievedGPA
                },
                table: {
                    headers: ['Course', 'Grade', 'Points', 'Units'],
                    rows: result.gradeCombination ? result.gradeCombination.map(c => [
                        c.name || 'Course',
                        c.grade,
                        c.points,
                        c.units
                    ]) : []
                }
            };
            exportToPDF(pdfData, 'grade_analysis.pdf');
        } else if (format === 'csv') {
            const csvData = result.gradeCombination ? result.gradeCombination.map(c => ({
                Course: c.name || 'Course',
                Grade: c.grade,
                Points: c.points,
                Units: c.units
            })) : [];
            exportToCSV(csvData, 'grade_analysis.csv');
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass-panel p-6">
                <h3 className="text-xl font-semibold mb-4 text-accent flex items-center gap-2">
                    <Target /> Minimum Grade Analyzer
                </h3>
                <p className="text-text-muted mb-6 text-sm">
                    Find the minimum grades required to hit your target Semester GPA. This helps you prioritize "easy" vs "hard" classes.
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs uppercase font-bold text-text-muted mb-1 block">Target Semester GPA</label>
                        <input
                            type="number" step="0.01"
                            className="input-field"
                            value={targetGPA} onChange={e => setTargetGPA(e.target.value)}
                            placeholder="e.g. 3.5"
                        />
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.map((course, idx) => (
                                <div key={course.id} className="flex gap-2">
                                    <input
                                        placeholder="Course Name" className="input-field"
                                        value={course.name} onChange={e => {
                                            const c = [...courses]; c[idx].name = e.target.value; setCourses(c);
                                        }}
                                    />
                                    <input
                                        placeholder="Units" type="number" className="input-field w-24"
                                        value={course.units} onChange={e => {
                                            const c = [...courses]; c[idx].units = e.target.value; setCourses(c);
                                        }}
                                    />
                                    {courses.length > 1 && (
                                        <button onClick={() => removeCourse(course.id)} className="text-red-400">&times;</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={addCourse} className="text-sm text-primary mt-2 hover:underline">+ Add Course</button>
                    </div>
                </div>

                <button onClick={analyze} className="btn-primary w-full md:w-auto">Analyze Minimum Path</button>
            </div>

            {result && (
                <div className="glass-panel p-6 animate-in fade-in slide-in-from-bottom-8">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold">Recommended Path</h4>
                        <div className={`text-2xl font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                            GPA: {result.achievedGPA}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {result.gradeCombination && result.gradeCombination.map((c, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${c.points >= 4 ? 'bg-primary/20 border-primary/50' : 'bg-surface border-white/5'} flex flex-col items-center text-center transition-all hover:scale-105`}>
                                <div className="text-3xl font-display font-bold mb-2">{c.grade}</div>
                                <div className="font-medium text-sm truncate w-full">{c.name || 'Course'}</div>
                                <div className="text-xs text-text-muted">{c.units} Units</div>
                            </div>
                        ))}
                    </div>

                    {!result.success && (
                        <p className="text-center text-red-400 mt-4 text-sm">
                            Even with all A's (or max grades), the target cannot be reached. Or loop limit reached.
                        </p>
                    )}

                    <div className="mt-6 flex gap-2">
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
            )}
        </div>
    );
};

export default GradeAnalyzer;
