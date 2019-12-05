
# Raspberry Pi Webapp

## Installation

### Install Node / Yarn Interface
```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt install gcc g++ make
sudo apt install -y nodejs

curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

yarn global add pm2
pm2 list
pm2 startup

sudo apt install authbind
sudo touch /etc/authbind/byport/80
sudo chown pi /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80
echo 'alias pm2=\'authbind --deep pm2\'' >> ~/.bashrc
source ~/.bashrc
pm2 update

```

#### Clone Webapp Repo
```
cd ~/dev/
git clone path-to-repo/webapp.git
cd webapp/api
yarn add jsonwebtoken https://github.com/strictd/easy-rbac.git bcryptjs shortid class-transformer unirest url-join perfect-scrollbar cors cookie-parser systeminformation

```

## Startup
Must web and api services must be run in separate consoles / shells
### Web Interface - Console / Shell A
```
npm start

```

### API Interface - Console / Shell B
```
chmod +x ./api.sh
./api.sh
node --max_old_space_size=100 dist/api/index.js

```

### PM2
#### Automatic Startup
```
cd ~/dev/webapp/api
pm2 start --node-args="--max_old_space_size=100" index.js --name webapp
pm2 save

```
#### Control Service
```
pm2 list
pm2 stop webapp
pm2 start webapp

```
#### Stop Automatic Startup
```
pm2 stop webapp
pm2 save

```


## Spotify Integration

### Authorization


