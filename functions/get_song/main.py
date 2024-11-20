import json, os
from hashlib import md5

from appwrite.client import Client
from appwrite.services.databases import Databases

PROJECT_ID = "6738fca6003590a48574"
DATABASE_ID = "6738fcd1001ae947ebb4"
COLLECTION_ID = "6738fcf40032b83bb255"

SONG_URL_TO_NAME = {
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925200019ea797ea1/view?project=6738fca6003590a48574&mode=admin": "Scape Main",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392526002c600a59aa/view?project=6738fca6003590a48574&mode=admin": "Autumn Voyage",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392539000c409e475e/view?project=6738fca6003590a48574&mode=admin": "Sad Meadow",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925400020f7b190dc/view?project=6738fca6003590a48574&mode=admin": "Gnome King",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739254b0037d7260544/view?project=6738fca6003590a48574&mode=admin": "Gnome Village",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925520007b16ceba8/view?project=6738fca6003590a48574&mode=admin": "Sea Shanty 2",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739255900229fadf0d9/view?project=6738fca6003590a48574&mode=admin": "Newbie Melody",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739255e001c06a2e1f7/view?project=6738fca6003590a48574&mode=admin": "Fanfare",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392561003b25c4f308/view?project=6738fca6003590a48574&mode=admin": "Harmony",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739256600086ea87205/view?project=6738fca6003590a48574&mode=admin": "Dimension X",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925690018d96935ef/view?project=6738fca6003590a48574&mode=admin": "Baroque",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739256c00285f5fc151/view?project=6738fca6003590a48574&mode=admin": "Fishing",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392570001e4267f164/view?project=6738fca6003590a48574&mode=admin": "Nightfall",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739257300361eb4098a/view?project=6738fca6003590a48574&mode=admin": "Breeze",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392577002dc3e4e8f2/view?project=6738fca6003590a48574&mode=admin": "The Tower",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739257d000abb0aa537/view?project=6738fca6003590a48574&mode=admin": "Barbarianism",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392581003a9357425a/view?project=6738fca6003590a48574&mode=admin": "Start",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392585003454b240b7/view?project=6738fca6003590a48574&mode=admin": "Quest",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/67392589001184076045/view?project=6738fca6003590a48574&mode=admin": "Sea Shanty Xmas",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739258c00381d2bda48/view?project=6738fca6003590a48574&mode=admin": "Labyrinth",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925900024caf30b12/view?project=6738fca6003590a48574&mode=admin": "Undead Dungeon",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925980011cc79918b/view?project=6738fca6003590a48574&mode=admin": "Volcanic Vikings",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/6739259c001d280cc338/view?project=6738fca6003590a48574&mode=admin": "Zombiism",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925a0003d7750c31b/view?project=6738fca6003590a48574&mode=admin": "Waterlogged",
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925a40017c365a3ee/view?project=6738fca6003590a48574&mode=admin": "Inadequacy",
}

def main(context):
    client = Client()
    client.set_endpoint("https://homelab.hippogriff-lime.ts.net/v1")
    client.set_project(PROJECT_ID)
    client.set_key(os.environ["APPWRITE_API_KEY"])
    body = json.loads(context.req.body)
    context.log(body)
    
    location = body.get("location")
    if not location:
        return context.res.json({"ok": False, "error": "Location is required"})
    
    song_key = md5(location.encode()).hexdigest()
    context.log(song_key)
    
    databases = Databases(client)
    song = databases.get_document(database_id=DATABASE_ID, collection_id=COLLECTION_ID, document_id=song_key)
    song_url = song.get("song_url")
    song_name = SONG_URL_TO_NAME.get(song_url)
    return context.res.json({"ok": True, "song_url": song_url.split("&mode=admin")[0], "song_name": song_name})