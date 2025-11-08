"""
Check what IP Railway is using to connect to MongoDB
Run this once on Railway to see the IP address
"""
import socket
import requests

def check_railway_ip():
    """Check Railway's outbound IP"""
    try:
        # Check public IP
        response = requests.get('https://api.ipify.org?format=json', timeout=5)
        public_ip = response.json()['ip']
        print(f"Railway's Outbound IP: {public_ip}")
        return public_ip
    except Exception as e:
        print(f"Error checking IP: {e}")
        return None

def check_dns_resolution():
    """Check DNS resolution"""
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        print(f"Hostname: {hostname}")
        print(f"Local IP: {local_ip}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("  RAILWAY IP CHECK")
    print("=" * 50)
    check_railway_ip()
    check_dns_resolution()
    print("=" * 50)




