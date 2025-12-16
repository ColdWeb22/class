import React, { useState } from 'react';
import { ArrowRight, Calculator, Download, Undo, Redo } from 'lucide-react';
import { apiClient } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import toast from 'react-hot-toast';
import { validateGPA, validateCredits } from '../utils/validation';
import { exportToPDF, exportToCSV, exportToText } from '../utils/export';
import { HelpTooltip } from '../components/Tooltip';

const CGPAPlanner = () => {
  const [formData, setFormData] = useState({
    currentCGPA: '',
    creditsCompleted: '',
    desiredCGPA: '',
    semesterCredits: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuth();
  const { pushState, undo, redo, canUndo, canRedo } = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!validateGPA(formData.currentCGPA)) {
      newErrors.currentCGPA = 'Current CGPA must be between 0 and 5';
    }
    
    if (!validateCredits(formData.creditsCompleted)) {
      newErrors.creditsCompleted = 'Credits must be a positive number';
    }
    
    if (!validateGPA(formData.desiredCGPA)) {
      newErrors.desiredCGPA = 'Desired CGPA must be between 0 and 5';
    }
    
    if (!validateCredits(formData.semesterCredits) || parseInt(formData.semesterCredits) < 1) {
      newErrors.semesterCredits = 'Semester credits must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = async () => {
    if (!validate()) {
      toast.error('Please fix the errors');
      return;
    }

    setLoading(true);
    try {
      pushState({ formData, result });

      const response = await apiClient.post('/api/planner/calculate-gpa', {
        currentCGPA: parseFloat(formData.currentCGPA),
        creditsCompleted: parseFloat(formData.creditsCompleted),
        desiredCGPA: parseFloat(formData.desiredCGPA),
        semesterCredits: parseFloat(formData.semesterCredits),
        saveToProfile: isAuthenticated
      });

      if (response.success) {
        setResult(response.data);
        toast.success('Calculation complete!');
      }
    } catch (error) {
      toast.error(error.message || 'Error calculating GPA');
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setFormData(previousState.formData);
      setResult(previousState.result);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setFormData(nextState.formData);
      setResult(nextState.result);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    exportToPDF({
      title: 'GPA Requirement Report',
      summary: {
        'Current CGPA': formData.currentCGPA,
        'Completed Credits': formData.creditsCompleted,
        'Desired CGPA': formData.desiredCGPA,
        'Semester Credits': formData.semesterCredits,
        'Required Semester GPA': result.requiredSemesterGPA,
        'Achievable': result.isAchievable ? 'Yes' : 'No'
      }
    }, 'gpa_requirement.pdf');
    toast.success('PDF downloaded!');
  };

  const downloadCSV = () => {
    if (!result) return;
    exportToCSV([
      ['Metric', 'Value'],
      ['Current CGPA', formData.currentCGPA],
      ['Completed Credits', formData.creditsCompleted],
      ['Desired CGPA', formData.desiredCGPA],
      ['Semester Credits', formData.semesterCredits],
      ['Required Semester GPA', result.requiredSemesterGPA],
      ['Achievable', result.isAchievable ? 'Yes' : 'No']
    ], 'gpa_requirement.csv');
    toast.success('CSV downloaded!');
  };

  const downloadText = () => {
    if (!result) return;
    const report = `
Study Planner - GPA Requirement Report
----------------------------------------
Current CGPA: ${formData.currentCGPA}
Completed Credits: ${formData.creditsCompleted}
Desired CGPA: ${formData.desiredCGPA}
Semester Credits: ${formData.semesterCredits}

Required Semester GPA: ${result.requiredSemesterGPA}
Achievable: ${result.isAchievable ? 'Yes' : 'No'}
    `.trim();
    exportToText(report, 'gpa_requirement.txt');
    toast.success('Text file downloaded!');
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">GPA Planner</h2>
          <p className="text-text-muted mt-1">Calculate the GPA you need to achieve your goals</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Redo"
          >
            <Redo size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calculator className="text-primary" />
            Input Academic Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                Current CGPA
                <HelpTooltip content="Your current cumulative GPA (0-5 scale)" />
              </label>
              <input
                type="number" step="0.01" name="currentCGPA"
                value={formData.currentCGPA} onChange={handleChange}
                className={`input-field ${errors.currentCGPA ? 'border-red-500' : ''}`}
                placeholder="e.g. 3.5"
                aria-invalid={!!errors.currentCGPA}
              />
              {errors.currentCGPA && <p className="text-red-500 text-sm">{errors.currentCGPA}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                Completed Credits
                <HelpTooltip content="Total credit hours you've completed" />
              </label>
              <input
                type="number" name="creditsCompleted"
                value={formData.creditsCompleted} onChange={handleChange}
                className={`input-field ${errors.creditsCompleted ? 'border-red-500' : ''}`}
                placeholder="e.g. 60"
                aria-invalid={!!errors.creditsCompleted}
              />
              {errors.creditsCompleted && <p className="text-red-500 text-sm">{errors.creditsCompleted}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                Desired CGPA
                <HelpTooltip content="The GPA you want to achieve" />
              </label>
              <input
                type="number" step="0.01" name="desiredCGPA"
                value={formData.desiredCGPA} onChange={handleChange}
                className={`input-field ${errors.desiredCGPA ? 'border-red-500' : ''}`}
                placeholder="e.g. 3.8"
                aria-invalid={!!errors.desiredCGPA}
              />
              {errors.desiredCGPA && <p className="text-red-500 text-sm">{errors.desiredCGPA}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                Semester Credits
                <HelpTooltip content="Credits you'll take this semester" />
              </label>
              <input
                type="number" name="semesterCredits"
                value={formData.semesterCredits} onChange={handleChange}
                className={`input-field ${errors.semesterCredits ? 'border-red-500' : ''}`}
                placeholder="e.g. 18"
                aria-invalid={!!errors.semesterCredits}
              />
              {errors.semesterCredits && <p className="text-red-500 text-sm">{errors.semesterCredits}</p>}
            </div>
          </div>

          <button
            onClick={calculate} disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Calculating...' : 'Calculate Requirement'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </div>

        {/* Result Section */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          {result !== null ? (
            <div className="relative z-10 text-center animate-in zoom-in duration-300 w-full">
              <p className="text-text-muted mb-2">Required Semester GPA</p>
              <div className={`text-6xl font-bold mb-4 ${
                result.isAchievable ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent' : 'text-red-500'
              }`}>
                {result.requiredSemesterGPA}
              </div>
              <p className="max-w-xs mx-auto text-sm text-text-muted mb-6">
                {!result.isAchievable
                  ? "This goal might be unrealistic given the credits remaining."
                  : result.requiredSemesterGPA >= 4.5
                  ? "Challenging but achievable with focused effort!"
                  : "You can achieve this!"}
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  aria-label="Download PDF"
                >
                  <Download size={16} /> PDF
                </button>
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  aria-label="Download CSV"
                >
                  <Download size={16} /> CSV
                </button>
                <button
                  onClick={downloadText}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  aria-label="Download Text"
                >
                  <Download size={16} /> TXT
                </button>
              </div>
            </div>
          ) : (
            <div className="text-text-muted text-center">
              <Calculator size={48} className="mx-auto mb-4 opacity-20" />
              <p>Enter your details to generate a prediction.</p>
            </div>
          )}

          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-0"></div>
        </div>
      </div>
    </div>
  );
};

export default CGPAPlanner;
