import requests

# Define the URL and headers
url = "http://localhost:8080/projects/2/modules/3/repository/sync"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzc0MTEwNzEsInVzZXJfaWQiOjF9.SRd1zVDQIV2kJq6QmxZ_Q3Etzfmh1kMjpsbT5umbmRs"
}

# Send the POST request (no body needed)
response = requests.post(url, headers=headers)

# Print the response
print("Status Code:", response.status_code)
print("Response Body:", response.json())