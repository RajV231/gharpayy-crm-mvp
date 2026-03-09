const BASE_URL = 'http://127.0.0.1:5000/api';

export const fetchDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
};

export const fetchLeads = async () => {
    const response = await fetch(`${BASE_URL}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
};

export const createNewLead = async (leadData: { name: string; phone: string; source: string }) => {
    const response = await fetch(`${BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
};

export const updateLeadStatus = async (leadId: number, newStatus: string) => {
    const response = await fetch(`${BASE_URL}/leads/${leadId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
};