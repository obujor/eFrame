#!/bin/sh
echo `date +"%d-%m-%y %T"` "starting Wifi"
ifconfig eth0 up
wlarm_le -i eth0 up
wpa_supplicant -s -i eth0 -c /etc/wpa_supplicant/wpa_supplicant.conf -C /var/run/wpa_supplicant -B
sleep 2
udhcpc -S -i eth0 -s /etc/udhcpc.d/default.script -t15 -T10 -A3 -f -q
