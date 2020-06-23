# spotphish-ml
Detecting phishing web site based on human perception

### Installing inside docker
1. docker pull node
2. docker run -v /home/spotphish-ml/:/home/spotphish-ml/ -v /tmp/.X11-unix:/tmp/.X11-unix --name spotphish-ml  -p 3000:3000 -e DISPLAY=unix -it node:latest
3. Go to /home/spotphish-ml and clode the git

git clone https://github.com/sudhirkr/spotphish-ml

4. Go inside the docker - docker exec -it spotphish-ml /bin/bash
5. npm install
6. Start the server - node index.js
