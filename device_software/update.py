#! /usr/bin/python3
import urllib.request
import json
import sys
from base64 import b64decode
from subprocess import call
from datetime import datetime

rootDir = '/mnt/onboard/.eframe/'
defaultSleep = 900


def getBat():
	with open('/sys/devices/platform/pmic_battery.1/power_supply/mc13892_bat/capacity') as batFile:
		battery = batFile.read().strip()

	return battery

def showImg(imgb64):
	imgPath = rootDir+'screen.raw.gz'
	
	with open(imgPath, 'wb') as imgFile:
		imgFile.write(b64decode(imgb64))
	
	call('zcat %s | /usr/local/Kobo/pickel showpic' % (imgPath), shell=True)

def sleep(sec):
	print('sleep '+str(sec))
	#call('sh '+rootDir+'sleep.sh %d' % (sec), shell=True)

def update():
	battery = getBat()
	url = 'http://eframe.tavy.org/img/%s.json' % (battery)
	
	try:	
		res = urllib.request.urlopen(url)
		strRes = res.readall().decode('utf-8')
	except Exception as e:
		strRes = str(e)
	
	with open(rootDir+'data/request_res_'+'{0:%Y-%m-%d_%H_%M_%S}'.format(datetime.now())+'.json', "w") as res_file:
		print(strRes, file=res_file)
	
	try:	
		data = json.loads(strRes)
	except ValueError:
		data = {}

	if 'img' in data:	
		showImg(data['img'])	

	#return
	if 'sleepSec' in data and data['sleepSec'] > 10:
		sleep(data['sleepSec'])
	elif not('sleepSec' in data):
		sleep(defaultSleep)
	else:
		call('sh '+rootDir+'debug.sh', shell=True)
		sys.exit()

#update()		
while True:
	update()
