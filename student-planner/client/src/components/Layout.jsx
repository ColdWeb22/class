import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, GraduationCap, LayoutDashboard, LogOut, Moon, Sun, User, Calendar, GitCompare, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
        { to: '/planner/gpa', label: 'GPA Planner', icon: GraduationCap, auth: false },
        { to: '/planner/study', label: 'Study Hours', icon: BookOpen, auth: false },
        { to: '/planner/grades', label: 'Grade Analyzer', icon: Calculator, auth: false },
        { to: '/planner/comparison', label: 'Compare Scenarios', icon: GitCompare, auth: false },
        { to: '/insights', label: 'Insights', icon: TrendingUp, auth: false },
        { to: '/semesters', label: 'Semesters', icon: Calendar, auth: true },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const visibleNavItems = navItems.filter(item => !item.auth || isAuthenticated);

    return (
        <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? 'dark' : 'light'}`}>
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-surface/80 backdrop-blur-md border-r border-white/10 p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
                        SP
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Student<br />Planner
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {visibleNavItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-text-muted hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-white/5 hover:text-white transition-all"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive ? 'bg-primary text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <User size={20} />
                                <span className="font-medium truncate">{user?.name}</span>
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
                        >
                            <User size={20} />
                            <span className="font-medium">Sign In</span>
                        </NavLink>
                    )}

                    <div className="pt-6 border-t border-white/10 text-xs text-text-muted">
                        &copy; 2025 Student Planner
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
