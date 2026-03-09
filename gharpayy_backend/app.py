from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS # 1. Add this import
from datetime import datetime

app = Flask(__name__)
CORS(app) # 2. Add this line right below app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gharpayy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- DATABASE MODELS ---

class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    leads = db.relationship('Lead', backref='agent', lazy=True)

class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) # [cite: 46]
    phone = db.Column(db.String(20), nullable=False) # [cite: 47]
    source = db.Column(db.String(50), nullable=False) # [cite: 48]
    status = db.Column(db.String(50), default='New Lead') # [cite: 51, 62]
    created_at = db.Column(db.DateTime, default=datetime.utcnow) # [cite: 49]
    assigned_agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False) # [cite: 50]
    visits = db.relationship('Visit', backref='lead', lazy=True)

class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('lead.id'), nullable=False)
    property_name = db.Column(db.String(100), nullable=False) # [cite: 74]
    visit_date = db.Column(db.DateTime, nullable=False) # [cite: 75]
    outcome = db.Column(db.String(50), default='Pending') # [cite: 76]


@app.route('/api/leads', methods=['POST'])
def create_lead():
    data = request.json
    
    # 1. Validate incoming data
    if not data or not data.get('name') or not data.get('phone') or not data.get('source'):
        return jsonify({'error': 'Missing required fields'}), 400
        
    # 2. Round Robin Logic
    agents = Agent.query.order_by(Agent.id).all()
    if not agents:
        return jsonify({'error': 'No agents available in the system'}), 500
        
    last_lead = Lead.query.order_by(Lead.id.desc()).first()
    assigned_agent = agents[0] 
    
    if last_lead:
        # Find the index of the last assigned agent in our list
        last_agent_index = next((i for i, agent in enumerate(agents) if agent.id == last_lead.assigned_agent_id), -1)
        
        # Pick the next agent, and loop back to the start if we reach the end of the list
        next_agent_index = (last_agent_index + 1) % len(agents)
        assigned_agent = agents[next_agent_index]
        
    # 3. Create the new lead profile
    new_lead = Lead(
        name=data['name'],
        phone=data['phone'],
        source=data['source'],
        assigned_agent_id=assigned_agent.id
    )
    
    db.session.add(new_lead)
    db.session.commit()
    
    return jsonify({
        'message': 'Lead captured successfully',
        'lead_id': new_lead.id,
        'assigned_to': assigned_agent.name,
        'status': new_lead.status
    }), 201

# --- GET ALL LEADS (For the Kanban Board) ---
@app.route('/api/leads', methods=['GET'])
def get_leads():
    leads = Lead.query.all()
    result = []
    for lead in leads:
        result.append({
            'id': lead.id,
            'name': lead.name,
            'phone': lead.phone,
            'source': lead.source,
            'status': lead.status,
            'assigned_to': lead.agent.name
        })
    return jsonify(result), 200

# --- UPDATE LEAD STATUS (For Drag and Drop) ---
@app.route('/api/leads/<int:lead_id>/status', methods=['PUT'])
def update_lead_status(lead_id):
    data = request.json
    new_status = data.get('status')
    
    # Strictly enforcing the pipeline stages requested in the assignment
    valid_stages = ['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost']
    
    if new_status not in valid_stages:
        return jsonify({'error': 'Invalid pipeline stage'}), 400
        
    lead = Lead.query.get(lead_id)
    if not lead:
        return jsonify({'error': 'Lead not found'}), 404
        
    lead.status = new_status
    db.session.commit()
    
    return jsonify({'message': 'Status updated successfully', 'new_status': lead.status}), 200

# --- SCHEDULE A VISIT ---
@app.route('/api/leads/<int:lead_id>/visits', methods=['POST'])
def schedule_visit(lead_id):
    data = request.json
    
    if not data.get('property_name') or not data.get('visit_date'):
        return jsonify({'error': 'Missing property name or visit date'}), 400
        
    lead = Lead.query.get(lead_id)
    if not lead:
        return jsonify({'error': 'Lead not found'}), 404
        
    # Convert string date to Python datetime object
    try:
        visit_date = datetime.fromisoformat(data['visit_date'])
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
    
    new_visit = Visit(
        lead_id=lead.id,
        property_name=data['property_name'],
        visit_date=visit_date
    )
    
    # Automatically move the lead to the right pipeline stage
    lead.status = 'Visit Scheduled'
    
    db.session.add(new_visit)
    db.session.commit()
    
    return jsonify({'message': 'Visit scheduled successfully', 'visit_id': new_visit.id}), 201

# --- DASHBOARD ANALYTICS ---
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_stats():
    # 1. Total leads received
    total_leads = Lead.query.count()
    
    # 2. Leads in each pipeline stage
    stages = [
        'New Lead', 'Contacted', 'Requirement Collected', 
        'Property Suggested', 'Visit Scheduled', 
        'Visit Completed', 'Booked', 'Lost'
    ]
    pipeline_counts = {}
    for stage in stages:
        pipeline_counts[stage] = Lead.query.filter_by(status=stage).count()
        
    # 3. Visits scheduled
    total_visits = Visit.query.count()
    
    # 4. Bookings confirmed
    bookings_confirmed = Lead.query.filter_by(status='Booked').count()
    
    return jsonify({
        'total_leads_received': total_leads,
        'leads_by_stage': pipeline_counts,
        'visits_scheduled': total_visits,
        'bookings_confirmed': bookings_confirmed
    }), 200

# --- INITIALIZE DATABASE ---

with app.app_context():
    db.create_all()
    
    # Add dummy agents for testing if the table is empty
    if not Agent.query.first():
        agent1 = Agent(name="Rahul", email="rahul@gharpayy.com")
        agent2 = Agent(name="Sneha", email="sneha@gharpayy.com")
        db.session.add_all([agent1, agent2])
        db.session.commit()
        print("Database initialized with dummy agents.")

if __name__ == '__main__':
    app.run(debug=True)