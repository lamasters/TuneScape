deploy_get_song:
	appwrite functions createDeployment \
    --functionId=673d545c001f5c42abf2 \
    --entrypoint='main.py' \
    --commands='pip install -r requirements.txt' \
    --code="./functions/get_song" \
    --activate=true