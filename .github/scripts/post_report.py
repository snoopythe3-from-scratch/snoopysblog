import os
from datetime import datetime, timedelta
from github import Github

REPO_NAME = os.environ["REPO"]
GH_TOKEN = os.environ["GH_TOKEN"]
DISCUSSION_CATEGORY_NAME = "Reports"

def get_last_week_range():
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    return seven_days_ago.strftime("%Y-%m-%d"), now.strftime("%Y-%m-%d")

def generate_report(start, end):
    # You can expand this logic to include issues, PRs, commits, etc.
    return f"""## Weekly Report
**Period:** {start} to {end}

- This is an automated report for the past 7 days.
- Customize this section with your repo stats.
"""

def main():
    start_date, end_date = get_last_week_range()

    gh = Github(GH_TOKEN)
    repo = gh.get_repo(REPO_NAME)

    # Get the "Reports" discussion category
    categories = repo.get_discussion_categories()
    category = next((c for c in categories if c.name == DISCUSSION_CATEGORY_NAME), None)

    if not category:
        print(f"⚠️ Discussion category '{DISCUSSION_CATEGORY_NAME}' not found.")
        return

    title = f"Weekly Report: {start_date} → {end_date}"
    body = generate_report(start_date, end_date)

    repo.create_discussion(
        title=title,
        body=body,
        private=False,
        category_id=category.id
    )
    print(f"✅ Discussion created: {title}")

if __name__ == "__main__":
    main()
