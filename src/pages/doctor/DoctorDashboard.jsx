import React, { useState } from 'react';
import { 
  Users, Calendar as CalendarIcon, Syringe, Activity, 
  Clock, AlertTriangle, ArrowRight, CheckCircle 
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import { SkeletonStat, SkeletonCard } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/pages/dashboard.css';

const getScheduleStatus = (appointment) => {
  if (appointment.status === 'completed') return 'completed';
  if (appointment.pets?.status === 'emergency' || appointment.status === 'urgent') return 'urgent';
  return 'upcoming';
};

const DoctorDashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const { profile } = useAuth();
  const { stats, todaySchedule, recentPatients, loading: isLoading } = useDoctorDashboard();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerateSuccess(true);
      toast.success('Report generated successfully!');
      setTimeout(() => setGenerateSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title capitalize">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back, Dr. {profile?.full_name || 'Doctor'}</p>
        </div>
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating || generateSuccess}
          className={generateSuccess ? 'bg-green-600 border-green-600' : ''}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Generating...
            </span>
          ) : generateSuccess ? (
            <span className="flex items-center gap-2">
              <CheckCircle size={18} /> Report Ready!
            </span>
          ) : (
            'Generate Report'
          )}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {isLoading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard 
              title="Active Patients" 
              value={stats.patientsCount} 
              icon={Users} 
              trend={{ positive: true, value: 12 }} 
              colorClass="primary"
            />
            <StatCard 
              title="Appointments Today" 
              value={stats.todayAppointmentsCount} 
              icon={CalendarIcon} 
              trend={{ positive: true, value: 5 }} 
              colorClass="primary"
            />
            <StatCard 
              title="Vaccination Rate" 
              value="—" 
              icon={Syringe} 
              trend={{ positive: true, value: 2 }} 
              colorClass="primary"
            />
            <StatCard 
              title="Emergency Cases" 
              value={stats.emergencyCount} 
              icon={Activity} 
              trend={{ positive: false, value: 1 }} 
              colorClass="emergency"
            />
          </>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="grid-left">
          {/* Today's Schedule */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2 className="section-title">Today's Schedule</h2>
              <Button variant="text" size="small">View All</Button>
            </div>
            {isLoading ? (
              <div className="flex flex-col gap-4 mt-4">
                <div style={{ height: '50px', background: 'var(--border)', borderRadius: '8px', opacity: 0.5 }} className="skeleton" />
                <div style={{ height: '50px', background: 'var(--border)', borderRadius: '8px', opacity: 0.5 }} className="skeleton" />
              </div>
            ) : todaySchedule.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '1rem 0', fontSize: '0.9rem' }}>
                No appointments scheduled for today.
              </p>
            ) : (
              <div className="timeline">
                {todaySchedule.map((item) => {
                  const schedStatus = getScheduleStatus(item);
                  const timeStr = new Date(item.date).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit'
                  });
                  return (
                    <div key={item.id} className="timeline-item">
                      <div className="timeline-time">{timeStr}</div>
                      <div className="timeline-dot"><Clock size={20} /></div>
                      <div className="timeline-content relative">
                        <h3 className="timeline-patient">{item.pets?.name || 'Unknown Pet'}</h3>
                        <p className="timeline-reason">{item.notes || item.pets?.type || 'General Visit'}</p>
                        <span className={`timeline-status status-${schedStatus}`}>
                          {schedStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Patients */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <h2 className="section-title">Recent Patients</h2>
              <Button variant="text">See All <ArrowRight size={16} className="ml-1" /></Button>
            </div>
            <div className="recent-patients-grid">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : recentPatients.length === 0 ? (
                <p>No patients found.</p>
              ) : (
                recentPatients.map(pet => (
                  <PetCard 
                    key={pet.id} 
                    name={pet.name} 
                    type={pet.type} 
                    breed={pet.breed}
                    age={pet.age} 
                    status={pet.status} 
                    image={pet.image_url} 
                    ownerName={pet.profiles?.full_name}
                    createdAt={pet.created_at}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid-right">
          {/* Inventory Alerts */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="section-title mb-4">Inventory Alerts</h2>
            <div className="alert-box">
              <AlertTriangle className="alert-icon" size={24} />
              <div>
                <h4 className="alert-title">Low Stock: Rabies Vaccine</h4>
                <p className="alert-desc">Only 5 doses remaining. Please restock immediately.</p>
                <Button variant="outline" size="small" className="mt-2 text-sm py-1 px-3">Order Now</Button>
              </div>
            </div>
          </div>

          {/* Treatment Progress */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="section-title">Treatment Progress</h2>
            <div className="donut-chart-container">
              <div className="donut">
                <div className="donut-inner">
                  <span className="donut-value">75%</span>
                  <span className="donut-label">Success</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Stats Bar Chart */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="section-title">Patient Stats</h2>
            <div className="bar-chart">
              <div className="bar" style={{ height: '60%' }}><span>Mon</span></div>
              <div className="bar" style={{ height: '80%' }}><span>Tue</span></div>
              <div className="bar" style={{ height: '100%' }}><span>Wed</span></div>
              <div className="bar" style={{ height: '40%' }}><span>Thu</span></div>
              <div className="bar" style={{ height: '70%' }}><span>Fri</span></div>
              <div className="bar" style={{ height: '50%' }}><span>Sat</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
