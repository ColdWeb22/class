import React, { useState } from 'react';
import { Plus, Trash2, GitCompare, TrendingUp } from 'lucide-react';
import { HelpTooltip } from './Tooltip';
import ConfirmDialog from './ConfirmDialog';
import { calculateRequiredGPA } from '../utils/calculations';
import { exportToPDF } from '../utils/export';
import toast from 'react-hot-toast';

const ComparisonTool = () => {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Scenario 1',
      currentCGPA: '',
      creditsCompleted: '',
      desiredCGPA: '',
      semesterCredits: '',
      result: null
    }
  ]);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const addScenario = () => {
    if (scenarios.length >= 5) {
      toast.error('Maximum 5 scenarios allowed');
      return;
    }
    
    const newScenario = {
      id: Date.now(),
      name: `Scenario ${scenarios.length + 1}`,
      currentCGPA: '',
      creditsCompleted: '',
      desiredCGPA: '',
      semesterCredits: '',
      result: null
    };
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (id) => {
    if (scenarios.length === 1) {
      toast.error('At least one scenario is required');
      return;
    }
    setScenarios(scenarios.filter(s => s.id !== id));
    setDeleteConfirm({ open: false, id: null });
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateScenario = (id) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    const { currentCGPA, creditsCompleted, desiredCGPA, semesterCredits } = scenario;

    if (!currentCGPA || !creditsCompleted || !desiredCGPA || !semesterCredits) {
      toast.error('Please fill all fields');
      return;
    }

    const result = calculateRequiredGPA(
      parseFloat(currentCGPA),
      parseFloat(creditsCompleted),
      parseFloat(desiredCGPA),
      parseFloat(semesterCredits)
    );

    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, result } : s
    ));
    toast.success('Scenario calculated!');
  };

  const calculateAll = () => {
    let allValid = true;
    const updated = scenarios.map(scenario => {
      const { currentCGPA, creditsCompleted, desiredCGPA, semesterCredits } = scenario;

      if (!currentCGPA || !creditsCompleted || !desiredCGPA || !semesterCredits) {
        allValid = false;
        return scenario;
      }

      const result = calculateRequiredGPA(
        parseFloat(currentCGPA),
        parseFloat(creditsCompleted),
        parseFloat(desiredCGPA),
        parseFloat(semesterCredits)
      );

      return { ...scenario, result };
    });

    if (!allValid) {
      toast.error('Some scenarios are missing data');
    } else {
      toast.success('All scenarios calculated!');
    }

    setScenarios(updated);
  };

  const exportComparison = () => {
    const validScenarios = scenarios.filter(s => s.result);
    
    if (validScenarios.length === 0) {
      toast.error('No calculated scenarios to export');
      return;
    }

    exportToPDF({
      title: 'GPA Scenarios Comparison',
      table: {
        headers: ['Scenario', 'Current CGPA', 'Credits', 'Desired CGPA', 'Semester Credits', 'Required GPA', 'Achievable'],
        rows: validScenarios.map(s => [
          s.name,
          s.currentCGPA,
          s.creditsCompleted,
          s.desiredCGPA,
          s.semesterCredits,
          s.result.requiredGPA,
          s.result.isAchievable ? 'Yes' : 'No'
        ])
      }
    }, 'gpa_comparison.pdf');
    toast.success('Comparison exported!');
  };

  const getBestScenario = () => {
    const calculated = scenarios.filter(s => s.result && s.result.isAchievable);
    if (calculated.length === 0) return null;
    
    return calculated.reduce((best, current) => 
      current.result.requiredGPA < best.result.requiredGPA ? current : best
    );
  };

  const bestScenario = getBestScenario();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <GitCompare className="text-primary" />
            Scenario Comparison
          </h2>
          <p className="text-text-muted mt-1">Compare multiple GPA scenarios side by side</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={calculateAll}
            className="px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <TrendingUp size={18} />
            Calculate All
          </button>
          <button
            onClick={addScenario}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Scenario
          </button>
        </div>
      </div>

      {/* Best Scenario Alert */}
      {bestScenario && (
        <div className="glass-panel p-4 border-l-4 border-green-500 bg-green-500/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-500" size={20} />
            <span className="font-semibold text-green-500">Best Scenario</span>
          </div>
          <p className="text-sm">
            <strong>{bestScenario.name}</strong> requires the lowest semester GPA of{' '}
            <strong className="text-green-500">{bestScenario.result.requiredGPA}</strong> to reach your goal
          </p>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="glass-panel p-6 space-y-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={scenario.name}
                onChange={(e) => updateScenario(scenario.id, 'name', e.target.value)}
                className="input-field text-lg font-bold bg-transparent border-none p-0 focus:border-b focus:border-primary"
                placeholder="Scenario name"
              />
              {scenarios.length > 1 && (
                <button
                  onClick={() => setDeleteConfirm({ open: true, id: scenario.id })}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                  aria-label="Delete scenario"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  Current CGPA
                  <HelpTooltip content="Your current cumulative GPA" />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={scenario.currentCGPA}
                  onChange={(e) => updateScenario(scenario.id, 'currentCGPA', e.target.value)}
                  className="input-field mt-1"
                  placeholder="3.5"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  Credits Done
                  <HelpTooltip content="Credits completed" />
                </label>
                <input
                  type="number"
                  value={scenario.creditsCompleted}
                  onChange={(e) => updateScenario(scenario.id, 'creditsCompleted', e.target.value)}
                  className="input-field mt-1"
                  placeholder="60"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  Desired CGPA
                  <HelpTooltip content="Target GPA to achieve" />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={scenario.desiredCGPA}
                  onChange={(e) => updateScenario(scenario.id, 'desiredCGPA', e.target.value)}
                  className="input-field mt-1"
                  placeholder="3.8"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted flex items-center gap-1">
                  Semester Credits
                  <HelpTooltip content="Credits this semester" />
                </label>
                <input
                  type="number"
                  value={scenario.semesterCredits}
                  onChange={(e) => updateScenario(scenario.id, 'semesterCredits', e.target.value)}
                  className="input-field mt-1"
                  placeholder="18"
                />
              </div>
            </div>

            <button
              onClick={() => calculateScenario(scenario.id)}
              className="w-full px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
            >
              Calculate
            </button>

            {/* Result Display */}
            {scenario.result && (
              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-2">Required Semester GPA</p>
                  <div className={`text-4xl font-bold mb-2 ${
                    scenario.result.isAchievable 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent'
                      : 'text-red-500'
                  }`}>
                    {scenario.result.requiredGPA}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    scenario.result.isAchievable 
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {scenario.result.isAchievable ? 'Achievable' : 'Not Achievable'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Export Button */}
      {scenarios.some(s => s.result) && (
        <div className="flex justify-center">
          <button
            onClick={exportComparison}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
          >
            Export Comparison
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={() => removeScenario(deleteConfirm.id)}
        title="Delete Scenario"
        message="Are you sure you want to delete this scenario? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ComparisonTool;
