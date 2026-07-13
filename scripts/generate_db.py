import csv
import json
import os
import re


def process_leetcode_data(repo_path, output_file):
    leetcode_questions = {}
    
    # Regex pattern: 'problems/' ke baad wala part extract karne ke liye
    slug_pattern = re.compile(r"problems/([^/]+)")

    # 1. Check karna ki repo cloned hai ya nahi
    if not os.path.exists(repo_path):
        print(f"Bhai, '{repo_path}' folder nahi mila. Pehle repo clone kar lo!")
        return

    # Valid company folders ko array me store karna (hidden folders like .git ignore karke)
    company_folders = [f for f in os.listdir(repo_path) 
                       if os.path.isdir(os.path.join(repo_path, f)) and not f.startswith('.')]

    # 2. Har company folder me loop lagana
    for company in company_folders:
        company_path = os.path.join(repo_path, company)
        
        # 3. Folder ke andar ki CSV files (time periods) par loop lagana
        for file_name in os.listdir(company_path):
            if file_name.endswith('.csv'):
                time_period = file_name.replace('.csv', '') # e.g., 'Thirty Days'
                csv_path = os.path.join(company_path, file_name)
                
                # 4. CSV open karna aur data extract karna
                with open(csv_path, mode='r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    
                    for row in reader:
                        link = row.get('Link', '')
                        match = slug_pattern.search(link)
                        
                        if not match:
                            continue
                            
                        slug = match.group(1) # Exact question slug mil gaya
                        
                        # Agar naya question hai toh pehle JSON object initialize karo
                        if slug not in leetcode_questions:
                            leetcode_questions[slug] = {
                                "title": row.get('Title', ''),
                                "companies": {}
                            }
                        
                        # Agar us question ke object me yeh company pehli baar aa rahi hai
                        if company not in leetcode_questions[slug]["companies"]:
                            leetcode_questions[slug]["companies"][company] = {}
                            
                        # Final nested value set karna: Company -> Time Period -> Frequency
                        leetcode_questions[slug]["companies"][company][time_period] = {
                            "frequency": row.get('Frequency', '')
                        }

    # 5. Final optimized data ko JSON file me dump karna
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(leetcode_questions, json_file, indent=4)
        
    print(f"Ekdum Done! Total {len(leetcode_questions)} unique questions ka lean data '{output_file}' me save ho gaya hai.")

if __name__ == "__main__":
    # Path settings
    REPO_PATH = './leetcode-company-wise-problems'
    OUTPUT_JSON = 'optimized_leetcode_data.json'
    
    # Script execute karna
    process_leetcode_data(REPO_PATH, OUTPUT_JSON)
