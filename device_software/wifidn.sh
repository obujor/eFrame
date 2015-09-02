#!/bin/sh
echo `date +"%d-%m-%y %T"` "stopping Wifi"
killall wpa_supplicant
wlarm_le -i eth0 down
ifconfig eth0 down
