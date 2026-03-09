import requests
import json

print("Fetching Dashboard Analytics...\n")
response = requests.get("http://127.0.0.1:5000/api/dashboard")

# Using json.dumps to print it out nicely formatted
print(json.dumps(response.json(), indent=2))