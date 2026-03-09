import { useState } from 'react';
import { Phone, Mail, User, Calendar, MapPin, IndianRupee, Tag } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Card from './Card';
import { Lead, Property } from '../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onScheduleVisit: (leadId: string, date: string, propertyId: string) => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  properties,
  onScheduleVisit,
}: LeadDetailModalProps) {
  const [visitDate, setVisitDate] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');

  if (!lead) return null;

  const handleScheduleSubmit = () => {
    if (visitDate && selectedProperty) {
      onScheduleVisit(lead.id, visitDate, selectedProperty);
      setVisitDate('');
      setSelectedProperty('');
    }
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3">
        <Icon className="text-gray-400 mt-0.5" size={18} />
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="text-sm text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{lead.name}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={Phone} label="Phone Number" value={lead.phone} />
              <InfoRow icon={Mail} label="Email" value={lead.email} />
              <InfoRow icon={User} label="Assigned Agent" value={lead.assignedAgent} />
              <InfoRow icon={Tag} label="Lead Source" value={lead.source} />
              <InfoRow icon={IndianRupee} label="Budget" value={lead.budget} />
              <InfoRow
                icon={Calendar}
                label="Created Date"
                value={lead.createdAt.toLocaleDateString()}
              />
            </div>

            {lead.requirements && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Requirements</h4>
                <p className="text-sm text-gray-600">{lead.requirements}</p>
              </div>
            )}

            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{lead.notes}</p>
              </div>
            )}

            {lead.scheduledVisit && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Scheduled Visit</h4>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-teal-700 mb-1">Date</p>
                      <p className="text-sm font-medium text-teal-900">
                        {new Date(lead.scheduledVisit.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-teal-300" />
                    <div>
                      <p className="text-xs text-teal-700 mb-1">Property</p>
                      <p className="text-sm font-medium text-teal-900">
                        {lead.scheduledVisit.property}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Visit</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="">Choose a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.name}>
                      {property.name} - {property.location}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleScheduleSubmit}
                disabled={!visitDate || !selectedProperty}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Visit
              </Button>
            </div>
          </Card>

          <Card className="p-6 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Call Lead
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Add Note
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
}
