#!/bin/sh

crond & 
sleep 2
echo "ch 4" > /sys/devices/platform/pmic_light.1/lit
echo "cur 0" > /sys/devices/platform/pmic_light.1/lit
echo "dc 0" > /sys/devices/platform/pmic_light.1/lit

zcat /mnt/onboard/.eframe/startup0.raw.gz | /usr/local/Kobo/pickel showpic 1

insmod /drivers/ntx508/wifi/sdio_wifi_pwr.ko
insmod /drivers/ntx508/wifi/dhd.ko
sleep 3
sh /mnt/onboard/.eframe/wifiup.sh
zcat /mnt/onboard/.eframe/startup.raw.gz | /usr/local/Kobo/pickel showpic 1
python3 /mnt/onboard/.eframe/checkDebug.py && python3 /mnt/onboard/.eframe/update.py || sh /mnt/onboard/.eframe/debug.sh
