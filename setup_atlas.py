#!/usr/bin/env python3
"""
MongoDB Atlas Setup Helper
This script helps you set up MongoDB Atlas for Mind-Scroll
"""

import os
import sys

def print_header():
    print("\n" + "=" * 60)
    print("  🍃 MONGODB ATLAS SETUP FOR MIND-SCROLL")
    print("=" * 60 + "\n")

def check_env_file():
    """Check if .env file exists"""
    env_path = os.path.join("src", "backend", ".env")
    return os.path.exists(env_path)

def create_env_file():
    """Create .env file from template"""
    env_path = os.path.join("src", "backend", ".env")
    env_example_path = os.path.join("src", "backend", "env.example")
    
    print("📝 Creating .env file...")
    
    try:
        with open(env_example_path, 'r') as f:
            template = f.read()
        
        with open(env_path, 'w') as f:
            f.write(template)
        
        print(f"✅ Created .env file at: {env_path}")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def print_instructions():
    """Print setup instructions"""
    print("\n" + "=" * 60)
    print("  📋 SETUP STEPS")
    print("=" * 60 + "\n")
    
    print("1️⃣  CREATE MONGODB ATLAS ACCOUNT")
    print("    → Go to: https://www.mongodb.com/cloud/atlas/register")
    print("    → Sign up (FREE)")
    print("    → Create a FREE cluster (M0)")
    print()
    
    print("2️⃣  CREATE DATABASE USER")
    print("    → Go to: Database Access → Add New Database User")
    print("    → Username: mindscroll_admin (or your choice)")
    print("    → Password: Generate secure password")
    print("    → Privilege: Read and write to any database")
    print("    → ⚠️  SAVE YOUR PASSWORD!")
    print()
    
    print("3️⃣  SETUP NETWORK ACCESS")
    print("    → Go to: Network Access → Add IP Address")
    print("    → Choose: Allow Access from Anywhere (0.0.0.0/0)")
    print("    → (For development - restrict in production)")
    print()
    
    print("4️⃣  GET CONNECTION STRING")
    print("    → Go to: Database → Connect → Connect your application")
    print("    → Copy connection string")
    print("    → Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/")
    print()
    
    print("5️⃣  UPDATE .env FILE")
    print(f"    → Open: src/backend/.env")
    print("    → Update MONGODB_URL with your connection string")
    print("    → Add /mindscroll at the end")
    print("    → Example:")
    print("      MONGODB_URL=mongodb+srv://user:pass@cluster.net/mindscroll?retryWrites=true&w=majority")
    print()
    
    print("6️⃣  TEST CONNECTION")
    print("    → Run: cd src/backend")
    print("    → Run: python test_mongodb_connection.py")
    print()
    
    print("=" * 60)
    print("\n📖 For detailed instructions, see:")
    print("   - QUICK_START_ATLAS.md (Quick guide)")
    print("   - MONGODB_ATLAS_SETUP.md (Detailed guide)")
    print()

def main():
    print_header()
    
    # Check if we're in the right directory
    if not os.path.exists("src"):
        print("❌ Error: Please run this script from the Mind-Scroll root directory")
        print("   Current directory:", os.getcwd())
        sys.exit(1)
    
    # Check if .env exists
    if check_env_file():
        print("✅ .env file already exists")
        print(f"   Location: src/backend/.env")
        print("\n⚠️  Make sure to update it with your MongoDB Atlas credentials!")
    else:
        print("📝 .env file not found. Creating from template...")
        if create_env_file():
            print("\n✅ .env file created successfully!")
            print("   Now you need to update it with your credentials")
        else:
            print("\n❌ Failed to create .env file")
            print("   Please create it manually from env.example")
    
    print_instructions()
    
    print("\n" + "=" * 60)
    print("  🎯 NEXT STEPS")
    print("=" * 60)
    print("\n1. Follow the steps above to set up MongoDB Atlas")
    print("2. Update src/backend/.env with your credentials")
    print("3. Run: cd src/backend && python test_mongodb_connection.py")
    print("4. If successful, start your app!")
    print("\n✨ Good luck! Your app will be cloud-ready!\n")

if __name__ == "__main__":
    main()

