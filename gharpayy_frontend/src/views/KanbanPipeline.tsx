import { Phone, User } from 'lucide-react';
import Card from '../components/Card';
import { Lead, LeadStatus } from '../types';

interface KanbanPipelineProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

const columns: LeadStatus[] = [
  'New Lead',
  'Contacted',
  'Requirement Collected',
  'Property Suggested',
  'Visit Scheduled',
  'Visit Completed',
  'Booked',
  'Lost',
];

const columnColors: Record<LeadStatus, string> = {
  'New Lead': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-purple-100 text-purple-800',
  'Requirement Collected': 'bg-yellow-100 text-yellow-800',
  'Property Suggested': 'bg-orange-100 text-orange-800',
  'Visit Scheduled': 'bg-teal-100 text-teal-800',
  'Visit Completed': 'bg-cyan-100 text-cyan-800',
  'Booked': 'bg-green-100 text-green-800',
  'Lost': 'bg-red-100 text-red-800',
};

export default function KanbanPipeline({ leads, onLeadClick }: KanbanPipelineProps) {
  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter((lead) => lead.status === status);
  };

  return (
    <div className="p-8 h-screen overflow-hidden flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Pipeline</h1>
        <p className="text-gray-600">Manage and track leads through your sales pipeline</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {columns.map((column) => {
          const columnLeads = getLeadsByStatus(column);
          return (
            <div key={column} className="flex-shrink-0 w-80">
              <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column}</h3>
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1">
                  {columnLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      onClick={() => onLeadClick(lead)}
                      className="p-4 hover:shadow-lg transition-all"
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                            {/* Follow-up reminder logic */}
                            {lead.status === 'New Lead' && 
                             (new Date().getTime() - new Date(lead.createdAt).getTime()) > 86400000 && (
                              <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                Follow up!
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{lead.phone}</span>
                          </div>
                        </div>

                        {lead.budget && (
                          <div className="text-sm text-gray-700 font-medium">
                            {lead.budget}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                            <User size={12} className="text-gray-600" />
                            <span className="text-xs text-gray-700">{lead.assignedAgent}</span>
                          </div>
                        </div>

                        {lead.scheduledVisit && (
                          <div className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded">
                            Visit: {new Date(lead.scheduledVisit.date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
