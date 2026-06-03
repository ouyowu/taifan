#!/usr/bin/env python3.11
"""
Fetch recent photos from a public Instagram profile using instaloader.
Usage:
  ig_fetch.py login <username> <password>
  ig_fetch.py fetch <ig_handle> [max_count]
Output: JSON to stdout
"""
import sys
import json
import os

SESSION_DIR = os.path.join(os.path.dirname(__file__), ".ig_sessions")

def login(username: str, password: str) -> dict:
    import instaloader
    os.makedirs(SESSION_DIR, exist_ok=True)
    L = instaloader.Instaloader()
    try:
        L.login(username, password)
        session_file = os.path.join(SESSION_DIR, f"{username}.session")
        L.save_session_to_file(session_file)
        return {"ok": True, "username": username}
    except instaloader.exceptions.BadCredentialsException:
        return {"ok": False, "error": "用户名或密码错误"}
    except instaloader.exceptions.TwoFactorAuthRequiredException:
        return {"ok": False, "error": "需要双因素验证，请先在手机上暂时关闭 2FA"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

def check_session() -> dict:
    """Return list of saved sessions."""
    if not os.path.exists(SESSION_DIR):
        return {"sessions": []}
    sessions = [f.replace(".session", "") for f in os.listdir(SESSION_DIR) if f.endswith(".session")]
    return {"sessions": sessions}

def fetch(ig_handle: str, max_count: int = 12) -> dict:
    import instaloader
    sessions = check_session()["sessions"]
    if not sessions:
        return {"ok": False, "error": "no_session", "message": "请先登录 Instagram"}

    L = instaloader.Instaloader()
    session_file = os.path.join(SESSION_DIR, f"{sessions[0]}.session")
    try:
        L.load_session_from_file(sessions[0], session_file)
    except Exception as e:
        return {"ok": False, "error": "session_expired", "message": f"Session 已过期，请重新登录: {e}"}

    try:
        profile = instaloader.Profile.from_username(L.context, ig_handle)
    except instaloader.exceptions.ProfileNotExistsException:
        return {"ok": False, "error": "not_found", "message": f"找不到 @{ig_handle}"}
    except Exception as e:
        return {"ok": False, "error": "fetch_error", "message": str(e)}

    photos = []
    try:
        for post in profile.get_posts():
            if len(photos) >= max_count:
                break
            if post.is_video:
                # For videos use the thumbnail
                url = post.url
            else:
                url = post.url
            photos.append({
                "url": url,
                "shortcode": post.shortcode,
                "likes": post.likes,
                "date": post.date.strftime("%Y-%m-%d"),
                "is_video": post.is_video,
                "caption": (post.caption or "")[:100],
            })
    except Exception as e:
        if photos:
            pass  # return what we have
        else:
            return {"ok": False, "error": "fetch_posts_error", "message": str(e)}

    return {"ok": True, "handle": ig_handle, "count": len(photos), "photos": photos}

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"

    if cmd == "login":
        username = sys.argv[2]
        password = sys.argv[3]
        print(json.dumps(login(username, password)))

    elif cmd == "fetch":
        handle = sys.argv[2]
        count = int(sys.argv[3]) if len(sys.argv) > 3 else 12
        print(json.dumps(fetch(handle, count)))

    elif cmd == "status":
        print(json.dumps(check_session()))

    else:
        print(json.dumps({"error": f"unknown command: {cmd}"}))
