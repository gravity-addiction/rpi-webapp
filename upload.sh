#!/bin/sh
/usr/bin/rsync -avz --no-perms --no-owner --no-group --progress --exclude ".env" ./dist/* pi@192.168.126.56:~/dev/webapp/
