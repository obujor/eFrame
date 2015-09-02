#!/bin/sh
echo 1 > /sys/power/state-extended
sh /mnt/onboard/.eframe/wifidn.sh

rmmod dhd
rmmod sdio_wifi_pwr
sync

/mnt/onboard/.eframe/busybox_kobo rtcwake -m mem -s $1

insmod /drivers/ntx508/wifi/sdio_wifi_pwr.ko
insmod /drivers/ntx508/wifi/dhd.ko
sleep 2
sh /mnt/onboard/.eframe/wifiup.sh
