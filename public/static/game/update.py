import os
import json


for filename in os.listdir('.'):
	if '.json' in filename:
		data = json.load(open(filename))
		newData = {}
		newData['frames'] = {}
		newData['meta'] = data['meta']
		newData['meta']['frameTags'].append(
			{ 'name': 'play-' + filename[:filename.find('.')], 'from': 0, 'to': len(data['frames']), 'direction': 'forward' }
		)

		for frame in data['frames']:
			frameNumber = frame[frame.find('aseprite') - 2: frame.find('aseprite') -1]

			newData['frames'][frameNumber] = data['frames'][frame]

		with open(filename, 'w') as f:
			json.dump(newData, f)
