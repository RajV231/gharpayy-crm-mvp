import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import KanbanPipeline from './views/KanbanPipeline';
import AddNewLead from './views/AddNewLead';
import LeadDetailModal from './components/LeadDetailModal';
import { mockProperties } from './mockData'; 
import { Lead, LeadSource } from './types';
import { fetchLeads, createNewLead } from './api'; 

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch leads from your Python backend
  const loadLeads = async () => {
    try {
      const data = await fetchLeads();
      // Map the backend data to match your React types
      const formattedLeads = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        phone: item.phone,
        email: '', 
        source: item.source,
        status: item.status,
        assignedAgent: item.assigned_to,
        createdAt: new Date(), 
      }));
      setLeads(formattedLeads);
    } catch (error) {
      console.error("Error loading leads:", error);
    }
  };

  // Load leads when the app starts
  useEffect(() => {
    loadLeads();
  }, []);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleScheduleVisit = async (leadId: string, date: string, propertyName: string) => {
    try {
      // Call your Flask API to schedule the visit
      await fetch(`http://127.0.0.1:5000/api/leads/${leadId}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          property_name: propertyName, 
          visit_date: new Date(date).toISOString() 
        })
      });
      
      // Refresh the leads to see the updated "Visit Scheduled" status
      await loadLeads();
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (error) {
      console.error("Error scheduling visit:", error);
    }
  };

  const handleAddLead = async (newLeadData: any) => {
    try {
      // Send the new lead to your Flask API
      await createNewLead({
        name: newLeadData.name,
        phone: newLeadData.phone,
        source: newLeadData.source
      });
      
      // Refresh the pipeline
      await loadLeads();
      setActiveView('kanban');
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 overflow-auto">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'kanban' && (
          <KanbanPipeline leads={leads} onLeadClick={handleLeadClick} />
        )}
        {activeView === 'add-lead' && <AddNewLead onAddLead={handleAddLead} />}
      </div>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
        properties={mockProperties}
        onScheduleVisit={handleScheduleVisit}
      />
    </div>
  );
}

export default App;