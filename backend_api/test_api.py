import requests

BASE = "http://127.0.0.1:8001/api"

print("=== Health ===")
r = requests.get(f"{BASE}/health")
print(r.json())

print("\n=== Backgrounds ===")
r = requests.get(f"{BASE}/backgrounds")
data = r.json()
print(f"Status: {r.status_code}, Items: {len(data.get('data', []))}")
for item in data.get("data", []):
    print(f"  - {item['name']}")

print("\n=== Mascots ===")
r = requests.get(f"{BASE}/mascots")
data = r.json()
print(f"Status: {r.status_code}, Items: {len(data.get('data', []))}")
for item in data.get("data", []):
    print(f"  - {item['name']}")

print("\n=== Filters ===")
r = requests.get(f"{BASE}/filters")
data = r.json()
print(f"Status: {r.status_code}, Items: {len(data.get('data', []))}")
for item in data.get("data", []):
    print(f"  - {item['name']}")

print("\n=== Create Session ===")
r = requests.post(f"{BASE}/photobooth/session")
print(f"Status: {r.status_code}")
print(r.json())
