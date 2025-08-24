import os
import requests
from datetime import datetime, timedelta, timezone
from github import Github

REPO_NAME = os.environ["REPO"]
GH_TOKEN = os.environ["GH_TOKEN"]
DISCUSSION_CATEGORY_NAME = "Reports"

def get_last_week_range():
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    return seven_days_ago.strftime("%Y-%m-%d"), now.strftime("%Y-%m-%d")

def generate_report(start, end):
    return f"""## Weekly Report
**Period:** {start} to {end}

- This is an automated report for the past 7 days.
- You can add commit/PR/issue statistics here.
"""

def get_discussion_category_id():
    headers = {
        "Authorization": f"Bearer {GH_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    api_url = f"https://api.github.com/repos/{REPO_NAME}/discussions/categories"
    response = requests.get(api_url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to get discussion categories: {response.text}")

    categories = response.json()
    for cat in categories:
        if cat["name"].lower() == DISCUSSION_CATEGORY_NAME.lower():
            return cat["id"]

    raise Exception(f"Category '{DISCUSSION_CATEGORY_NAME}' not found in repo {REPO_NAME}")

def main():
    start_date, end_date = get_last_week_range()

    gh = Github(GH_TOKEN)
    repo = gh.get_repo(REPO_NAME)
    category_id = get_discussion_category_id()

    title = f"Weekly Report: {start_date} → {end_date}"
    body = generate_report(start_date, end_date)

    repo.create_discussion(
        title=title,
        body=body,
        private=False,
        category_id=category_id
    )

    print(f"✅ Discussion created: {title}")

if __name__ == "__main__":
    main()
