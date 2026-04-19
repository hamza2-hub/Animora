import React from 'react';
import { 
  Users, Calendar as CalendarIcon, Syringe, Activity, 
  Clock, AlertTriangle, ArrowRight 
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import { useAppContext } from '../../core/context/AppContext';
import { mockStats, mockSchedule, mockPatients } from '../../data/mockData';
import '../../styles/pages/dashboard.css';

const DoctorDashboard = () => {
  const { activeTab } = useAppContext();

  const renderOverview = () => (
    <>
      <div className="stats-grid">
        <StatCard 
          title="Active Patients" 
          value={mockStats.totalPatients} 
          icon={Users} 
          trend={{ positive: true, value: 12 }} 
          colorClass="primary"
        />
        <StatCard 
          title="Appointments Today" 
          value={mockStats.todayAppointments} 
          icon={CalendarIcon} 
          trend={{ positive: true, value: 5 }} 
          colorClass="primary"
        />
        <StatCard 
          title="Vaccination Rate" 
          value={`${mockStats.vaccinationRate}%`} 
          icon={Syringe} 
          trend={{ positive: true, value: 2 }} 
          colorClass="primary"
        />
        <StatCard 
          title="Emergency Cases" 
          value={mockStats.emergencies} 
          icon={Activity} 
          trend={{ positive: false, value: 1 }} 
          colorClass="emergency"
        />
      </div>

      <div className="dashboard-grid">
        <div className="grid-left">
          {/* Timeline Schedule */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2 className="section-title">Today's Schedule</h2>
              <Button variant="text" size="small">View All</Button>
            </div>
            <div className="timeline">
              {mockSchedule.map((item, idx) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-dot"><Clock size={20} /></div>
                  <div className="timeline-content relative">
                    <h3 className="timeline-patient">{item.patient}</h3>
                    <p className="timeline-reason">{item.reason}</p>
                    <span className={`timeline-status status-${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <h2 className="section-title">Recent Patients</h2>
              <Button variant="text">See All <ArrowRight size={16} className="ml-1" /></Button>
            </div>
            <div className="recent-patients-grid">
              {mockPatients.slice(0, 3).map(pet => (
                <PetCard key={pet.id} name={pet.name} type={pet.type} age={pet.breed || pet.age} status={pet.status} image={pet.image} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid-right">
          {/* Low Stock Alert */}
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

          {/* Progress Charts Placeholder */}
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
    </>
  );

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title capitalize">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
          </h1>
          <p className="dashboard-subtitle">
            {activeTab === 'dashboard' ? 'Welcome back, Dr. John' : 'Manage your clinic data efficiently'}
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {activeTab === 'dashboard' ? renderOverview() : (
        <div className="section-card animate-slide-up text-center p-8">
          <h2 className="section-title text-muted">Feature Coming Soon</h2>
          <p className="text-muted mt-2">The {activeTab} section is currently under active development.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
